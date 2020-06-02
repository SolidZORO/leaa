import _ from 'lodash';
import bcryptjs from 'bcryptjs';
import * as jsondiffpatch from 'jsondiffpatch';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { CrudRequest } from '@nestjsx/crud';
import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';

import { logger } from '@leaa/api/src/utils';
import { User, Role, Auth } from '@leaa/common/src/entrys';
import { UserUpdateOneReq, UserCreateOneReq } from '@leaa/common/src/dtos/user';
import validator from 'validator';

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

  validateAccount(nextDto: UserCreateOneReq | UserUpdateOneReq, { type }: { type: 'create' | 'update' }) {
    if (type === 'create' && !nextDto.email && !nextDto.phone) throw new BadRequestException('Missing Email or Phone');

    if (nextDto.phone && !validator.isMobilePhone(nextDto.phone, 'zh-CN')) {
      throw new BadRequestException('Error Phone');
    }

    if (nextDto.email && !validator.isEmail(nextDto.email)) {
      throw new BadRequestException('Error Email');
    }

    return true;
  }

  async createOne(req: CrudRequest, dto: User & UserCreateOneReq): Promise<User> {
    const nextDto = dto;
    if (dto.password) nextDto.password = await this.createPassword(dto.password);

    this.validateAccount(nextDto, { type: 'create' });

    const hasSuperuser = await this.userRepo.findOne({ is_superuser: 1 });
    if (hasSuperuser) delete nextDto.is_superuser;

    return super.createOne(req, nextDto);
  }

  // @ts-ignore
  async updateOne(req: CrudRequest, dto: UserUpdateOneReq, jwtUser?: User): Promise<User> {
    const prevUser = await this.getOneOrFail(req);
    if (prevUser.id === jwtUser?.id) throw new ForbiddenException("Don't update yourself");
    if (prevUser.is_superuser) throw new ForbiddenException('Huh?! What R U Doing??');

    const nextDto: UserUpdateOneReq & { roles?: Role[] } = dto;

    this.validateAccount(nextDto, { type: 'update' });

    if (dto.password) nextDto.password = await this.createPassword(dto.password);

    // @TIPS 更新某些关键信息之后，可以在 validateUserByPayload 那边通过对比 last_token_at 让用户强制弹出
    if (dto.password || dto.is_admin !== prevUser.is_admin || dto.status !== prevUser.status) {
      nextDto.last_token_at = new Date();
    }

    if (dto.roleIds && _.isArray(dto.roleIds)) nextDto.roles = await this.roleRepo.findByIds(dto.roleIds);
    delete nextDto.is_superuser;

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
