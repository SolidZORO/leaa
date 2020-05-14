import _ from 'lodash';
import moment from 'moment';
import svgCaptcha from 'svg-captcha';
import xss from 'xss';
import bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { Repository, Between, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User, Verification, Action, Auth } from '@leaa/common/src/entrys';
import { AuthLoginInput, AuthSignupInput } from '@leaa/common/src/dtos/auth';
import { checkAvailableUser, logger, errorMsg } from '@leaa/api/src/utils';
import { UserService } from '@leaa/api/src/modules/user/user.service';
import { AuthService } from '@leaa/api/src/modules/auth/auth.service';
import { ActionService } from '@leaa/api/src/modules/action/action.service';
import { IGqlCtx, IRequest, ICrudRequest } from '@leaa/api/src/interfaces';
import { captchaConfig } from '@leaa/api/src/configs';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { UserProperty } from '@leaa/api/src/modules/user/user.property';

const CLS_NAME = 'AuthLocalService';

const CHECK_GUEST_COUNT_BEFORE_MINUTE = 30;
const SHOW_TOO_MANY_REQUEST_COUNT = 100;
const SHOW_CAPTCHA_BY_LOGIN_ERROR_COUNT = 3;

@Injectable()
// export class AuthLocalService {
export class AuthLocalService extends TypeOrmCrudService<Auth> {
  constructor(
    // @InjectRepository(Action) repo: Repository<Action>,
    @InjectRepository(Auth) repo: Repository<Auth>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Verification) private readonly verificationRepository: Repository<Verification>,
    @InjectRepository(Action) private readonly actionRepository: Repository<Action>,
    // @InjectRepository(Action) private readonly actionRepository: Repository<Action>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly actionService: ActionService,
    private readonly userProperty: UserProperty,
  ) {
    super(repo);
  }

  async login(req: ICrudRequest, body: AuthLoginInput): Promise<User | undefined> {
    const { t } = req;

    if (!req || !req?.ip) throw errorMsg(t('_error:notFoundIp'));

    const account = xss.filterXSS(body.email.trim().toLowerCase());

    const findUser = await this.userRepository.findOne({
      select: ['id', 'email', 'name', 'status', 'password', 'avatar_url'],
      where: {
        email: account,
      },
      // for get flatPermissions
      relations: ['roles'],
    });

    console.log('ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ');
    console.log('ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ', req.options);

    // log
    const loginAction = await this.actionService.logAction(req, {
      ip: req?.ip,
      module: 'auth',
      action: 'login',
      token: body.guestToken || 'NO-TOKEN',
      account,
    });
    //   {
    // const loginAction = await this.actionService.createOne(req, {
    //   // ip: req?.ip,
    //   module: 'auth',
    //   action: 'login',
    //   // token: body.guestToken || 'NO-TOKEN',
    //   // account,
    // });

    console.log('XXXXXXXXXX', loginAction);

    const user = checkAvailableUser(findUser);

    if (user) {
      user.flatPermissions = await this.userProperty.flatPermissions(user);
    }
    //
    // // log with user_id
    // if (loginAction?.id) await this.actionService.updateAction(gqlCtx, loginAction.id, { user_id: user.id });
    //
    // //
    // //
    // // Captcha
    // //
    // // check Login Count at Actions
    // const loginCount = await this.actionRepository.count({
    //   where: {
    //     ip: gqlCtx?.req?.ip,
    //     module: 'auth',
    //     action: 'login',
    //     account,
    //     created_at: Between(moment().subtract(CHECK_GUEST_COUNT_BEFORE_MINUTE, 'minute').toDate(), moment().toDate()),
    //   },
    // });
    //
    // // check Captcha
    // // `SHOW_CAPTCHA_BY_LOGIN_ERROR_COUNT` MUST + 2, becuse user has not seen the verify code now.
    // if (loginCount >= SHOW_CAPTCHA_BY_LOGIN_ERROR_COUNT + 2) {
    //   if (!args.guestToken) throw errorMsg(t('_error:notFoundToken'), { gqlCtx });
    //
    //   const captcha = await this.verificationRepository.findOne({ token: args.guestToken, code: args.captcha });
    //   if (!captcha) throw errorMsg(t('_error:verifyCodeNotMatch'), { gqlCtx });
    // }
    //
    // //
    // //
    // // Password
    // //
    // check Password
    const passwordIsMatch = await bcryptjs.compareSync(body.password, user.password);

    if (!passwordIsMatch) {
      const msg = `User (${account}) Info Not Match`;
      logger.log(msg, CLS_NAME);

      // throw errorMsg(t('_error:userInfoNotMatch'));
      throw errorMsg(t('_error:userInfoNotMatch'), { statusCode: 401 });
      // return Error('111111111111');
    }

    if (user.password) delete user.password;

    logger.log(`Local Login Auth, ${JSON.stringify(user)}`, CLS_NAME);

    // last, clear Action and Verification
    await this.clearLoginActionAndVerification({ token: body.guestToken });

    return this.authService.addTokenToUser(user);
  }

  async clearLoginActionAndVerification({ token }: { token?: string }) {
    await this.actionRepository.delete({
      module: 'auth',
      action: In(['login', 'guest']),
      token: In([token, 'NO-TOKEN']),
    });
    await this.verificationRepository.delete({ token });
  }

  // async signup(args: AuthSignupInput, uid?: string): Promise<User | undefined> {
  //   const { t } = gqlCtx;
  //
  //   const nextArgs: AuthSignupInput = { name: '', password: '', email: '' };
  //
  //   _.forEach(args, (v, i) => {
  //     nextArgs[i as 'name' | 'email'] = xss.filterXSS(v || '');
  //   });
  //
  //   if (args.password) {
  //     nextArgs.password = await this.userService.createPassword(args.password);
  //   }
  //
  //   nextArgs.email = nextArgs.email.toLowerCase();
  //
  //   let newUser: User;
  //
  //   try {
  //     newUser = await this.userRepository.save({
  //       ...nextArgs,
  //       status: 1,
  //     });
  //
  //     logger.log(`Local Singup Succeed, ${JSON.stringify({ ...newUser, password: '******' })}`, CLS_NAME);
  //
  //     if (uid) {
  //       await this.authService.bindUserIdToAuth(gqlCtx, newUser, uid);
  //       await this.authService.clearTicket(uid);
  //     }
  //   } catch (err) {
  //     logger.log(`Local Singup Error, ${JSON.stringify(err)}`, CLS_NAME);
  //
  //     throw errorMsg(t('_error:signupFailed'), { gqlCtx });
  //   }
  //
  //   return this.authService.addTokenToUser(newUser);
  // }
  //
  // async createGuest(showCaptcha?: boolean): Promise<Verification | undefined> {
  //   const captcha = svgCaptcha.create(captchaConfig.SVG_CAPTCHA);
  //
  //   const guest = await this.verificationRepository.save({
  //     code: captcha.text.toLowerCase(),
  //     token: this.jwtService.sign({}),
  //   });
  //
  //   if (showCaptcha) guest.captcha = captcha.data;
  //
  //   delete guest.code;
  //
  //   return guest;
  // }
  //
  // async guest(token?: string): Promise<Verification | undefined> {
  //   const { t } = gqlCtx;
  //
  //   if (!gqlCtx || !gqlCtx.req?.ip) throw errorMsg(t('_error:notFoundIp'), { gqlCtx });
  //
  //   // Prevent hacking ( 30min - MAX - 100req)
  //   const guestCount = await this.actionRepository.count({
  //     where: {
  //       ip: gqlCtx?.req?.ip,
  //       module: 'auth',
  //       action: 'guest',
  //       created_at: Between(moment().subtract(CHECK_GUEST_COUNT_BEFORE_MINUTE, 'minute').toDate(), moment().toDate()),
  //     },
  //   });
  //
  //   if (guestCount >= SHOW_TOO_MANY_REQUEST_COUNT) throw errorMsg(t('_error:tooManyRequest'), { gqlCtx });
  //
  //   // Controller Captcha Show (for Dashboard)
  //   // Just showCaptcha, but whether login depends on the `account` at Table `actions`
  //   const loginCount = await this.actionRepository.count({
  //     where: {
  //       ip: gqlCtx?.req?.ip,
  //       module: 'auth',
  //       action: 'login',
  //       token: token || 'NO-TOKEN',
  //       created_at: Between(moment().subtract(CHECK_GUEST_COUNT_BEFORE_MINUTE, 'minute').toDate(), moment().toDate()),
  //     },
  //   });
  //
  //   const showCaptcha = loginCount > SHOW_CAPTCHA_BY_LOGIN_ERROR_COUNT;
  //
  //   // log
  //   await this.actionService.createAction(gqlCtx, {
  //     ip: gqlCtx?.req?.ip,
  //     module: 'auth',
  //     action: 'guest',
  //     token: token || 'NO-TOKEN',
  //   });
  //
  //   const captcha = svgCaptcha.create(captchaConfig.SVG_CAPTCHA);
  //   const guest = await this.verificationRepository.findOne({ token });
  //
  //   if (token && guest?.id) {
  //     await this.verificationRepository.update(guest.id, { code: captcha.text.toLowerCase() });
  //
  //     if (showCaptcha) guest.captcha = captcha.data;
  //     delete guest.code;
  //
  //     return guest;
  //   }
  //
  //   return this.createGuest(showCaptcha);
  // }
}
