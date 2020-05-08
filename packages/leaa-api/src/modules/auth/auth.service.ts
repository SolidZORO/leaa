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
import { checkAvailableUser, argsFormat, calcQbPageInfo, commonDelete, errorMessage } from '@leaa/api/src/utils';
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

  async auths(args: IAuthsArgs, gqlCtx?: IGqlCtx): Promise<AuthsWithPaginationObject | undefined> {
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

    if (!items) throw errorMessage({ t: ['_error:tokenNotBefore'], gqlCtx });

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

  async deleteAuth(id: string, gqlCtx?: IGqlCtx): Promise<Auth | undefined> {
    const item = await commonDelete({ repository: this.authRepository, CLS_NAME, id });

    if (!item) throw errorMessage({ t: ['_error:deleteItemFailed'], gqlCtx });

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

  getUserPayload(token?: string, gqlCtx?: IGqlCtx): IJwtPayload {
    if (!token) throw errorMessage({ t: ['_error:tokenNotFound'], gqlCtx });

    let tokenWithoutBearer = token;

    if (token.slice(0, 6) === 'Bearer') {
      tokenWithoutBearer = token.slice(7);
    } else {
      throw errorMessage({ t: ['_error:tokenNotPrefix'], gqlCtx, statusCode: 401 });
    }

    let payload;

    try {
      payload = jwt.verify(tokenWithoutBearer, this.configService.JWT_SECRET_KEY) as IJwtPayload | undefined;
    } catch (err) {
      if (err instanceof jwt.NotBeforeError) {
        throw errorMessage({ t: ['_error:tokenNotBefore'], gqlCtx, statusCode: 401 });
      }

      if (err instanceof jwt.TokenExpiredError) {
        throw errorMessage({ t: ['_error:tokenExpired'], gqlCtx, statusCode: 401 });
      }

      if (err instanceof jwt.JsonWebTokenError) {
        throw errorMessage({ t: ['_error:tokenError'], gqlCtx, statusCode: 401 });
      }
    }

    if (payload) return payload;

    throw errorMessage({ t: ['_error:tokenVerifyFaild'], gqlCtx, statusCode: 401 });
  }

  // MUST DO minimal cost query
  async validateUserByPayload(payload: IJwtPayload, gqlCtx?: IGqlCtx): Promise<User | undefined> {
    // gqlCtx in here ONLY for check `lang`
    if (!payload) throw errorMessage({ t: ['_error:notFoundInfo'], gqlCtx });

    if (!payload.iat || !payload.exp || !payload.id) {
      throw errorMessage({ t: ['_error:notFoundInfo'], gqlCtx, statusCode: 401 });
    }

    const findUser = await this.userRepository.findOne({ relations: ['roles'], where: { id: payload.id } });

    const user = checkAvailableUser(findUser, gqlCtx);

    // IMPORTANT! if user info is changed, Compare `iat` and `last_token_at`
    if (moment(payload.iattz).isBefore(moment(user.last_token_at))) {
      throw errorMessage({ t: ['_error:userHasBeenUpdated'], gqlCtx, statusCode: 401 });
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

    const gqlCtx = { lang: req.headers?.lang as string };
    const payload = this.getUserPayload(req.headers.authorization, gqlCtx);

    return this.validateUserByPayload(payload, gqlCtx);
  }

  async addTokenToUser(user: User): Promise<User> {
    const nextUser = user;
    const userAuthInfo = await this.createToken(user);

    nextUser.authToken = userAuthInfo.authToken;
    nextUser.authExpiresIn = userAuthInfo.authExpiresIn;

    return nextUser;
  }

  // TIPS: domain.com/login?otk=901d4862-0a44-xxxx-xxxx-56a9c45 (otk = auth ticket)
  async loginByTicket(ticket: string, gqlCtx?: IGqlCtx): Promise<User | undefined> {
    const user = await this.getUserByTicket(ticket, gqlCtx);

    return this.addTokenToUser(user);
  }

  async getUserByTicket(ticket: string, gqlCtx?: IGqlCtx): Promise<User> {
    if (!ticket) throw errorMessage({ t: ['_error:notFoundTicket'], gqlCtx });

    const auth = await this.authRepository.findOne({ ticket });
    if (!auth) throw errorMessage({ t: ['_error:notFoundAuth'], gqlCtx });

    const user = await this.userService.user(auth.user_id || '0', { relations: ['roles'] });
    if (!user) throw errorMessage({ t: ['_error:notFoundUser'], gqlCtx });

    await this.clearTicket(auth.id);

    return user;
  }

  async clearTicket(authId: string): Promise<void> {
    await this.authRepository.update(authId, { ticket: null, ticket_at: '' });
  }

  async bindUserIdToAuth(user: User, oid: string, gqlCtx?: IGqlCtx): Promise<any> {
    if (!oid || typeof Number(oid) !== 'number') {
      throw errorMessage({ t: ['_error:notFoundId'], gqlCtx });
    }

    const auth = await this.authRepository.findOne({ id: oid });
    if (!auth) errorMessage({ t: ['_error:notFoundAuth'], gqlCtx });

    const result = await this.authRepository.update(Number(oid), { user_id: user.id });
    if (!result) errorMessage({ t: ['_error:bindingFailed'], gqlCtx });

    return result;
  }
}
