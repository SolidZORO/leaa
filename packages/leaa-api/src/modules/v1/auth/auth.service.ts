import xss from 'xss';
import bcryptjs from 'bcryptjs';
import validator from 'validator';
import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User, Verification, Action, Auth } from '@leaa/api/src/entrys';
import { AuthLoginReq } from '@leaa/api/src/dtos/auth';
import { checkUserIsEnable, logger, checkGuthorization } from '@leaa/api/src/utils';
import { IRequest, IJwtPayload } from '@leaa/api/src/interfaces';

import moment from 'moment';
import { ConfigService } from '@leaa/api/src/modules/v1/config/config.service';
import { RoleService } from '@leaa/api/src/modules/v1/role/role.service';
import { NotFoundIpException, NotFoundTokenException, NotFoundUserException } from '@leaa/api/src/exceptions';

const CLS_NAME = 'AuthService';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private readonly authRepo: Repository<Auth>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Verification) private readonly verificationRepo: Repository<Verification>,
    @InjectRepository(Action) private readonly actionRepo: Repository<Action>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly roleService: RoleService,
  ) {}

  async login(req: IRequest, headers: any, ip: string, body: AuthLoginReq): Promise<User | undefined> {
    if (!ip) throw new NotFoundIpException();
    if (!body.account) throw new BadRequestException();

    const guthorization = checkGuthorization(headers?.guthorization);
    const account = xss.filterXSS(body.account.trim().toLowerCase());

    let where = {};
    if (validator.isEmail(account)) where = { email: account };
    if (validator.isMobilePhone(account, 'zh-CN')) where = { phone: account };

    const findUser = await this.userRepo.findOne({
      select: ['id', 'email', 'name', 'status', 'password', 'avatar_url'],
      where,
      // for get flatPermissions
      relations: ['roles'],
    });

    // create action
    const loginAction = await this.actionRepo.save({
      ip: req?.ip,
      module: 'auth',
      action: 'login',
      token: guthorization || 'no-guest-token',
      account,
    });

    const user = checkUserIsEnable(findUser);

    if (!user) throw new NotFoundTokenException();
    if (user) user.flatPermissions = await this.roleService.getFlatPermissionsByUser(user);

    // update action (add user.id)
    if (loginAction?.id) await this.actionRepo.update(loginAction.id, { user_id: user.id });

    await this.validateCaptcha(guthorization, body.captcha);
    await this.validatePassword(body.password, user.password, account);

    logger.log(`Local Login Auth, ${JSON.stringify(user)}`, CLS_NAME);

    await this.clearLoginActionAndVerification({ token: guthorization });
    await this.userRepo.update(user.id, { last_login_ip: ip, last_login_at: new Date() });

    // delete something
    delete user.roles;
    delete user.password;

    return this.addTokenToUser(user);
  }

  async validatePassword(bodyPassword: string, userPassword: string, account?: string): Promise<boolean> {
    const passwordIsMatch = await bcryptjs.compareSync(bodyPassword, userPassword);

    if (!passwordIsMatch) {
      const msg = `User (${account}) Info Not Match`;
      logger.log(msg, CLS_NAME);

      throw new BadRequestException(msg);
    }

    return true;
  }

  async validateCaptcha(token: string, captcha?: string): Promise<boolean> {
    // check Login Count at Actions
    const accountLoginCount = await this.actionRepo.count({
      where: {
        module: 'auth',
        action: 'login',
        token,
      },
    });

    // check Captcha
    if (accountLoginCount >= this.configService.ENABLE_CAPTCHA_BY_LOGIN_FAILD_TIMES) {
      const hasCaptcha = await this.verificationRepo.findOne({ token, code: captcha });
      if (!hasCaptcha) throw new BadRequestException('Verify Code Not Match');
    }

    return true;
  }

  async validateUserByPayload(jwtPayload: IJwtPayload): Promise<User | undefined> {
    if (!jwtPayload) throw new NotFoundTokenException();
    if (!jwtPayload.iat || !jwtPayload.exp || !jwtPayload.id) throw new NotFoundTokenException();

    let user = await this.userRepo.findOne({
      select: ['id', 'status', 'is_admin', 'email', 'name', 'avatar_url', 'last_token_at'],
      relations: ['roles'],
      where: { id: jwtPayload.id },
    });

    if (!user) throw new NotFoundUserException();

    user = checkUserIsEnable(user);

    /**
     * IMPORTANT! if user info is changed, Compare jwt `iattz` and `last_token_at`
     *
     * @ideaNotes
     * 对比 jwtPayload.iattz（jwt 默认的 iat 会存在 clinet 与 server 时间戳不相等问题，所以给 jwt 加了一个带 timezome 的 iat）
     * 修改 user 的 password、status、is_admin 都会更新 last_token_at 为 now()，这样保证 last_token_at 一定会大于 iattz
     * 这样用户在下一次访问的可以顺利被弹出用 : > 此方案不动用 DB 但做到了类似 backlist 的方案，非常环保
     */
    if (moment(jwtPayload.iattz).isBefore(moment(user.last_token_at))) throw new UnauthorizedException();

    const flatPermissions = await this.roleService.getFlatPermissionsByUser(user);

    // delete something
    delete user.roles;

    return { ...user, flatPermissions };
  }

  async userByToken(body?: { token?: string }): Promise<User | undefined> {
    const token = body?.token;

    if (!token) throw new NotFoundTokenException();

    // @ts-ignore
    const jwtPayload: { id: any } = this.jwtService.decode(token);

    return this.validateUserByPayload(jwtPayload);
  }

  async clearLoginActionAndVerification({ token }: { token?: string }) {
    await this.actionRepo.delete({
      module: 'auth',
      action: In(['login', 'guest']),
      token: In([token, 'no-guest-token']),
    });

    await this.verificationRepo.delete({ token });
  }

  async addTokenToUser(user: User): Promise<User> {
    const nextUser = user;
    const userAuthInfo = await this.createToken(user);

    nextUser.authToken = userAuthInfo.authToken;
    nextUser.authExpiresIn = userAuthInfo.authExpiresIn;

    return nextUser;
  }

  async createToken(user: User): Promise<{ authExpiresIn: number; authToken: string }> {
    // iattz = iat timezone
    const jwtPayload: IJwtPayload = {
      id: user.id,
      iattz: moment().toISOString(),
    };

    // https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback
    const authExpiresIn = this.configService.SERVER_COOKIE_EXPIRES_SECOND;
    const authToken = await this.jwtService.sign(jwtPayload, { expiresIn: authExpiresIn });

    return {
      authExpiresIn,
      authToken,
    };
  }
}
