import { Controller, Get, Injectable } from '@nestjs/common';
import { encodeId } from '@leaa/api/src/utils';
import { Zan } from '@leaa/common/src/entrys';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('/test')
export class TestController {
  constructor(@InjectRepository(Zan) private readonly zanRepository: Repository<Zan>) {}

  @Get('/hashids')
  async hashids() {
    const hashidsArr = [];

    for (let i = 9988; i < 99991; i += 1) {
      hashidsArr.push(encodeId(i));
    }

    return `<code>${hashidsArr.join(' ')}</code>`;
  }

  @Get('/metadata')
  async metadata() {
    console.log(Object.keys(this.zanRepository.metadata.propertiesMap));

    return 'metadata';
  }
}
