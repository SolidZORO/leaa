import bcryptjs from 'bcryptjs';
import { Injectable, Inject } from '@nestjs/common';
import { Repository, FindOneOptions, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User, Role, Permission } from '@leaa/common/entrys';
import { UsersArgs, UsersObject, UserArgs, CreateUserInput, UpdateUserInput } from '@leaa/common/dtos/user';
import { BaseService } from '@leaa/api/modules/base/base.service';
import { RoleService } from '@leaa/api/modules/role/role.service';
import { formatUtil } from '@leaa/api/utils';

@Injectable()
export class UserService extends BaseService<User, UsersArgs, UsersObject, UserArgs, CreateUserInput, UpdateUserInput> {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>,
    @Inject(RoleService) private readonly roleService: RoleService,
  ) {
    super(userRepository);
  }

  async users(args: UsersArgs): Promise<UsersObject> {
    const nextArgs = formatUtil.formatArgs(args);

    let whereQuery = {};

    if (nextArgs.q) {
      whereQuery = { ...whereQuery, email: Like(`%${nextArgs.q}%`) };
    }

    nextArgs.where = whereQuery;
    nextArgs.relations = ['roles'];

    const [items, total] = await this.userRepository.findAndCount(nextArgs);

    return {
      items,
      total,
      page: nextArgs.page || 1,
      pageSize: nextArgs.pageSize || 30,
    };
  }

  async addPermissionsTouser(user: User | undefined): Promise<User | undefined> {
    const nextUser = user;

    if (nextUser && nextUser.roles) {
      const roleIds = nextUser.roles.map(r => r.id);

      nextUser.permissions = await this.roleService.rolePermissionsByRoleIds(roleIds);

      if (nextUser.permissions && nextUser.permissions.length && nextUser.permissions.length > 0) {
        nextUser.flatePermissions = [...new Set(nextUser.permissions.map(p => p.slug))];
      }
    }

    return nextUser;
  }

  async user(id: number, args?: UserArgs & FindOneOptions<User>): Promise<User | undefined> {
    let nextArgs: FindOneOptions<User> = {};

    console.log(id);

    if (args) {
      nextArgs = args;
      nextArgs.relations = ['roles'];
    }

    const user = await this.findOne(id, nextArgs);

    console.log(user);

    return this.addPermissionsTouser(user);
  }

  async userByEmail(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({
      relations: ['roles'],
      where: { email },
    });

    return this.addPermissionsTouser(user);
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

    if (args.roleIds) {
      roleObjects = await this.roleRepository.findByIds(args.roleIds);
    }

    if (args.roleSlugs) {
      const roleIds = await this.roleService.roleSlugsToIds(args.roleSlugs);
      roleObjects = await this.roleRepository.findByIds(roleIds);
    }

    relationArgs.roles = [];

    if (roleObjects && roleObjects.length && roleObjects.length > 0) {
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
