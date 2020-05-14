import { Controller, Get, Req, Param, Body } from '@nestjs/common';
import { Zan } from '@leaa/common/src/entrys';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IRequest } from '@leaa/api/src/interfaces';

import { TestService } from '@leaa/api/src/modules/test/test.service';
import { IAttachmentParams } from '@leaa/common/src/interfaces';

// import { JwtGuard } from '@leaa/api/src/guards';

@Controller('/test')
export class TestController {
  constructor(
    @InjectRepository(Zan) private readonly zanRepository: Repository<Zan>,
    private readonly testService: TestService,
  ) {}

  @Get('/metadata')
  async metadata() {
    console.log(Object.keys(this.zanRepository.metadata.propertiesMap));

    return 'metadata';
  }

  // @UseGuards(JwtGuard)
  @Get('/i18n/:id/:ext?')
  async i18n(@Req() req: IRequest, @Param('id') id: string, @Body() body: { sort: string; t: any }) {
    console.log(req.language);

    return this.testService.testI18n(id, { ...body, t: req.t });
  }
}
