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
import {
  argsFormat,
  commonUpdate,
  commonDelete,
  isOneField,
  calcQbPageInfo,
  can,
  logger,
  errorMsg,
} from '@leaa/api/src/utils';
import { JwtService } from '@nestjs/jwt';
import { IUsersArgs, IUserArgs, IGqlCtx } from '@leaa/api/src/interfaces';
import { UserProperty } from '@leaa/api/src/modules/user/user.property';

const CLS_NAME = 'UserService';

@Injectable()
export class UserService {
  constructor(
    private readonly roleService: RoleService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly attachmentService: AttachmentService,
    private readonly userProperty: UserProperty,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(Auth) private readonly authRepository: Repository<Auth>,
  ) {}

  async PLEASE_DONT_MODIFY_DEMO_DATA(id?: string): Promise<boolean> {
    if (this.configService.DEMO_MODE && !process.argv.includes('--nuke')) {
      if (!id) return true;

      // const u = await this.user( id);

      // if (u && u.email && u.email === 'admin@local.com') {
      //   throw errorMsg('_error:pleaseDontModify');
      // }
    }

    return true;
  }

  async users(args: IUsersArgs): Promise<UsersWithPaginationObject> {
    const nextArgs: IUsersArgs = argsFormat(args);

    const PRIMARY_TABLE = 'users';
    const qb = this.userRepository.createQueryBuilder(PRIMARY_TABLE);

    // relations
    // // if (gqlCtx?.user && can(gqlCtx.user, 'role.list-read')) {
    qb.leftJoinAndSelect(`${PRIMARY_TABLE}.roles`, 'roles');
    // // }

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
    // if (!(gqlCtx?.user && can(gqlCtx.user, 'user.list-read--all-status'))) {
    qb.andWhere('status = :status', { status: 1 });
    // }

    return calcQbPageInfo({ qb, page: nextArgs.page, pageSize: nextArgs.pageSize });
  }

  async user(id: string, args?: IUserArgs): Promise<User | undefined> {
    if (!id) throw errorMsg('_error:notFoundId');

    let nextArgs: IUserArgs = {};

    if (args) {
      nextArgs = args;
      nextArgs.relations = ['roles'];
    }

    const whereQuery: { id: string; status?: number } = { id };

    const user = await this.userRepository.findOne({ ...nextArgs, where: whereQuery });

    if (!user) throw errorMsg('_error:notFoundItem');

    return user;
  }

  async userByToken(token?: string): Promise<User | undefined> {
    console.log('><>>>>>>>>>>>>', token);

    if (!token) throw errorMsg('_error:tokenNotFound');

    // if (args) {
    //   nextArgs = args;
    //   nextArgs.relations = ['roles'];
    // }

    // @ts-ignore
    const userDecode: { id: any } = this.jwtService.decode(token);
    if (!userDecode || !userDecode.id) throw errorMsg('_error:tokenError');

    const user = await this.userRepository.findOne(userDecode.id, {
      relations: ['roles'],
    });

    if (user) {
      user.flatPermissions = await this.userProperty.flatPermissions(user);
    }

    return user;
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

  async updateUser(id: string, args: UpdateUserInput): Promise<User | undefined> {
    if (this.configService.DEMO_MODE) await this.PLEASE_DONT_MODIFY_DEMO_DATA(id);

    if (isOneField(args, 'status')) {
      return commonUpdate({ repository: this.userRepository, CLS_NAME, id, args });
    }

    if (isOneField(args, 'avatar_url')) {
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

          logger.log(
            `Update User Delete Avatar, PARAMS: ${JSON.stringify(avatarParams)}, UUIDS: ${JSON.stringify(uuids)}`,
            CLS_NAME,
          );

          await this.attachmentService.deleteAttachments(uuids);
        }
      }

      return commonUpdate({ repository: this.userRepository, CLS_NAME, id, args });
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

    const nextUser = await commonUpdate({
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

  async deleteUserAllAuth(id: string): Promise<void> {
    const auths = await this.authRepository.find({ where: { user_id: id } });

    if (auths) {
      const deleteAuths = await this.authRepository.remove(auths);
      logger.log(`Delete User All Auth, ${JSON.stringify(deleteAuths)}`, CLS_NAME);
    }
  }

  async deleteUser(id: string): Promise<User | undefined> {
    if (this.configService.DEMO_MODE) await this.PLEASE_DONT_MODIFY_DEMO_DATA(id);

    const deleteUser = await commonDelete({ repository: this.userRepository, CLS_NAME, id });

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
