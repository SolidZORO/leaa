import bcryptjs from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { Repository, FindOneOptions, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User, Role, Permission } from '@leaa/common/entrys';
import {
  UsersArgs,
  UsersWithPaginationObject,
  UserArgs,
  CreateUserInput,
  UpdateUserInput,
} from '@leaa/common/dtos/user';
import { BaseService } from '@leaa/api/modules/base/base.service';
import { RoleService } from '@leaa/api/modules/role/role.service';
import { UserProperty } from '@leaa/api/modules/user/user.property';
import { formatUtil } from '@leaa/api/utils';
import { JwtService } from '@nestjs/jwt';

const CONSTRUCTOR_NAME = 'UserService';

@Injectable()
export class UserService extends BaseService<
  User,
  UsersArgs,
  UsersWithPaginationObject,
  UserArgs,
  CreateUserInput,
  UpdateUserInput
> {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>,
    private readonly roleService: RoleService,
    private readonly jwtService: JwtService,
    private readonly userProperty: UserProperty,
  ) {
    super(userRepository);
  }

  async addPermissionsTouser(user: User | undefined): Promise<User | undefined> {
    const nextUser = user;

    if (!nextUser || !nextUser.roles) {
      return nextUser;
    }

    nextUser.flatePermissions = await this.userProperty.resolvePropertyFlatPermissions(user);

    return nextUser;
  }

  async users(args: UsersArgs): Promise<UsersWithPaginationObject> {
    const nextArgs = formatUtil.formatArgs(args);

    let whereQuery = {};

    if (nextArgs.q) {
      whereQuery = { ...whereQuery, email: Like(`%${nextArgs.q}%`) };
    }

    nextArgs.where = whereQuery;
    // nextArgs.relations = ['roles'];
    nextArgs.relations = [];

    const [items, total] = await this.userRepository.findAndCount(nextArgs);

    return {
      items,
      total,
      page: nextArgs.page || 1,
      pageSize: nextArgs.pageSize || 30,
    };
  }

  async user(id: number, args?: UserArgs & FindOneOptions<User>): Promise<User | undefined> {
    let nextArgs: FindOneOptions<User> = {};

    if (args) {
      nextArgs = args;
      nextArgs.relations = ['roles'];
    }

    const user = await this.findOne(id, nextArgs);

    return this.addPermissionsTouser(user);
  }

  async userByToken(token?: string, args?: UserArgs & FindOneOptions<User>): Promise<User | undefined> {
    let nextArgs: FindOneOptions<User> = {};

    if (!token) {
      throw Error('Not Token');
    }

    if (args) {
      nextArgs = args;
      nextArgs.relations = ['roles'];
    }

    // @ts-ignore
    const userDecode: { id: any } = this.jwtService.decode(token);

    if (!userDecode || !userDecode.id) {
      throw Error('Error Token');
    }

    return this.findOne(userDecode.id, nextArgs);
  }

  async userByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      relations: ['roles'],
      where: { email },
    });
  }

  private async craetePassword(password: string): Promise<string> {
    const salt = bcryptjs.genSaltSync();
    return bcryptjs.hashSync(password, salt);
  }

  async craeteUser(args: CreateUserInput): Promise<User | undefined> {
    const nextArgs = args;

    if (args.password) {
      nextArgs.password = await this.craetePassword(args.password);
    }

    return this.userRepository.save({ ...nextArgs });
  }

  async updateUser(id: number, args: UpdateUserInput): Promise<User | undefined> {
    const nextArgs = args;
    const relationArgs: { roles?: Role[] } = {};

    let roleObjects;

    if (typeof args.roleIds !== 'undefined') {
      roleObjects = await this.roleRepository.findByIds(args.roleIds);
    }

    if (typeof args.roleSlugs !== 'undefined') {
      const roleIds = await this.roleService.roleSlugsToIds(args.roleSlugs);
      roleObjects = await this.roleRepository.findByIds(roleIds);
    }

    if (roleObjects) {
      relationArgs.roles = roleObjects;
    }

    if (args && args.password) {
      nextArgs.password = await this.craetePassword(args.password);
    }

    return this.update(id, nextArgs, relationArgs);
  }

  async deleteUser(id: number): Promise<User | undefined> {
    return this.delete(id);
  }
}
