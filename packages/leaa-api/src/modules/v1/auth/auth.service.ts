import xss from 'xss';
import bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User, Verification, Action, Auth } from '@leaa/common/src/entrys';
import { AuthLoginInput } from '@leaa/common/src/dtos/auth';
import { checkUserIsEnable, logger } from '@leaa/api/src/utils';
import { ActionService } from '@leaa/api/src/modules/v1/action/action.service';
import { ICrudRequest } from '@leaa/api/src/interfaces';
import { IJwtPayload } from '@leaa/common/src/interfaces';
import moment from 'moment';
import { ConfigService } from '@leaa/api/src/modules/v1/config/config.service';
import { RoleService } from '@leaa/api/src/modules/v1/role/role.service';
import { NotFoundIpException, NotFoundTokenException, NotFoundUserException } from '@leaa/api/src/exceptions';

const CLS_NAME = 'AuthService';

const CHECK_GUEST_COUNT_BEFORE_MINUTE = 30;
const SHOW_TOO_MANY_REQUEST_COUNT = 100;
const SHOW_CAPTCHA_BY_LOGIN_ERROR_COUNT = 3;

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
    private readonly actionService: ActionService,
  ) {}

  async login(req: ICrudRequest, ip: string, body: AuthLoginInput): Promise<User | undefined> {
    const { t } = req;

    if (!ip) throw new NotFoundIpException();

    const account = xss.filterXSS(body.email.trim().toLowerCase());

    const findUser = await this.userRepo.findOneOrFail({
      select: ['id', 'email', 'name', 'status', 'password', 'avatar_url'],
      where: {
        email: account,
      },
      // for get flatPermissions
      relations: ['roles'],
    });

    // log
    const loginAction = await this.actionService.logAction(req, {
      ip: req?.ip,
      module: 'auth',
      action: 'login',
      token: body.guestToken || 'NO-TOKEN',
      account,
    });

    const user = checkUserIsEnable(findUser);

    if (!user) throw new NotFoundTokenException();
    if (user) user.flatPermissions = await this.roleService.getFlatPermissionsByUser(user);
    //
    // // log with user_id
    // if (loginAction?.id) await this.actionService.updateAction(gqlCtx, loginAction.id, { user_id: user.id });
    //
    // //
    // //
    // // Captcha
    // //
    // // check Login Count at Actions
    // const loginCount = await this.actionRepo.count({
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
    //   const captcha = await this.verificationRepo.findOne({ token: args.guestToken, code: args.captcha });
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

      throw new UnauthorizedException();
    }

    if (user.password) delete user.password;

    logger.log(`Local Login Auth, ${JSON.stringify(user)}`, CLS_NAME);

    // last, clear Action and Verification
    await this.clearLoginActionAndVerification({ token: body.guestToken });

    await this.userRepo.update(user.id, {
      last_login_ip: ip,
      last_login_at: new Date(),
    });

    // delete something
    delete user.roles;

    return this.addTokenToUser(user);
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
      token: In([token, 'NO-TOKEN']),
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
  //     newUser = await this.userRepo.save({
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
  //   const guest = await this.verificationRepo.save({
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
  //   const guestCount = await this.actionRepo.count({
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
  //   const loginCount = await this.actionRepo.count({
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
  //   const guest = await this.verificationRepo.findOne({ token });
  //
  //   if (token && guest?.id) {
  //     await this.verificationRepo.update(guest.id, { code: captcha.text.toLowerCase() });
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

//
// @@ -1,230 +1,239 @@
//   import moment from 'moment';
// import jwt from 'jsonwebtoken';
// import { Injectable } from '@nestjs/common';
// import xss from 'xss';
// import bcryptjs from 'bcryptjs';
// import { JwtService } from '@nestjs/jwt';
// import { Repository } from 'typeorm';
// import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
// import { Repository, In } from 'typeorm';
// import { InjectRepository } from '@nestjs/typeorm';
//
// import { User, Auth, Verification } from '@leaa/common/src/entrys';
// import { AuthsWithPaginationObject, CreateAuthInput } from '@leaa/common/src/dtos/auth';
// import { IJwtPayload } from '@leaa/common/src/interfaces';
// import { ConfigService } from '@leaa/api/src/modules/config/config.service';
// import { checkUserIsEnable, argsFormat, calcQbPageInfo, commonDelete, errorMsg } from '@leaa/api/src/utils';
// import { User, Verification, Action, Auth } from '@leaa/common/src/entrys';
// import { AuthLoginInput } from '@leaa/common/src/dtos/auth';
// import { checkUserIsEnable, logger } from '@leaa/api/src/utils';
// import { UserService } from '@leaa/api/src/modules/user/user.service';
// import { permissionConfig } from '@leaa/api/src/configs';
// import { AuthService } from '@leaa/api/src/modules/auth/auth.service';
// import { ActionService } from '@leaa/api/src/modules/action/action.service';
// import { ICrudRequest } from '@leaa/api/src/interfaces';
// import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
// import { UserProperty } from '@leaa/api/src/modules/user/user.property';
// import { IAuthsArgs, IGqlCtx, IRequest } from '@leaa/api/src/interfaces';
//
// const CLS_NAME = 'AuthService';
// const CLS_NAME = 'AuthLocalService';
//
// const CHECK_GUEST_COUNT_BEFORE_MINUTE = 30;
// const SHOW_TOO_MANY_REQUEST_COUNT = 100;
// const SHOW_CAPTCHA_BY_LOGIN_ERROR_COUNT = 3;
//
// @Injectable()
// export class AuthService {
// // export class AuthLocalService {
//   export class AuthLocalService extends TypeOrmCrudService<Auth> {
//     constructor(
//       @InjectRepository(Auth) private readonly authRepo: Repository<Auth>,
//     @InjectRepository(User) private readonly userRepo: Repository<User>,
//     @InjectRepository(Auth) private readonly authRepository: Repository<Auth>,
//     @InjectRepository(Verification) private readonly verificationRepo: Repository<Verification>,
//     @InjectRepository(Action) private readonly actionRepo: Repository<Action>,
//       // @InjectRepository(Action) private readonly actionRepo: Repository<Action>,
//       private readonly jwtService: JwtService,
//       private readonly configService: ConfigService,
//       private readonly userService: UserService,
//       private readonly authService: AuthService,
//       private readonly actionService: ActionService,
//       private readonly userProperty: UserProperty,
//   ) {}
//
//     async auths(args: IAuthsArgs): Promise<AuthsWithPaginationObject | undefined> {
//       const { t } = gqlCtx;
//
//       const nextArgs: IAuthsArgs = argsFormat(args, gqlCtx);
//
//     const PRIMARY_TABLE = 'auths';
//     const qb = await this.authRepository.createQueryBuilder(PRIMARY_TABLE);
//
//     // q
//     if (nextArgs.q) {
//       const qLike = `%${nextArgs.q}%`;
//
//       ['nickname'].forEach((key) => {
//         qb.andWhere(`${PRIMARY_TABLE}.${key} LIKE :${key}`, { [key]: qLike });
//       });
//     }
//
//     // order
//     if (nextArgs.orderBy && nextArgs.orderSort) {
//       qb.orderBy(`${PRIMARY_TABLE}.${nextArgs.orderBy}`, nextArgs.orderSort);
//     }
//
//     const items = await calcQbPageInfo({ qb, page: nextArgs.page, pageSize: nextArgs.pageSize });
//
//     if (!items) throw errorMsg(t('_error:tokenNotBefore'));
//
//     return items;
//   }
//
//     async auth(id: string): Promise<Auth | undefined> {
//       return this.authRepository.findOne(id);
//     }
//
//     async authByOpenId(openId: string, platform: string): Promise<Auth | undefined> {
//       const qb = await this.authRepository.createQueryBuilder();
//
//       return qb.where({ open_id: openId, platform }).getOne();
//     }
//
//     async createAuth(args: CreateAuthInput): Promise<Auth | undefined> {
//       return this.authRepository.save({ ...args });
//     }
//
//     async deleteAuth(id: string): Promise<Auth | undefined> {
//       const { t } = gqlCtx;
//
//       const item = await commonDelete({ repository: this.authRepository, CLS_NAME, id, gqlCtx });
//
//       if (!item) throw errorMsg(t('_error:deleteItemFailed'), { gqlCtx });
//
//     return item;
//   ) {
//   super(authRepo);
// }
//
// //
// //
//
// async createToken(user: User): Promise<{ authExpiresIn: number; authToken: string }> {
//   // iattz = iat timezone
//   const jwtPayload: IJwtPayload = { id: user.id, iattz: moment().toISOString() };
//
// // https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback
// const authExpiresIn = this.configService.SERVER_COOKIE_EXPIRES_SECOND;
// const authToken = await this.jwtService.sign(jwtPayload, { expiresIn: authExpiresIn });
//
// return {
//   authExpiresIn,
//   authToken,
// };
// }
//
// getUserPayload(token: string): IJwtPayload {
//   const { t } = gqlCtx;
//
//   if (!token) throw errorMsg(t('_error:tokenNotFound'));
//
//   let tokenWithoutBearer = token;
//
//   if (token.slice(0, 6) === 'Bearer') {
//     tokenWithoutBearer = token.slice(7);
//   } else {
//     throw errorMsg(t('_error:tokenNotPrefix'), { statusCode: 401 });
//   }
//
//   let payload;
//   async login(req: ICrudRequest, body: AuthLoginInput): Promise<User | undefined> {
//     const { t } = req;
//
//     try {
//       payload = jwt.verify(tokenWithoutBearer, this.configService.JWT_SECRET_KEY) as IJwtPayload | undefined;
//     } catch (err) {
//       if (err instanceof jwt.NotBeforeError) {
//         throw errorMsg(t('_error:tokenNotBefore'), { statusCode: 401 });
//       }
//       if (!req || !req?.ip) throw new NotFoundException(t('_error:notFoundIp'));
//
//       if (err instanceof jwt.TokenExpiredError) {
//         throw errorMsg(t('_error:tokenExpired'), { statusCode: 401 });
//       }
//       const account = xss.filterXSS(body.email.trim().toLowerCase());
//
//       if (err instanceof jwt.JsonWebTokenError) {
//         throw errorMsg(t('_error:tokenError'), { statusCode: 401 });
//       }
//     }
//
//     if (payload) return payload;
//
//     throw errorMsg(t('_error:tokenVerifyFaild'), { statusCode: 401 });
//   }
//
//   // MUST DO minimal cost query
//   async validateUserByPayload(payload: IJwtPayload): Promise<User | undefined> {
//     // gqlCtx in here ONLY for check `lang`
//     if (!payload) throw errorMsg(t('_error:notFoundInfo'));
//
//   if (!payload.iat || !payload.exp || !payload.id) {
//     throw errorMsg(t('_error:notFoundInfo'), { statusCode: 401 });
//   }
//   const findUser = await this.userRepo.findOneOrFail({
//     select: ['id', 'email', 'name', 'status', 'password', 'avatar_url'],
//     where: {
//       email: account,
//     },
//     // for get flatPermissions
//     relations: ['roles'],
//   });
//
//   const findUser = await this.userRepo.findOne({ relations: ['roles'], where: { id: payload.id } });
//   // log
//   const loginAction = await this.actionService.logAction(req, {
//     ip: req?.ip,
//     module: 'auth',
//     action: 'login',
//     token: body.guestToken || 'NO-TOKEN',
//     account,
//   });
//
//   const user = checkUserIsEnable(findUser);
//
//   // IMPORTANT! if user info is changed, Compare `iat` and `last_token_at`
//   if (moment(payload.iattz).isBefore(moment(user.last_token_at))) {
//     throw errorMsg(t('_error:userHasBeenUpdated'), { statusCode: 401 });
//     if (user) {
//       user.flatPermissions = await this.userProperty.flatPermissions(user);
//     }
//
//     const flatPermissions = await this.userProperty.flatPermissions(user);
//
//     return { ...user, flatPermissions };
//   }
//
//   async validateUserByReq(req: IRequest): Promise<User | undefined | boolean> {
//     // Graphql Playground IntrospectionQuery DOT NOT Validate
//     if (req.body.query.includes('IntrospectionQuery')) {
//     return true;
//     //
//     // // log with user_id
//     // if (loginAction?.id) await this.actionService.updateAction(gqlCtx, loginAction.id, { user_id: user.id });
//     //
//     // //
//     // //
//     // // Captcha
//     // //
//     // // check Login Count at Actions
//     // const loginCount = await this.actionRepo.count({
//     //   where: {
//     //     ip: gqlCtx?.req?.ip,
//     //     module: 'auth',
//     //     action: 'login',
//     //     account,
//     //     created_at: Between(moment().subtract(CHECK_GUEST_COUNT_BEFORE_MINUTE, 'minute').toDate(), moment().toDate()),
//     //   },
//     // });
//     //
//     // // check Captcha
//     // // `SHOW_CAPTCHA_BY_LOGIN_ERROR_COUNT` MUST + 2, becuse user has not seen the verify code now.
//     // if (loginCount >= SHOW_CAPTCHA_BY_LOGIN_ERROR_COUNT + 2) {
//     //   if (!args.guestToken) throw errorMsg(t('_error:notFoundToken'), { gqlCtx });
//     //
//     //   const captcha = await this.verificationRepo.findOne({ token: args.guestToken, code: args.captcha });
//     //   if (!captcha) throw errorMsg(t('_error:verifyCodeNotMatch'), { gqlCtx });
//     // }
//     //
//     // //
//     // //
//     // // Password
//     // //
//     // check Password
//     const passwordIsMatch = await bcryptjs.compareSync(body.password, user.password);
//
//     if (!passwordIsMatch) {
//       const msg = `User (${account}) Info Not Match`;
//       logger.log(msg, CLS_NAME);
//
//       throw new UnauthorizedException(t('_error:userInfoNotMatch'));
//     }
//
//     const isGuest = req.headers && !req.headers.authorization;
//     if (user.password) delete user.password;
//
//     if (req.body && isGuest && permissionConfig.notValidateUserQuerys.some((item) => req.body.query.includes(item))) {
//       return undefined;
//     }
//     logger.log(`Local Login Auth, ${JSON.stringify(user)}`, CLS_NAME);
//
//     const payload = this.getUserPayload({ t: req.t }, req.headers.authorization);
//     // last, clear Action and Verification
//     await this.clearLoginActionAndVerification({ token: body.guestToken });
//
//     return this.validateUserByPayload(payload, { t: req.t });
//     return this.authService.addTokenToUser(user);
//   }
//
//   async addTokenToUser(user: User): Promise<User> {
//     const nextUser = user;
//     const userAuthInfo = await this.createToken(user);
//
//     nextUser.authToken = userAuthInfo.authToken;
//     nextUser.authExpiresIn = userAuthInfo.authExpiresIn;
//
//     return nextUser;
//   }
//
//   // TIPS: domain.com/login?otk=901d4862-0a44-xxxx-xxxx-56a9c45 (otk = auth ticket)
//   async loginByTicket(ticket: string): Promise<User | undefined> {
//     const user = await this.getUserByTicket(gqlCtx, ticket);
//
//     return this.addTokenToUser(user);
//   }
//
//   async getUserByTicket(ticket: string): Promise<User> {
//     const { t } = gqlCtx;
//
//     if (!ticket) throw errorMsg(t('_error:notFoundTicket'), { gqlCtx });
//
//   const auth = await this.authRepository.findOne({ ticket });
//   if (!auth) throw errorMsg(t('_error:notFoundAuth'), { gqlCtx });
//
//   const user = await this.userService.user(gqlCtx, auth.user_id || '0', { relations: ['roles'] });
//   if (!user) throw errorMsg(t('_error:notFoundUser'), { gqlCtx });
//
//   await this.clearTicket(auth.id);
//
//   return user;
//   async clearLoginActionAndVerification({ token }: { token?: string }) {
//     await this.actionRepo.delete({
//       module: 'auth',
//       action: In(['login', 'guest']),
//       token: In([token, 'NO-TOKEN']),
//     });
//     await this.verificationRepo.delete({ token });
//   }
//
//   async clearTicket(authId: string): Promise<void> {
//     await this.authRepository.update(authId, { ticket: null, ticket_at: '' });
//   }
//
//   async bindUserIdToAuth(user: User, oid: string): Promise<any> {
//     const { t } = gqlCtx;
//
//     if (!oid || typeof Number(oid) !== 'number') {
//     throw errorMsg(t('_error:notFoundId'), { gqlCtx });
//   }
//
//   const auth = await this.authRepository.findOne({ id: oid });
//   if (!auth) errorMsg(t('_error:notFoundAuth'), { gqlCtx });
//
//   const result = await this.authRepository.update(Number(oid), { user_id: user.id });
//   if (!result) errorMsg(t('_error:bindingFailed'), { gqlCtx });
//
//   return result;
// }
//   // async signup(args: AuthSignupInput, uid?: string): Promise<User | undefined> {
//   //   const { t } = gqlCtx;
//   //
//   //   const nextArgs: AuthSignupInput = { name: '', password: '', email: '' };
//   //
//   //   _.forEach(args, (v, i) => {
//   //     nextArgs[i as 'name' | 'email'] = xss.filterXSS(v || '');
//   //   });
//   //
//   //   if (args.password) {
//   //     nextArgs.password = await this.userService.createPassword(args.password);
//   //   }
//   //
//   //   nextArgs.email = nextArgs.email.toLowerCase();
//   //
//   //   let newUser: User;
//   //
//   //   try {
//   //     newUser = await this.userRepo.save({
//   //       ...nextArgs,
//   //       status: 1,
//   //     });
//   //
//   //     logger.log(`Local Singup Succeed, ${JSON.stringify({ ...newUser, password: '******' })}`, CLS_NAME);
//   //
//   //     if (uid) {
//   //       await this.authService.bindUserIdToAuth(gqlCtx, newUser, uid);
//   //       await this.authService.clearTicket(uid);
//   //     }
//   //   } catch (err) {
//   //     logger.log(`Local Singup Error, ${JSON.stringify(err)}`, CLS_NAME);
//   //
//   //     throw errorMsg(t('_error:signupFailed'), { gqlCtx });
//   //   }
//   //
//   //   return this.authService.addTokenToUser(newUser);
//   // }
//   //
//   // async createGuest(showCaptcha?: boolean): Promise<Verification | undefined> {
//   //   const captcha = svgCaptcha.create(captchaConfig.SVG_CAPTCHA);
//   //
//   //   const guest = await this.verificationRepo.save({
//   //     code: captcha.text.toLowerCase(),
//   //     token: this.jwtService.sign({}),
//   //   });
//   //
//   //   if (showCaptcha) guest.captcha = captcha.data;
//   //
//   //   delete guest.code;
//   //
//   //   return guest;
//   // }
//   //
//   // async guest(token?: string): Promise<Verification | undefined> {
//   //   const { t } = gqlCtx;
//   //
//   //   if (!gqlCtx || !gqlCtx.req?.ip) throw errorMsg(t('_error:notFoundIp'), { gqlCtx });
//   //
//   //   // Prevent hacking ( 30min - MAX - 100req)
//   //   const guestCount = await this.actionRepo.count({
//   //     where: {
//   //       ip: gqlCtx?.req?.ip,
//   //       module: 'auth',
//   //       action: 'guest',
//   //       created_at: Between(moment().subtract(CHECK_GUEST_COUNT_BEFORE_MINUTE, 'minute').toDate(), moment().toDate()),
//   //     },
//   //   });
//   //
//   //   if (guestCount >= SHOW_TOO_MANY_REQUEST_COUNT) throw errorMsg(t('_error:tooManyRequest'), { gqlCtx });
//   //
//   //   // Controller Captcha Show (for Dashboard)
//   //   // Just showCaptcha, but whether login depends on the `account` at Table `actions`
//   //   const loginCount = await this.actionRepo.count({
//   //     where: {
//   //       ip: gqlCtx?.req?.ip,
//   //       module: 'auth',
//   //       action: 'login',
//   //       token: token || 'NO-TOKEN',
//   //       created_at: Between(moment().subtract(CHECK_GUEST_COUNT_BEFORE_MINUTE, 'minute').toDate(), moment().toDate()),
//   //     },
//   //   });
//   //
//   //   const showCaptcha = loginCount > SHOW_CAPTCHA_BY_LOGIN_ERROR_COUNT;
//   //
//   //   // log
//   //   await this.actionService.createAction(gqlCtx, {
//   //     ip: gqlCtx?.req?.ip,
//   //     module: 'auth',
//   //     action: 'guest',
//   //     token: token || 'NO-TOKEN',
//   //   });
//   //
//   //   const captcha = svgCaptcha.create(captchaConfig.SVG_CAPTCHA);
//   //   const guest = await this.verificationRepo.findOne({ token });
//   //
//   //   if (token && guest?.id) {
//   //     await this.verificationRepo.update(guest.id, { code: captcha.text.toLowerCase() });
//   //
//   //     if (showCaptcha) guest.captcha = captcha.data;
//   //     delete guest.code;
//   //
//   //     return guest;
//   //   }
//   //
//   //   return this.createGuest(showCaptcha);
//   // }
// }
