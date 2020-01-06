import _ from 'lodash';
import xss from 'xss';
import moment from 'moment';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '@leaa/common/src/entrys';
import { AuthLoginInput, AuthSignupInput } from '@leaa/common/src/dtos/auth';
import { IJwtPayload } from '@leaa/common/src/interfaces';
import { ConfigService } from '@leaa/api/src/modules/config/config.service';
import { errorUtil, authUtil } from '@leaa/api/src/utils';
import { UserService } from '@leaa/api/src/modules/user/user.service';
import { permissionConfig } from '@leaa/api/src/configs';
import { OauthService } from '@leaa/api/src/modules/oauth/oauth.service';
import { UserProperty } from '@leaa/api/src/modules/user/user.property';

const CLS_NAME = 'AuthService';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly oauthService: OauthService,
    private readonly userProperty: UserProperty,
  ) {}

  async createToken(user: User): Promise<{ authExpiresIn: number; authToken: string }> {
    const jwtPayload: IJwtPayload = { id: user.id };

    // https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback
    const authExpiresIn = this.configService.SERVER_COOKIE_EXPIRES_SECOND;
    const authToken = await this.jwtService.sign(jwtPayload, { expiresIn: authExpiresIn });

    return {
      authExpiresIn,
      authToken,
    };
  }

  getUserPayload(token?: string): IJwtPayload {
    if (!token) return errorUtil.ERROR({ error: 'Not Found Token' });

    let tokenWithoutBearer = token;

    if (token.slice(0, 6) === 'Bearer') {
      tokenWithoutBearer = token.slice(7);
    } else {
      return errorUtil.ERROR({ error: 'Header include incorrect Bearer prefix' });
    }

    let payload;

    try {
      payload = jwt.verify(tokenWithoutBearer, this.configService.JWT_SECRET_KEY) as IJwtPayload | undefined;
    } catch (error) {
      if (error instanceof jwt.NotBeforeError) return errorUtil.ERROR({ error: 'Your Token Has Not Before' });
      if (error instanceof jwt.TokenExpiredError) return errorUtil.ERROR({ error: 'Your Token Has Expired' });
      if (error instanceof jwt.JsonWebTokenError) return errorUtil.ERROR({ error: 'Your Token Has Error' });
    }

    return payload || errorUtil.ERROR({ error: 'Your Token Verify Faild' });
  }

  // MUST DO minimal cost query
  async validateUserByPayload(payload: IJwtPayload): Promise<User | undefined> {
    if (!payload) return errorUtil.ERROR({ error: 'Not Found Validate Info' });

    if (!payload.iat || !payload.exp || !payload.id) {
      return errorUtil.ERROR({ error: 'Not Found Validate Info Details' });
    }

    const findUser = await this.userRepository.findOne({ relations: ['roles'], where: { id: payload.id } });

    const user = authUtil.checkAvailableUser(findUser);

    // IMPORTANT! if user info is changed, Compare `iat` and `last_token_at`
    if (moment.unix(payload.iat).isBefore(moment(user.last_token_at))) {
      return errorUtil.ERROR({ error: 'Your user info has been updated, Please login again' });
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

  async addTokenTouser(user: User): Promise<User> {
    const nextUser = user;
    const userAuthInfo = await this.createToken(user);

    nextUser.authToken = userAuthInfo.authToken;
    nextUser.authExpiresIn = userAuthInfo.authExpiresIn;

    return nextUser;
  }

  async login(args: AuthLoginInput): Promise<User | undefined> {
    const findUser = await this.userRepository.findOne({
      select: ['id', 'email', 'name', 'status', 'password', 'avatar_string'],
      where: {
        email: xss.filterXSS(args.email.trim().toLowerCase()),
      },
      // for get flatPermissions
      relations: ['roles'],
    });

    const user = authUtil.checkAvailableUser(findUser);

    const passwordIsMatch = await bcryptjs.compareSync(args.password, user.password);
    if (!passwordIsMatch) return errorUtil.ERROR({ error: `User (${args.email}) Info Not Match` });

    if (user.password) delete user.password;

    return this.addTokenTouser(user);
  }

  async loginByTicket(ticket: string): Promise<User | undefined> {
    const user = await this.oauthService.getUserByTicket(ticket);

    return this.addTokenTouser(user);
  }

  async signup(args: AuthSignupInput, oid?: number): Promise<User | undefined> {
    const nextArgs: AuthSignupInput = { name: '', password: '', email: '' };

    _.forEach(args, (v, i) => {
      nextArgs[i as 'name' | 'email'] = xss.filterXSS(v || '');
    });

    if (args.password) {
      nextArgs.password = await this.userService.createPassword(args.password);
    }

    nextArgs.email = nextArgs.email.toLowerCase();

    let newUser: User;

    try {
      newUser = await this.userRepository.save({
        ...nextArgs,
        status: 1,
      });

      if (oid) {
        await this.oauthService.bindUserIdToOauth(newUser, oid);
        await this.oauthService.clearTicket(oid);
      }
    } catch (error) {
      return errorUtil.ERROR({ error: 'Sign Up Fail' });
    }

    return this.addTokenTouser(newUser);
  }
}
