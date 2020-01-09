import _ from 'lodash';
import xss from 'xss';
import bcryptjs from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '@leaa/common/src/entrys';
import { AuthLoginInput, AuthSignupInput } from '@leaa/common/src/dtos/auth';
import { errorUtil, authUtil } from '@leaa/api/src/utils';
import { UserService } from '@leaa/api/src/modules/user/user.service';
import { AuthService } from '@leaa/api/src/modules/auth/auth.service';

const CLS_NAME = 'AuthLocalService';

@Injectable()
export class AuthLocalService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

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

    return this.authService.addTokenTouser(user);
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
        await this.authService.bindUserIdToAuth(newUser, oid);
        await this.authService.clearTicket(oid);
      }
    } catch (error) {
      return errorUtil.ERROR({ error: 'Sign Up Fail' });
    }

    return this.authService.addTokenTouser(newUser);
  }
}
