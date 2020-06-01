import { Controller, Get } from '@nestjs/common';
import { Role } from '@leaa/common/src/entrys';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { TestService } from '@leaa/api/src/modules/v1/test/test.service';
import { RoleService } from '@leaa/api/src/modules/v1/role/role.service';
import { req } from '@leaa/api/src/modules/v1/seed/__seed__.mock';
import { CrudRequest } from '@nestjsx/crud';
import { ConfigService } from '@leaa/api/src/modules/v1/config/config.service';

// import { JwtGuard } from '@leaa/api/src/guards';

@Controller('/v1/test')
export class TestController {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    readonly configService: ConfigService,
    private readonly testService: TestService,
    private readonly roleService: RoleService,
  ) {}

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

  @Get('/orm')
  async orm() {
    // console.log(this.configService.API_URL);
    return this.configService.API_URL;
  }
}
