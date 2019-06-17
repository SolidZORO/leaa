import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
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
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async createToken(user: User): Promise<string> {
    const userPayload: IJwtPayload = { id: user.id };

    return this.jwtService.sign(userPayload);
  }

  public async validateUser(req: Request): Promise<User | undefined> {
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

    return this.userService.user(userPayload.id, {});
  }

  async login(args: AuthLoginInput): Promise<User | undefined> {
    const user = await this.userRepository.findOne({
      select: ['id', 'email', 'name', 'status', 'password'],
      where: {
        email: args.email,
      },
    });

    if (!user) {
      const message = `user ${args.email} does not exist`;

      loggerUtil.warn(message, this.constructor.name);
      throw new Error(message);
    }

    if (user.status !== 1) {
      const message = `user ${args.email} is disabled`;

      loggerUtil.warn(message, this.constructor.name);
      throw new Error(message);
    }

    const passwordIsMatch = await bcryptjs.compareSync(args.password, user.password);

    if (!passwordIsMatch) {
      const message = `user ${args.email} info not match`;

      loggerUtil.warn(message, this.constructor.name);
      throw new Error(message);
    }

    user.authToken = await this.createToken(user);

    return user;
  }
}
