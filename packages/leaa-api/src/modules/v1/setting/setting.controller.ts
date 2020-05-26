import { Controller, UseGuards, Post, Body } from '@nestjs/common';
import { Crud, CrudController, Override, ParsedRequest, ParsedBody, CrudRequest } from '@nestjsx/crud';

import { Permissions } from '@leaa/api/src/decorators';
import { CreateSettingInput, UpdateSettingInput, UpdateSettingsInput } from '@leaa/common/src/dtos/setting';
import { JwtGuard, PermissionsGuard } from '@leaa/api/src/guards';
import { Setting } from '@leaa/common/src/entrys';

import { SettingService } from './setting.service';

@Crud({
  model: { type: Setting },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  query: {
    maxLimit: 1000,
    alwaysPaginate: true,
    sort: [{ field: 'sort', order: 'ASC' }],
  },
  routes: {
    // getManyBase: { decorators: [Permissions('setting.list-read')] },
    // getOneBase: { decorators: [Permissions('setting.item-read')] },
    createOneBase: { decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('setting.item-create')] },
    updateOneBase: { decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('setting.item-update')] },
    deleteOneBase: {
      decorators: [UseGuards(JwtGuard, PermissionsGuard), Permissions('setting.item-delete')],
      returnDeleted: true,
    },
  },
  dto: {
    create: CreateSettingInput,
    update: UpdateSettingInput,
    replace: Setting,
  },
})
@Controller('/v1/settings')
export class SettingController implements CrudController<Setting> {
  constructor(public service: SettingService) {}

  @Override('updateOneBase')
  @UseGuards(JwtGuard, PermissionsGuard)
  @Permissions('setting.item-update')
  updateOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: UpdateSettingInput): Promise<Setting> {
    return this.service.updateOne(req, dto);
  }

  //

  @Post('batch')
  @UseGuards(JwtGuard, PermissionsGuard)
  @Permissions('setting.item-update')
  batchUpdate(@Body() dto: UpdateSettingsInput): Promise<string> {
    return this.service.batchUpdate(dto);
  }
}
