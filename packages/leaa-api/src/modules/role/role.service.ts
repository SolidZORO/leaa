import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Role } from '@leaa/common/entrys';
import { BaseService } from '@leaa/api/modules/base/base.service';
import { RolesArgs, RolesObject, RoleArgs, CreateRoleInput, UpdateRoleInput } from '@leaa/common/dtos/role';

@Injectable()
export class RoleService extends BaseService<Role, RolesArgs, RolesObject, RoleArgs, CreateRoleInput, UpdateRoleInput> {
  constructor(@InjectRepository(Role) private readonly roleRepository: Repository<Role>) {
    super(roleRepository);
  }

  async roles(args: RolesArgs): Promise<RolesObject> {
    return this.findAll(args);
  }

  async role(args: RoleArgs): Promise<Role | undefined> {
    return this.findOne(args);
  }

  async craeteRole(args: CreateRoleInput): Promise<Role | undefined> {
    return this.roleRepository.save({ ...args });
  }

  async updateRole(id: number, args: UpdateRoleInput): Promise<Role | undefined> {
    return this.update(id, args);
  }

  async deleteRole(id: number): Promise<Role | undefined> {
    return this.delete(id);
  }
}
