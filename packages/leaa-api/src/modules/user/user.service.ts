import bcryptjs from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { Repository, FindOneOptions, getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User, Role, Permission } from '@leaa/common/src/entrys';
import {
  UsersArgs,
  UsersWithPaginationObject,
  UserArgs,
  CreateUserInput,
  UpdateUserInput,
} from '@leaa/common/src/dtos/user';
import { RoleService } from '@leaa/api/src/modules/role/role.service';
import { UserProperty } from '@leaa/api/src/modules/user/user.property';
import { formatUtil, curdUtil, paginationUtil, authUtil } from '@leaa/api/src/utils';
import { JwtService } from '@nestjs/jwt';

const CONSTRUCTOR_NAME = 'UserService';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>,
    private readonly roleService: RoleService,
    private readonly jwtService: JwtService,
    private readonly userProperty: UserProperty,
  ) {}

  async addPermissionsTouser(user: User | undefined): Promise<User | undefined> {
    const nextUser = user;

    if (!nextUser || !nextUser.roles) {
      return nextUser;
    }

    nextUser.flatePermissions = await this.userProperty.resolvePropertyFlatPermissions(user);

    return nextUser;
  }

  async users(args: UsersArgs, user?: User): Promise<UsersWithPaginationObject> {
    const nextArgs = formatUtil.formatArgs(args);

    const PRIMARY_TABLE = 'users';
    const qb = getRepository(User).createQueryBuilder(PRIMARY_TABLE);
    qb.select().orderBy(`${PRIMARY_TABLE}.${nextArgs.orderBy || 'id'}`, nextArgs.orderSort);

    // relations
    if (user && authUtil.can(user, 'role.list-read')) {
      qb.leftJoinAndSelect(`${PRIMARY_TABLE}.roles`, 'roles');
    }

    // q
    if (nextArgs.q) {
      const qLike = `%${nextArgs.q}%`;

      qb.orWhere(`${PRIMARY_TABLE}.name LIKE :name`, { name: qLike });
      qb.orWhere(`${PRIMARY_TABLE}.email LIKE :email`, { email: qLike });
    }

    return paginationUtil.calcQueryBuilderPageInfo({ qb, page: nextArgs.page, pageSize: nextArgs.pageSize });
  }

  async user(id: number, args?: UserArgs & FindOneOptions<User>): Promise<User | undefined> {
    let nextArgs: FindOneOptions<User> = {};

    if (args) {
      nextArgs = args;
      nextArgs.relations = ['roles'];
    }

    const user = await this.userRepository.findOne(id, nextArgs);

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

    return this.userRepository.findOne(userDecode.id, nextArgs);
  }

  async userByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      relations: ['roles'],
      where: { email },
    });
  }

  async createPassword(password: string): Promise<string> {
    const salt = bcryptjs.genSaltSync();
    return bcryptjs.hashSync(password, salt);
  }

  async createUser(args: CreateUserInput): Promise<User | undefined> {
    const nextArgs = args;

    if (args.password) {
      nextArgs.password = await this.createPassword(args.password);
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

    if (
      (typeof args.roleIds !== 'undefined' || typeof args.roleSlugs !== 'undefined') &&
      typeof roleObjects !== 'undefined'
    ) {
      relationArgs.roles = roleObjects;
    }

    if (args && args.password) {
      nextArgs.password = await this.createPassword(args.password);
    }

    return curdUtil.commonUpdate(this.userRepository, CONSTRUCTOR_NAME, id, nextArgs, relationArgs);
  }

  async deleteUser(id: number): Promise<User | undefined> {
    // default user DONT
    if (id <= 3) {
      throw Error('PLEASE DONT');
    }

    return curdUtil.commonDelete(this.userRepository, CONSTRUCTOR_NAME, id);
  }
}
