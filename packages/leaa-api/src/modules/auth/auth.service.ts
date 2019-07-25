import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthenticationError } from 'apollo-server-core';

import { User } from '@leaa/common/entrys';
import { AuthLoginInput } from '@leaa/common/dtos/auth';
import { IJwtPayload } from '@leaa/common/interfaces';
import { ConfigService } from '@leaa/api/modules/config/config.service';
import { loggerUtil } from '@leaa/api/utils';
import { UserService } from '@leaa/api/modules/user/user.service';
import { notValidateUserQuerys } from '@leaa/api/configs/permission.config';

const CONSTRUCTOR_NAME = 'AuthService';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async createToken(
    user: User,
  ): Promise<{
    authExpiresIn: number;
    authToken: string;
  }> {
    const jwtPayload: IJwtPayload = { id: user.id };

    // https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback
    const authExpiresIn = this.configService.SERVER_COOKIE_EXPIRES_DAY * (60 * 60 * 24);
    const authToken = await this.jwtService.sign(jwtPayload, { expiresIn: authExpiresIn });

    return {
      authExpiresIn,
      authToken,
    };
  }

  public async validateUser(payload: IJwtPayload): Promise<User | undefined | boolean> {
    return this.userService.user(payload.id, {});
  }

  public async validateUserByReq(req: Request): Promise<User | undefined | boolean> {
    if (req.body && notValidateUserQuerys.some(item => req.body.query.includes(item))) {
      return true;
    }

    const token = req.headers.authorization;

    if (!token) {
      throw new AuthenticationError('Header miss Authorization');
    }

    let tokenWithoutBearer = token;

    if (token.slice(0, 6) === 'Bearer') {
      tokenWithoutBearer = token.slice(7);
    } else {
      throw new AuthenticationError('Header include incorrect Bearer prefix');
    }

    let userPayload;

    try {
      userPayload = jwt.verify(tokenWithoutBearer, this.configService.JWT_SECRET_KEY) as (IJwtPayload | undefined);
    } catch (error) {
      if (error instanceof jwt.NotBeforeError) {
        throw new AuthenticationError('Token not before');
      }

      if (error instanceof jwt.TokenExpiredError) {
        throw new AuthenticationError('Token has expired');
      }

      if (error instanceof jwt.JsonWebTokenError) {
        throw new AuthenticationError('Token is incorrect');
      }
    }

    if (!userPayload) {
      throw Error('User payload error');
    }

    return this.validateUser(userPayload);
  }

  async login(args: AuthLoginInput): Promise<User | undefined> {
    const user = await this.userRepository.findOne({
      select: ['id', 'email', 'name', 'status', 'password'],
      where: {
        email: args.email,
      },
      // for flatePermissions
      relations: ['roles'],
    });

    if (!user) {
      const message = `user ${args.email} does not exist`;

      loggerUtil.warn(message, CONSTRUCTOR_NAME);
      throw new Error(message);
    }

    if (user.status !== 1) {
      const message = `user ${args.email} is disabled`;

      loggerUtil.warn(message, CONSTRUCTOR_NAME);
      throw new Error(message);
    }

    const passwordIsMatch = await bcryptjs.compareSync(args.password, user.password);

    if (!passwordIsMatch) {
      const message = `user ${args.email} info not match`;

      loggerUtil.warn(message, CONSTRUCTOR_NAME);
      throw new Error(message);
    }

    const userAuthInfo = await this.createToken(user);

    user.authToken = userAuthInfo.authToken;
    user.authExpiresIn = userAuthInfo.authExpiresIn;

    return user;
  }
}
