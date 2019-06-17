import bcryptjs from 'bcryptjs';
import { Injectable, Inject } from '@nestjs/common';
import { Repository, FindOneOptions } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User, Role, Permission } from '@leaa/common/entrys';
import { UsersArgs, UsersObject, UserArgs, CreateUserInput, UpdateUserInput } from '@leaa/common/dtos/user';
import { BaseService } from '@leaa/api/modules/base/base.service';
import { RoleService } from '@leaa/api/modules/role/role.service';
import { formatUtil, loggerUtil } from '@leaa/api/utils';

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
    nextArgs.relations = ['roles'];

    return this.findAll(nextArgs);
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

    if (args) {
      nextArgs = args;
      nextArgs.relations = ['roles'];
    }

    const user = await this.findOne(id, nextArgs);

    return this.addPermissionsTouser(user);
  }

  async userByEmail(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({
      relations: ['roles'],
      where: { email },
    });

    return this.addPermissionsTouser(user);
  }

  async craeteUser(args: CreateUserInput): Promise<User | undefined> {
    const nextArgs = args;

    if (args.password) {
      const salt = bcryptjs.genSaltSync();
      nextArgs.password = bcryptjs.hashSync(args.password, salt);
    }

    return this.userRepository.save({ ...nextArgs });
  }

  async updateUser(id: number, args?: UpdateUserInput): Promise<User | undefined> {
    const relationArgs: { roles?: Role[] } = {};
    let roleObjects;

    if (args && args.roleIds) {
      roleObjects = await this.roleRepository.findByIds(args.roleIds);
    }

    if (args && args.roleSlugs) {
      const roleIds = await this.roleService.roleSlugsToIds(args.roleSlugs);
      roleObjects = await this.roleRepository.findByIds(roleIds);
    }

    if (roleObjects && roleObjects.length && roleObjects.length > 0) {
      relationArgs.roles = roleObjects;
    } else {
      const message = `roles error`;

      loggerUtil.warn(message, this.constructor.name);
      throw new Error(message);
    }

    return this.update(id, args, relationArgs);
  }

  async deleteUser(id: number): Promise<User | undefined> {
    return this.delete(id);
  }
}
