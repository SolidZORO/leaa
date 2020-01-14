import moment from 'moment';
import jwt from 'jsonwebtoken';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User, Auth } from '@leaa/common/src/entrys';
import { AuthsWithPaginationObject, CreateAuthInput } from '@leaa/common/src/dtos/auth';
import { IJwtPayload } from '@leaa/common/src/interfaces';
import { ConfigService } from '@leaa/api/src/modules/config/config.service';
import { errUtil, authUtil, argsUtil, paginationUtil, curdUtil } from '@leaa/api/src/utils';
import { UserService } from '@leaa/api/src/modules/user/user.service';
import { permissionConfig } from '@leaa/api/src/configs';
import { UserProperty } from '@leaa/api/src/modules/user/user.property';
import { IAuthsArgs } from '@leaa/api/src/interfaces';

const CLS_NAME = 'AuthService';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Auth) private readonly authRepository: Repository<Auth>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly userProperty: UserProperty,
  ) {}

  async auths(args: IAuthsArgs, user?: User): Promise<AuthsWithPaginationObject | undefined> {
    const nextArgs: IAuthsArgs = argsUtil.format(args);

    const PRIMARY_TABLE = 'auths';
    const qb = await this.authRepository.createQueryBuilder(PRIMARY_TABLE);

    // q
    if (nextArgs.q) {
      const qLike = `%${nextArgs.q}%`;

      ['nickname'].forEach(key => {
        qb.andWhere(`${PRIMARY_TABLE}.${key} LIKE :${key}`, { [key]: qLike });
      });
    }

    // order
    if (nextArgs.orderBy && nextArgs.orderSort) {
      qb.orderBy(`${PRIMARY_TABLE}.${nextArgs.orderBy}`, nextArgs.orderSort);
    }

    return paginationUtil.calcQueryBuilderPageInfo({ qb, page: nextArgs.page, pageSize: nextArgs.pageSize });
  }

  async auth(id: number): Promise<Auth | undefined> {
    return this.authRepository.findOne(id);
  }

  async authByOpenId(openId: string, platform: string): Promise<Auth | undefined> {
    const qb = await this.authRepository.createQueryBuilder();

    return qb.where({ open_id: openId, platform }).getOne();
  }

  async createAuth(args: CreateAuthInput): Promise<Auth | undefined> {
    return this.authRepository.save({ ...args });
  }

  async deleteAuth(id: number): Promise<Auth | undefined> {
    return curdUtil.commonDelete(this.authRepository, CLS_NAME, id);
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

  getUserPayload(token?: string): IJwtPayload {
    if (!token) return errUtil.ERROR({ error: errUtil.mapping.TOKEN_NOT_FOUND.text });

    let tokenWithoutBearer = token;

    if (token.slice(0, 6) === 'Bearer') {
      tokenWithoutBearer = token.slice(7);
    } else {
      return errUtil.ERROR({ error: errUtil.mapping.TOKEN_NOT_PREFIX.text });
    }

    let payload;

    try {
      payload = jwt.verify(tokenWithoutBearer, this.configService.JWT_SECRET_KEY) as IJwtPayload | undefined;
    } catch (error) {
      if (error instanceof jwt.NotBeforeError) return errUtil.ERROR({ error: errUtil.mapping.TOKEN_NOT_BEFORE.text });
      if (error instanceof jwt.TokenExpiredError) return errUtil.ERROR({ error: errUtil.mapping.TOKEN_EXPIRED.text });
      if (error instanceof jwt.JsonWebTokenError) return errUtil.ERROR({ error: errUtil.mapping.TOKEN_ERROR.text });
    }

    return payload || errUtil.ERROR({ error: errUtil.mapping.TOKEN_VERIFY_FAILD.text });
  }

  // MUST DO minimal cost query
  async validateUserByPayload(payload: IJwtPayload): Promise<User | undefined> {
    if (!payload) return errUtil.ERROR({ error: errUtil.mapping.NOT_FOUND_INFO.text });

    if (!payload.iat || !payload.exp || !payload.id) {
      return errUtil.ERROR({ error: errUtil.mapping.NOT_FOUND_INFO.text });
    }

    const findUser = await this.userRepository.findOne({ relations: ['roles'], where: { id: payload.id } });

    const user = authUtil.checkAvailableUser(findUser);

    // IMPORTANT! if user info is changed, Compare `iat` and `last_token_at`
    if (moment(payload.iattz).isBefore(moment(user.last_token_at))) {
      return errUtil.ERROR({ error: errUtil.mapping.USER_HAS_BEEN_UPDATED.text });
    }

    const flatPermissions = await this.userProperty.flatPermissions(user);

    return { ...user, flatPermissions };
  }

  async validateUserByReq(req: Request): Promise<User | undefined | boolean> {
    // Graphql Playground IntrospectionQuery DOT NOT Validate
    if (req.body.query.includes('IntrospectionQuery')) {
      return true;
    }

    const isGuest = req.headers && !req.headers.authorization;

    if (req.body && isGuest && permissionConfig.notValidateUserQuerys.some(item => req.body.query.includes(item))) {
      return undefined;
    }

    const payload = this.getUserPayload(req.headers.authorization);

    return this.validateUserByPayload(payload);
  }

  async addTokenToUser(user: User): Promise<User> {
    const nextUser = user;
    const userAuthInfo = await this.createToken(user);

    nextUser.authToken = userAuthInfo.authToken;
    nextUser.authExpiresIn = userAuthInfo.authExpiresIn;

    return nextUser;
  }

  // TIPS: domain.com/login?otk=901d4862-0a44-xxxx-xxxx-56a9c45 (otk = auth ticket)
  async loginByTicket(ticket: string): Promise<User | undefined> {
    const user = await this.getUserByTicket(ticket);

    return this.addTokenToUser(user);
  }

  async getUserByTicket(ticket: string): Promise<User> {
    if (!ticket) return errUtil.ERROR({ error: errUtil.mapping.NOT_FOUND_TICKET.text });

    const auth = await this.authRepository.findOne({ ticket });
    if (!auth) return errUtil.ERROR({ error: errUtil.mapping.NOT_FOUND_AUTH.text });

    const user = await this.userService.user(auth.user_id || 0, { relations: ['roles'] });
    if (!user) return errUtil.ERROR({ error: errUtil.mapping.NOT_FOUND_USER.text });

    await this.clearTicket(auth.id);

    return user;
  }

  async clearTicket(authId: number): Promise<void> {
    await this.authRepository.update(authId, { ticket: null, ticket_at: '' });
  }

  async bindUserIdToAuth(user: User, oid: number): Promise<any> {
    if (!oid || typeof Number(oid) !== 'number') {
      return errUtil.ERROR({ error: errUtil.mapping.NOT_FOUND_ID.text, user });
    }

    const auth = await this.authRepository.findOne({ id: Number(oid) });
    if (!auth) return errUtil.ERROR({ error: errUtil.mapping.NOT_FOUND_AUTH.text, user });

    const result = await this.authRepository.update(Number(oid), { user_id: user.id });
    if (!result) return errUtil.ERROR({ error: errUtil.mapping.BINDING_FAILED.text, user });

    return result;
  }
}
