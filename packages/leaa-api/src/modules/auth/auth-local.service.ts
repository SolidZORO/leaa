import _ from 'lodash';
import xss from 'xss';
import bcryptjs from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '@leaa/common/src/entrys';
import { AuthLoginInput, AuthSignupInput } from '@leaa/common/src/dtos/auth';
import { authUtil, loggerUtil, msgUtil } from '@leaa/api/src/utils';
import { UserService } from '@leaa/api/src/modules/user/user.service';
import { AuthService } from '@leaa/api/src/modules/auth/auth.service';
import { IGqlCtx } from '@leaa/api/src/interfaces';

const CLS_NAME = 'AuthLocalService';

@Injectable()
export class AuthLocalService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  async login(args: AuthLoginInput, gqlCtx?: IGqlCtx): Promise<User | undefined> {
    const findUser = await this.userRepository.findOne({
      select: ['id', 'email', 'name', 'status', 'password', 'avatar_url'],
      where: {
        email: xss.filterXSS(args.email.trim().toLowerCase()),
      },
      // for get flatPermissions
      relations: ['roles'],
    });

    const user = authUtil.checkAvailableUser(findUser, gqlCtx);
    const passwordIsMatch = await bcryptjs.compareSync(args.password, user.password);

    if (!passwordIsMatch) {
      const errorMessage = `User (${args.email}) Info Not Match`;
      loggerUtil.log(errorMessage, CLS_NAME);

      throw msgUtil.error({ t: ['_error:userInfoNotMatch'], gqlCtx });
    }

    if (user.password) delete user.password;

    loggerUtil.log(`Local Login Auth, ${JSON.stringify(user)}`, CLS_NAME);

    return this.authService.addTokenToUser(user);
  }

  async signup(args: AuthSignupInput, uid?: string, gqlCtx?: IGqlCtx): Promise<User | undefined> {
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

      loggerUtil.log(`Local Singup Succeed, ${JSON.stringify({ ...newUser, password: '******' })}`, CLS_NAME);

      if (uid) {
        await this.authService.bindUserIdToAuth(newUser, uid, gqlCtx);
        await this.authService.clearTicket(uid);
      }
    } catch (error) {
      loggerUtil.log(`Local Singup Error, ${JSON.stringify(error)}`, CLS_NAME);

      throw msgUtil.error({ t: ['_error:signupFailed'], gqlCtx });
    }

    return this.authService.addTokenToUser(newUser);
  }
}
