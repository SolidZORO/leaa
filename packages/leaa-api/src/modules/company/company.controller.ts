import { Controller, HttpCode, Post, Req, Body } from '@nestjs/common';
import { Crud, CrudController, ParsedRequest, ParsedBody } from '@nestjsx/crud';

import { crudConfig } from '@leaa/api/src/configs';
import { Company } from '@leaa/common/src/entrys';
import { ICrudRequest } from '@leaa/api/src/interfaces';
import { AuthLoginInput } from '@leaa/common/src/dtos/auth';
import { CompanyService } from './company.service';

@Crud({
  ...crudConfig,
  model: {
    type: Company,
  },
})
@Controller('/companies')
export class CompanyController implements CrudController<Company> {
  constructor(public service: CompanyService) {}

  @HttpCode(200)
  @Post('/ttt')
  // async login(@Req() req: ICrudRequest, @Body() body: AuthLoginInput): Promise<any> {
  async login(@ParsedRequest() req: ICrudRequest, @ParsedBody() body: AuthLoginInput): Promise<any> {
    // async login(@ParsedRequest() req: ICrudRequest, @ParsedBody() body: AuthLoginInput): Promise<any> {
    console.log('ParsedRequest111111111', req);
    console.log('ParsedBody22222222222', body);

    // return this.authLocalService.login(req, body);
  }
}
