import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Zan } from '@leaa/common/src/entrys';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IRequest } from '@leaa/api/src/interfaces';
// import { JwtGuard } from '@leaa/api/src/guards';

@Controller('/test')
export class TestController {
  constructor(@InjectRepository(Zan) private readonly zanRepository: Repository<Zan>) {}

  @Get('/metadata')
  async metadata() {
    console.log(Object.keys(this.zanRepository.metadata.propertiesMap));

    return 'metadata';
  }

  @Get('/i18n')
  // @UseGuards(JwtGuard)
  async i18n(@Req() req: IRequest) {
    // return req.t('_error:notFoundItem') || 'xxxxxxxxx';
    // return msg('_error:notFoundItem');
    return req.t('_error:notFoundItem') || 'xxxxxxxxx';
  }
}
