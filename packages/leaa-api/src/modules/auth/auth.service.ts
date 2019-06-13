import bcryptjs from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '@leaa/common/entrys';
import { AuthLoginInput } from '@leaa/common/dtos/auth';
import { loggerUtil } from '@leaa/api/utils';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

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

    return user;
  }
}
