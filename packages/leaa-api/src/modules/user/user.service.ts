import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '@leaa/common/entrys';
import { GetUsersArgsDto } from '@leaa/common/dtos/user';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async getUsers(args: GetUsersArgsDto): Promise<[User[], number]> {
    return this.userRepository.findAndCount(args);
  }
}
