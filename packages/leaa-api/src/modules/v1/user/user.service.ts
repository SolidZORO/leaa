import _ from 'lodash';
import bcryptjs from 'bcryptjs';
import * as jsondiffpatch from 'jsondiffpatch';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { CrudRequest } from '@nestjsx/crud';
import { Injectable } from '@nestjs/common';

import { logger } from '@leaa/api/src/utils';
import { User, Role, Auth } from '@leaa/common/src/entrys';
import { UserUpdateOneReq, UserCreateOneReq } from '@leaa/common/src/dtos/user';

const CLS_NAME = 'UserService';

@Injectable()
export class UserService extends TypeOrmCrudService<User> {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
    @InjectRepository(Auth) private readonly authRepo: Repository<Auth>,
  ) {
    super(userRepo);
  }

  async createOne(req: CrudRequest, dto: User & UserCreateOneReq): Promise<User> {
    const nextDto = dto;
    if (dto.password) nextDto.password = await this.createPassword(dto.password);

    return super.createOne(req, nextDto);
  }

  async updateOne(req: CrudRequest, dto: UserUpdateOneReq): Promise<User> {
    const prevUser = await this.getOneOrFail(req);
    const nextDto: UserUpdateOneReq & { roles?: Role[] } = dto;

    if (dto.password) nextDto.password = await this.createPassword(dto.password);

    // @TIPS 更新某些关键信息之后，可以在 validateUserByPayload 那边通过对比 last_token_at 让用户强制弹出
    if (dto.password || dto.is_admin !== prevUser.is_admin || dto.status !== prevUser.status) {
      nextDto.last_token_at = new Date();
    }

    if (dto.roleIds && _.isArray(dto.roleIds)) nextDto.roles = await this.roleRepo.findByIds(dto.roleIds);

    const result = await super.updateOne(req, nextDto);

    // save diff data to log
    const diffData = await jsondiffpatch
      .create({ propertyFilter: (name: string) => !['password', 'updated_at'].includes(name) })
      .diff(prevUser, result);

    if (diffData) logger.log(`Update User ${result.id}, Diff Data, ${JSON.stringify(diffData)}`, CLS_NAME);

    return result;
  }

  async deleteOne(req: CrudRequest): Promise<User | void> {
    const result = await super.deleteOne(req);

    // delete user all auth/oauth
    if (result) {
      try {
        await this.deleteUserAllAuth(result.id);
      } catch (err) {
        throw Error(err.message);
      }
    }
  }

  //
  //

  async createPassword(password: string): Promise<string> {
    const salt = bcryptjs.genSaltSync();
    return bcryptjs.hashSync(password, salt);
  }

  async deleteUserAllAuth(id: string): Promise<void> {
    const auths = await this.authRepo.find({ where: { user_id: id } });

    if (auths) {
      const deleteAuths = await this.authRepo.remove(auths);
      logger.log(`Delete User All Auth, ${JSON.stringify(deleteAuths)}`, CLS_NAME);
    }
  }

  async getOneByEmail(email: string): Promise<User | undefined> {
    return this.userRepo.findOne({
      relations: ['roles'],
      where: { email },
    });
  }
}

// import { diff } from 'jsondiffpatch';
// import bcryptjs from 'bcryptjs';
// import { Injectable } from '@nestjs/common';
// import { Repository } from 'typeorm';
// import { InjectRepository } from '@nestjs/typeorm';
//
// import { User, Role, Auth } from '@leaa/common/src/entrys';
// import { UsersWithPaginationObject, UserCreateOneReq, UserUpdateOneReq } from '@leaa/common/src/dtos/user';
// import { RoleService } from '@leaa/api/src/modules/role/role.service';
// import { ConfigService } from '@leaa/api/src/modules/config/config.service';
// import { AttachmentService } from '@leaa/api/src/modules/attachment/attachment.service';
// import {
//   argsFormat,
//   commonUpdate,
//   commonDelete,
//   isOneField,
//   calcQbPageInfo,
//   can,
//   logger,
//   errorMsg,
// } from '@leaa/api/src/utils';
// import { JwtService } from '@nestjs/jwt';
// import { IUsersArgs, IUserArgs, IGqlCtx } from '@leaa/api/src/interfaces';
// import { UserProperty } from '@leaa/api/src/modules/user/user.property';
//
// const CLS_NAME = 'UserService';
//
// @Injectable()
// export class UserService {
//   constructor(
//     private readonly roleService: RoleService,
//     private readonly jwtService: JwtService,
//     private readonly configService: ConfigService,
//     private readonly attachmentService: AttachmentService,
//     private readonly userProperty: UserProperty,
//     @InjectRepository(User) private readonly userRepository: Repository<User>,
//     @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
//     @InjectRepository(Auth) private readonly authRepository: Repository<Auth>,
//   ) {}
//
//   async PLEASE_DONT_MODIFY_DEMO_DATA(id?: string): Promise<boolean> {
//     if (this.configService.DEMO_MODE && !process.argv.includes('--nuke')) {
//       if (!id) return true;
//
//       // const u = await this.user( id);
//
//       // if (u && u.email && u.email === 'admin@local.com') {
//       //   throw errorMsg('_error:pleaseDontModify');
//       // }
//     }
//
//     return true;
//   }
//
//   async users(args: IUsersArgs): Promise<UsersWithPaginationObject> {
//     const nextArgs: IUsersArgs = argsFormat(args);
//
//     const PRIMARY_TABLE = 'users';
//     const qb = this.userRepository.createQueryBuilder(PRIMARY_TABLE);
//
//     // relations
//     // // if (gqlCtx?.user && can(gqlCtx.user, 'role.list-read')) {
//     qb.leftJoinAndSelect(`${PRIMARY_TABLE}.roles`, 'roles');
//     // // }
//
//     // q
//     if (nextArgs.q) {
//       const qLike = `%${nextArgs.q}%`;
//
//       ['name', 'email'].forEach((key) => {
//         qb.orWhere(`${PRIMARY_TABLE}.${key} LIKE :${key}`, { [key]: qLike });
//       });
//     }
//
//     // order
//     if (nextArgs.orderBy && nextArgs.orderSort) {
//       qb.orderBy(`${PRIMARY_TABLE}.${nextArgs.orderBy}`, nextArgs.orderSort);
//     }
//
//     // can
//     // if (!(gqlCtx?.user && can(gqlCtx.user, 'user.list-read--all-status'))) {
//     qb.andWhere('status = :status', { status: 1 });
//     // }
//
//     return calcQbPageInfo({ qb, page: nextArgs.page, pageSize: nextArgs.pageSize });
//   }
//
//   async user(id: string, args?: IUserArgs): Promise<User | undefined> {
//     if (!id) throw errorMsg('_error:notFoundId');
//
//     let nextArgs: IUserArgs = {};
//
//     if (args) {
//       nextArgs = args;
//       nextArgs.relations = ['roles'];
//     }
//
//     const whereQuery: { id: string; status?: number } = { id };
//
//     const user = await this.userRepository.findOne({ ...nextArgs, where: whereQuery });
//
//     if (!user) throw errorMsg('_error:notFoundItem');
//
//     return user;
//   }
//
//   async userByToken(token?: string): Promise<User | undefined> {
//     console.log('><>>>>>>>>>>>>', token);
//
//     if (!token) throw errorMsg('_error:tokenNotFound');
//
//     // if (args) {
//     //   nextArgs = args;
//     //   nextArgs.relations = ['roles'];
//     // }
//
//     // @ts-ignore
//     const jwtPayload: { id: any } = this.jwtService.decode(token);
//     if (!jwtPayload || !jwtPayload.id) throw errorMsg('_error:tokenError');
//
//     const user = await this.userRepository.findOne(jwtPayload.id, {
//       relations: ['roles'],
//     });
//
//     if (user) {
//       user.flatPermissions = await this.userProperty.flatPermissions(user);
//     }
//
//     return user;
//   }
//
//   async userByEmail(email: string): Promise<User | undefined> {
//     return this.userRepository.findOne({
//       relations: ['roles'],
//       where: { email },
//     });
//   }
//

//
//   async createUser(args: UserCreateOneReq): Promise<User | undefined> {
//     const nextArgs: UserCreateOneReq = args;
//
//     if (args.password) {
//       nextArgs.password = await this.createPassword(args.password);
//     }
//
//     return this.userRepository.save({ ...nextArgs });
//   }
//
//   async updateUser(id: string, args: UserUpdateOneReq): Promise<User | undefined> {
//     if (this.configService.DEMO_MODE) await this.PLEASE_DONT_MODIFY_DEMO_DATA(id);
//
//     if (isOneField(args, 'status')) {
//       return commonUpdate({ repository: this.userRepository, CLS_NAME, id, args });
//     }
//
//     if (isOneField(args, 'avatar_url')) {
//       // sync avatar
//       if (args.avatar_url === null) {
//         const avatarParams = {
//           moduleName: 'user',
//           typeName: 'avatar',
//           moduleId: id,
//         };
//
//         const attachments = await this.attachmentService.attachments(avatarParams);
//
//         if (attachments?.items && attachments?.items.length !== 0) {
//           const uuids = attachments.items.map((a) => a.uuid);
//
//           logger.log(
//             `Update User Delete Avatar, PARAMS: ${JSON.stringify(avatarParams)}, UUIDS: ${JSON.stringify(uuids)}`,
//             CLS_NAME,
//           );
//
//           await this.attachmentService.deleteAttachments(uuids);
//         }
//       }
//
//       return commonUpdate({ repository: this.userRepository, CLS_NAME, id, args });
//     }
//
//     const prevUser = await this.user(id, { relations: ['roles'] });
//
//     const nextArgs = args;
//     const relationArgs: { roles?: Role[] } = {};
//
//     let roleObjects;
//
//     if (typeof args.roleIds !== 'undefined') {
//       roleObjects = await this.roleRepository.findByIds(args.roleIds);
//     }
//
//     if (typeof args.roleSlugs !== 'undefined') {
//       const roleIds = await this.roleService.roleSlugsToIds(args.roleSlugs);
//       roleObjects = await this.roleRepository.findByIds(roleIds);
//     }
//
//     if (
//       (typeof args.roleIds !== 'undefined' || typeof args.roleSlugs !== 'undefined') &&
//       typeof roleObjects !== 'undefined'
//     ) {
//       relationArgs.roles = roleObjects;
//     }
//
//     if (args && args.password) {
//       nextArgs.password = await this.createPassword(args.password);
//     }
//
//     const nextUser = await commonUpdate({
//       repository: this.userRepository,
//       CLS_NAME,
//       id,
//       args: nextArgs,
//       relation: relationArgs,
//     });
//
//     // @ts-ignore
//     const diffObject = await diff(prevUser, nextUser);
//
//     if (
//       // @ts-ignore
//       diffObject &&
//       (typeof diffObject.password !== 'undefined' ||
//         typeof diffObject.is_admin !== 'undefined' ||
//         typeof diffObject.status !== 'undefined' ||
//         typeof diffObject.roles !== 'undefined' ||
//         typeof diffObject.roleIds !== 'undefined')
//     ) {
//       // TIPS: DONT use new Date(), server time and SQL time has diff
//       await this.userRepository.update(id, { last_token_at: nextUser.updated_at });
//     }
//
//     return nextUser;
//   }
//

// }
