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
import { formatUtil, curdUtil, paginationUtil, authUtil, errorUtil } from '@leaa/api/src/utils';
import { JwtService } from '@nestjs/jwt';

type IUsersArgs = UsersArgs & FindOneOptions<User>;
type IUserArgs = UserArgs & FindOneOptions<User>;

const CONSTRUCTOR_NAME = 'UserService';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>,
    private readonly roleService: RoleService,
    private readonly jwtService: JwtService,
  ) {}

  async users(args: IUsersArgs, user?: User): Promise<UsersWithPaginationObject> {
    const nextArgs: IUsersArgs = formatUtil.formatArgs(args);

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

      ['name', 'email'].forEach(key => {
        qb.orWhere(`${PRIMARY_TABLE}.${key} LIKE :${key}`, { [key]: qLike });
      });
    }

    // can
    if (!(user && authUtil.can(user, 'user.list-read--all-status'))) {
      qb.andWhere('status = :status', { status: 1 });
    }

    return paginationUtil.calcQueryBuilderPageInfo({ qb, page: nextArgs.page, pageSize: nextArgs.pageSize });
  }

  async user(id: number, args?: IUserArgs, reqUser?: User): Promise<User | undefined> {
    let nextArgs: IUserArgs = {};

    if (args) {
      nextArgs = args;
      nextArgs.relations = ['roles'];
    }

    const whereQuery: { id: number; status?: number } = { id };

    const user = await this.userRepository.findOne({ ...nextArgs, where: whereQuery });
    if (!user) return errorUtil.NOT_FOUND({ user: reqUser });

    return user;
  }

  async userByToken(token?: string, args?: IUserArgs): Promise<User | undefined> {
    let nextArgs: IUserArgs = {};

    if (!token) return errorUtil.ERROR({ error: 'Not Token' });

    if (args) {
      nextArgs = args;
      nextArgs.relations = ['roles'];
    }

    // @ts-ignore
    const userDecode: { id: any } = this.jwtService.decode(token);
    if (!userDecode || !userDecode.id) return errorUtil.ERROR({ error: 'Error Token' });

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
    const nextArgs: CreateUserInput = args;

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

  async deleteUser(id: number, user?: User): Promise<User | undefined> {
    // default user DONT
    if (id <= 3) {
      return errorUtil.ERROR({ error: 'default user PLEASE DONT', user });
    }

    return curdUtil.commonDelete(this.userRepository, CONSTRUCTOR_NAME, id);
  }
}
