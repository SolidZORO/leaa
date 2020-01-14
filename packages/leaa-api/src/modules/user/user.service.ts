import { diff } from 'jsondiffpatch';
import bcryptjs from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User, Role, Auth } from '@leaa/common/src/entrys';
import { UsersWithPaginationObject, CreateUserInput, UpdateUserInput } from '@leaa/common/src/dtos/user';
import { RoleService } from '@leaa/api/src/modules/role/role.service';
import { ConfigService } from '@leaa/api/src/modules/config/config.service';
import { AttachmentService } from '@leaa/api/src/modules/attachment/attachment.service';
import { argsUtil, curdUtil, paginationUtil, authUtil, errUtil, loggerUtil } from '@leaa/api/src/utils';
import { JwtService } from '@nestjs/jwt';
import { IUsersArgs, IUserArgs } from '@leaa/api/src/interfaces';

const CLS_NAME = 'UserService';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(Auth) private readonly authRepository: Repository<Auth>,
    private readonly roleService: RoleService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly attachmentService: AttachmentService,
  ) {}

  async PLEASE_DONT_MODIFY_DEMO_DATA(id?: number, user?: User): Promise<boolean> {
    if (this.configService.DEMO_MODE && !process.argv.includes('--nuke')) {
      if (!id) return true;

      const u = await this.user(id, user);

      if (u && u.email && u.email === 'admin@local.com') {
        throw errUtil.ERROR({ error: errUtil.mapping.PLEASE_DONT_MODIFY.text, user });
      }
    }

    return true;
  }

  async users(args: IUsersArgs, user?: User): Promise<UsersWithPaginationObject> {
    const nextArgs: IUsersArgs = argsUtil.format(args);

    const PRIMARY_TABLE = 'users';
    const qb = this.userRepository.createQueryBuilder(PRIMARY_TABLE);

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

    // order
    if (nextArgs.orderBy && nextArgs.orderSort) {
      qb.orderBy(`${PRIMARY_TABLE}.${nextArgs.orderBy}`, nextArgs.orderSort);
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
    if (!user) return errUtil.ERROR({ error: errUtil.mapping.NOT_FOUND_ITEM.text, user: reqUser });

    return user;
  }

  async userByToken(token?: string, args?: IUserArgs): Promise<User | undefined> {
    let nextArgs: IUserArgs = {};

    if (!token) return errUtil.ERROR({ error: errUtil.mapping.TOKEN_NOT_FOUND.text });

    if (args) {
      nextArgs = args;
      nextArgs.relations = ['roles'];
    }

    console.log(token);

    // @ts-ignore
    const userDecode: { id: any } = this.jwtService.decode(token);
    if (!userDecode || !userDecode.id) return errUtil.ERROR({ error: errUtil.mapping.TOKEN_ERROR.text });

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
    if (this.configService.DEMO_MODE) await this.PLEASE_DONT_MODIFY_DEMO_DATA(id);

    if (curdUtil.isOneField(args, 'status')) return curdUtil.commonUpdate(this.userRepository, CLS_NAME, id, args);

    if (curdUtil.isOneField(args, 'avatar_url')) {
      // sync avatar
      if (args.avatar_url === null) {
        const avatarParams = {
          moduleName: 'user',
          typeName: 'avatar',
          moduleId: id,
        };

        const attachments = await this.attachmentService.attachments(avatarParams);

        if (attachments?.items && attachments?.items.length !== 0) {
          const uuids = attachments.items.map(a => a.uuid);

          loggerUtil.log(
            `Update User Delete Avatar, PARAMS: ${JSON.stringify(avatarParams)}, UUIDS: ${JSON.stringify(uuids)}`,
            CLS_NAME,
          );

          await this.attachmentService.deleteAttachments(uuids);
        }
      }

      return curdUtil.commonUpdate(this.userRepository, CLS_NAME, id, args);
    }

    const prevUser = await this.user(id, { relations: ['roles'] });

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

    const nextUser = await curdUtil.commonUpdate(this.userRepository, CLS_NAME, id, nextArgs, relationArgs);

    // @ts-ignore
    const diffObject = await diff(prevUser, nextUser);

    if (
      // @ts-ignore
      diffObject &&
      (typeof diffObject.password !== 'undefined' ||
        typeof diffObject.is_admin !== 'undefined' ||
        typeof diffObject.status !== 'undefined' ||
        typeof diffObject.roles !== 'undefined' ||
        typeof diffObject.roleIds !== 'undefined')
    ) {
      // TIPS: DONT use new Date(), server time and SQL time has diff
      await this.userRepository.update(id, { last_token_at: nextUser.updated_at });
    }

    return nextUser;
  }

  async deleteUserAllAuth(id: number): Promise<void> {
    const auths = await this.authRepository.find({ where: { user_id: id } });
    const deleteAuths = await this.authRepository.remove(auths);

    loggerUtil.log(`Delete User All Auth, ${JSON.stringify(deleteAuths)}`, CLS_NAME);
  }

  async deleteUser(id: number, user?: User): Promise<User | undefined> {
    if (this.configService.DEMO_MODE) await this.PLEASE_DONT_MODIFY_DEMO_DATA(id, user);

    const deleteUser = await curdUtil.commonDelete(this.userRepository, CLS_NAME, id);

    if (deleteUser) {
      try {
        await this.deleteUserAllAuth(id);
      } catch (err) {
        throw Error(err);
      }
    }

    return deleteUser;
  }
}
