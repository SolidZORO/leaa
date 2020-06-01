import { Repository, In } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CrudRequest } from '@nestjsx/crud';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { Setting } from '@leaa/common/src/entrys';
import { SettingCreateOneReq, SettingUpdateManyReq } from '@leaa/common/src/dtos/setting';

@Injectable()
export class SettingService extends TypeOrmCrudService<Setting> {
  constructor(@InjectRepository(Setting) private readonly settingRepo: Repository<Setting>) {
    super(settingRepo);
  }

  async createOne(req: CrudRequest, dto: Setting & SettingCreateOneReq): Promise<Setting> {
    return super.createOne(req, dto);
  }

  //
  //

  async batchUpdate(dto: SettingUpdateManyReq): Promise<string> {
    const batchUpdate = dto.settings.map((setting) => this.settingRepo.update(setting.id, { value: setting.value }));

    return Promise.all(batchUpdate)
      .then((data) => {
        // this.settingRepo.find({ id: In(batchIds) });
        // return 'batchUpdate Promise OK';
        return `Batch Updated ${data.length} Settings`;
      })
      .catch(() => {
        throw new NotFoundException();
      });
  }
}
