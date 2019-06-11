import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '@leaa/common/entrys';
import { UsersArgs, UsersObject, UserArgs, CreateUserInput, UpdateUserInput } from '@leaa/common/dtos/user';
import { BaseService } from '@leaa/api/modules/base/base.service';

@Injectable()
export class UserService extends BaseService<User, UsersArgs, UsersObject, UserArgs, CreateUserInput, UpdateUserInput> {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {
    super(userRepository);
  }

  async users(args: UsersArgs): Promise<UsersObject> {
    return this.findAll(args);
  }

  async user(args: UserArgs): Promise<User | undefined> {
    return this.findOne(args);
  }

  async craeteUser(args: CreateUserInput): Promise<User | undefined> {
    return this.create(args);
  }

  async updateUser(id: number, args: UpdateUserInput): Promise<User | undefined> {
    return this.update(id, args);
  }

  async deleteUser(id: number): Promise<User | undefined> {
    return this.delete(id);
  }
}
