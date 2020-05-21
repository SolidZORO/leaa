import { Controller, Get } from '@nestjs/common';
import { Zan, Role } from '@leaa/common/src/entrys';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { TestService } from '@leaa/api/src/modules/test/test.service';
import { RoleService } from '@leaa/api/src/modules/role/role.service';
import { req } from '@leaa/api/src/modules/seed/__seed__.mock';
import { CrudRequest } from '@nestjsx/crud';

// import { JwtGuard } from '@leaa/api/src/guards';

@Controller('/test')
export class TestController {
  constructor(
    @InjectRepository(Zan) private readonly zanRepository: Repository<Zan>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    private readonly testService: TestService,
    private readonly roleService: RoleService,
  ) {}

  @Get('/metadata')
  async metadata() {
    console.log(Object.keys(this.zanRepository.metadata.propertiesMap));

    return 'metadata';
  }

  @Get('/crud')
  async crud() {
    // console.log(Object.keys(this.zanRepository.metadata.propertiesMap));

    const nextReq: CrudRequest = req;
    // nextReq.options.params = { id: '53474266-065f-4a14-bbe6-a4ac4dee88c8' };

    console.log(nextReq);

    return this.roleService.getOne(nextReq);

    // // const nextRole = await this.roleService.updateOne(nextReq, { permissionIds: [] });
    // const nextRole = await this.roleService.getOne(nextReq);
    //
    // // return 'metadata';
    // return nextRole;
  }
}
