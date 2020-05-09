import moment from 'moment';
import jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User, Auth, Verification } from '@leaa/common/src/entrys';
import { AuthsWithPaginationObject, CreateAuthInput } from '@leaa/common/src/dtos/auth';
import { IJwtPayload } from '@leaa/common/src/interfaces';
import { ConfigService } from '@leaa/api/src/modules/config/config.service';
import { checkAvailableUser, argsFormat, calcQbPageInfo, commonDelete, errorMsg } from '@leaa/api/src/utils';
import { UserService } from '@leaa/api/src/modules/user/user.service';
import { permissionConfig } from '@leaa/api/src/configs';
import { UserProperty } from '@leaa/api/src/modules/user/user.property';
import { IAuthsArgs, IGqlCtx, IRequest } from '@leaa/api/src/interfaces';

const CLS_NAME = 'AuthService';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Auth) private readonly authRepository: Repository<Auth>,
    @InjectRepository(Verification) private readonly verificationRepository: Repository<Verification>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly userProperty: UserProperty,
  ) {}

  async auths(gqlCtx: IGqlCtx, args: IAuthsArgs): Promise<AuthsWithPaginationObject | undefined> {
    const { t } = gqlCtx;

    const nextArgs: IAuthsArgs = argsFormat(args, gqlCtx);

    const PRIMARY_TABLE = 'auths';
    const qb = await this.authRepository.createQueryBuilder(PRIMARY_TABLE);

    // q
    if (nextArgs.q) {
      const qLike = `%${nextArgs.q}%`;

      ['nickname'].forEach((key) => {
        qb.andWhere(`${PRIMARY_TABLE}.${key} LIKE :${key}`, { [key]: qLike });
      });
    }

    // order
    if (nextArgs.orderBy && nextArgs.orderSort) {
      qb.orderBy(`${PRIMARY_TABLE}.${nextArgs.orderBy}`, nextArgs.orderSort);
    }

    const items = await calcQbPageInfo({ qb, page: nextArgs.page, pageSize: nextArgs.pageSize });

    if (!items) throw errorMsg(t('_error:tokenNotBefore'), { gqlCtx });

    return items;
  }

  async auth(id: string): Promise<Auth | undefined> {
    return this.authRepository.findOne(id);
  }

  async authByOpenId(openId: string, platform: string): Promise<Auth | undefined> {
    const qb = await this.authRepository.createQueryBuilder();

    return qb.where({ open_id: openId, platform }).getOne();
  }

  async createAuth(args: CreateAuthInput): Promise<Auth | undefined> {
    return this.authRepository.save({ ...args });
  }

  async deleteAuth(gqlCtx: IGqlCtx, id: string): Promise<Auth | undefined> {
    const { t } = gqlCtx;

    const item = await commonDelete({ repository: this.authRepository, CLS_NAME, id, gqlCtx });

    if (!item) throw errorMsg(t('_error:deleteItemFailed'), { gqlCtx });

    return item;
  }

  //
  //

  async createToken(user: User): Promise<{ authExpiresIn: number; authToken: string }> {
    // iattz = iat timezone
    const jwtPayload: IJwtPayload = { id: user.id, iattz: moment().toISOString() };

    // https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback
    const authExpiresIn = this.configService.SERVER_COOKIE_EXPIRES_SECOND;
    const authToken = await this.jwtService.sign(jwtPayload, { expiresIn: authExpiresIn });

    return {
      authExpiresIn,
      authToken,
    };
  }

  getUserPayload(gqlCtx: IGqlCtx, token: string): IJwtPayload {
    const { t } = gqlCtx;

    if (!token) throw errorMsg(t('_error:tokenNotFound'));

    let tokenWithoutBearer = token;

    if (token.slice(0, 6) === 'Bearer') {
      tokenWithoutBearer = token.slice(7);
    } else {
      throw errorMsg(t('_error:tokenNotPrefix'), { statusCode: 401 });
    }

    let payload;

    try {
      payload = jwt.verify(tokenWithoutBearer, this.configService.JWT_SECRET_KEY) as IJwtPayload | undefined;
    } catch (err) {
      if (err instanceof jwt.NotBeforeError) {
        throw errorMsg(t('_error:tokenNotBefore'), { statusCode: 401 });
      }

      if (err instanceof jwt.TokenExpiredError) {
        throw errorMsg(t('_error:tokenExpired'), { statusCode: 401 });
      }

      if (err instanceof jwt.JsonWebTokenError) {
        throw errorMsg(t('_error:tokenError'), { statusCode: 401 });
      }
    }

    if (payload) return payload;

    throw errorMsg(t('_error:tokenVerifyFaild'), { statusCode: 401 });
  }

  // MUST DO minimal cost query
  async validateUserByPayload(payload: IJwtPayload, gqlCtx: IGqlCtx): Promise<User | undefined> {
    const { t } = gqlCtx;

    // gqlCtx in here ONLY for check `lang`
    if (!payload) throw errorMsg(t('_error:notFoundInfo'));

    if (!payload.iat || !payload.exp || !payload.id) {
      throw errorMsg(t('_error:notFoundInfo'), { statusCode: 401 });
    }

    const findUser = await this.userRepository.findOne({ relations: ['roles'], where: { id: payload.id } });

    const user = checkAvailableUser(findUser || null, gqlCtx);

    // IMPORTANT! if user info is changed, Compare `iat` and `last_token_at`
    if (moment(payload.iattz).isBefore(moment(user.last_token_at))) {
      throw errorMsg(t('_error:userHasBeenUpdated'), { statusCode: 401 });
    }

    const flatPermissions = await this.userProperty.flatPermissions(user);

    return { ...user, flatPermissions };
  }

  async validateUserByReq(req: IRequest): Promise<User | undefined | boolean> {
    // Graphql Playground IntrospectionQuery DOT NOT Validate
    if (req.body.query.includes('IntrospectionQuery')) {
      return true;
    }

    const isGuest = req.headers && !req.headers.authorization;

    if (req.body && isGuest && permissionConfig.notValidateUserQuerys.some((item) => req.body.query.includes(item))) {
      return undefined;
    }

    const payload = this.getUserPayload({ t: req.t }, req.headers.authorization);

    return this.validateUserByPayload(payload, { t: req.t });
  }

  async addTokenToUser(user: User): Promise<User> {
    const nextUser = user;
    const userAuthInfo = await this.createToken(user);

    nextUser.authToken = userAuthInfo.authToken;
    nextUser.authExpiresIn = userAuthInfo.authExpiresIn;

    return nextUser;
  }

  // TIPS: domain.com/login?otk=901d4862-0a44-xxxx-xxxx-56a9c45 (otk = auth ticket)
  async loginByTicket(gqlCtx: IGqlCtx, ticket: string): Promise<User | undefined> {
    const user = await this.getUserByTicket(gqlCtx, ticket);

    return this.addTokenToUser(user);
  }

  async getUserByTicket(gqlCtx: IGqlCtx, ticket: string): Promise<User> {
    const { t } = gqlCtx;

    if (!ticket) throw errorMsg(t('_error:notFoundTicket'), { gqlCtx });

    const auth = await this.authRepository.findOne({ ticket });
    if (!auth) throw errorMsg(t('_error:notFoundAuth'), { gqlCtx });

    const user = await this.userService.user(gqlCtx, auth.user_id || '0', { relations: ['roles'] });
    if (!user) throw errorMsg(t('_error:notFoundUser'), { gqlCtx });

    await this.clearTicket(auth.id);

    return user;
  }

  async clearTicket(authId: string): Promise<void> {
    await this.authRepository.update(authId, { ticket: null, ticket_at: '' });
  }

  async bindUserIdToAuth(gqlCtx: IGqlCtx, user: User, oid: string): Promise<any> {
    const { t } = gqlCtx;

    if (!oid || typeof Number(oid) !== 'number') {
      throw errorMsg(t('_error:notFoundId'), { gqlCtx });
    }

    const auth = await this.authRepository.findOne({ id: oid });
    if (!auth) errorMsg(t('_error:notFoundAuth'), { gqlCtx });

    const result = await this.authRepository.update(Number(oid), { user_id: user.id });
    if (!result) errorMsg(t('_error:bindingFailed'), { gqlCtx });

    return result;
  }
}
