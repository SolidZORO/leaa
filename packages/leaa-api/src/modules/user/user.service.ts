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
import { argsUtil, curdUtil, paginationUtil, authUtil, loggerUtil, msgUtil } from '@leaa/api/src/utils';
import { JwtService } from '@nestjs/jwt';
import { IUsersArgs, IUserArgs, IGqlCtx } from '@leaa/api/src/interfaces';

const CLS_NAME = 'UserService';

@Injectable()
export class UserService {
  constructor(
    private readonly roleService: RoleService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly attachmentService: AttachmentService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(Auth) private readonly authRepository: Repository<Auth>,
  ) {}

  async PLEASE_DONT_MODIFY_DEMO_DATA(id?: number, gqlCtx?: IGqlCtx): Promise<boolean> {
    if (this.configService.DEMO_MODE && !process.argv.includes('--nuke')) {
      if (!id) return true;

      const u = await this.user(id);

      if (u && u.email && u.email === 'admin@local.com') {
        throw msgUtil.error({ t: ['_error:pleaseDontModify'], gqlCtx });
      }
    }

    return true;
  }

  async users(args: IUsersArgs, gqlCtx?: IGqlCtx): Promise<UsersWithPaginationObject> {
    const nextArgs: IUsersArgs = argsUtil.format(args, gqlCtx);

    const PRIMARY_TABLE = 'users';
    const qb = this.userRepository.createQueryBuilder(PRIMARY_TABLE);

    // relations
    if (gqlCtx?.user && authUtil.can(gqlCtx.user, 'role.list-read')) {
      qb.leftJoinAndSelect(`${PRIMARY_TABLE}.roles`, 'roles');
    }

    // q
    if (nextArgs.q) {
      const qLike = `%${nextArgs.q}%`;

      ['name', 'email'].forEach((key) => {
        qb.orWhere(`${PRIMARY_TABLE}.${key} LIKE :${key}`, { [key]: qLike });
      });
    }

    // order
    if (nextArgs.orderBy && nextArgs.orderSort) {
      qb.orderBy(`${PRIMARY_TABLE}.${nextArgs.orderBy}`, nextArgs.orderSort);
    }

    // can
    if (!(gqlCtx?.user && authUtil.can(gqlCtx.user, 'user.list-read--all-status'))) {
      qb.andWhere('status = :status', { status: 1 });
    }

    return paginationUtil.calcQbPageInfo({ qb, page: nextArgs.page, pageSize: nextArgs.pageSize });
  }

  async user(id: number, args?: IUserArgs, gqlCtx?: IGqlCtx): Promise<User | undefined> {
    let nextArgs: IUserArgs = {};

    if (args) {
      nextArgs = args;
      nextArgs.relations = ['roles'];
    }

    const whereQuery: { id: number; status?: number } = { id };

    const user = await this.userRepository.findOne({ ...nextArgs, where: whereQuery });

    if (!user) throw msgUtil.error({ t: ['_error:notFoundItem'], gqlCtx });

    return user;
  }

  async userByToken(token?: string, args?: IUserArgs, gqlCtx?: IGqlCtx): Promise<User | undefined> {
    let nextArgs: IUserArgs = {};

    if (!token) throw msgUtil.error({ t: ['_error:tokenNotFound'], gqlCtx });

    if (args) {
      nextArgs = args;
      nextArgs.relations = ['roles'];
    }

    // @ts-ignore
    const userDecode: { id: any } = this.jwtService.decode(token);
    if (!userDecode || !userDecode.id) throw msgUtil.error({ t: ['_error:tokenError'], gqlCtx });

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

  async updateUser(id: number, args: UpdateUserInput, gqlCtx?: IGqlCtx): Promise<User | undefined> {
    if (this.configService.DEMO_MODE) await this.PLEASE_DONT_MODIFY_DEMO_DATA(id, gqlCtx);

    if (curdUtil.isOneField(args, 'status')) {
      return curdUtil.commonUpdate({ repository: this.userRepository, CLS_NAME, id, args });
    }

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
          const uuids = attachments.items.map((a) => a.uuid);

          loggerUtil.log(
            `Update User Delete Avatar, PARAMS: ${JSON.stringify(avatarParams)}, UUIDS: ${JSON.stringify(uuids)}`,
            CLS_NAME,
          );

          await this.attachmentService.deleteAttachments(uuids);
        }
      }

      return curdUtil.commonUpdate({ repository: this.userRepository, CLS_NAME, id, args });
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

    const nextUser = await curdUtil.commonUpdate({
      repository: this.userRepository,
      CLS_NAME,
      id,
      args: nextArgs,
      relation: relationArgs,
    });

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

    if (auths) {
      const deleteAuths = await this.authRepository.remove(auths);
      loggerUtil.log(`Delete User All Auth, ${JSON.stringify(deleteAuths)}`, CLS_NAME);
    }
  }

  async deleteUser(id: number, gqlCtx?: IGqlCtx): Promise<User | undefined> {
    if (this.configService.DEMO_MODE) await this.PLEASE_DONT_MODIFY_DEMO_DATA(id, gqlCtx);

    const deleteUser = await curdUtil.commonDelete({ repository: this.userRepository, CLS_NAME, id });

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
