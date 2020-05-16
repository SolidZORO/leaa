import { Controller, Get, Post, Req, Res, Body, Param, HttpCode, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthGithubService } from '@leaa/api/src/modules/auth/auth-github.service';
import { AuthLocalService } from '@leaa/api/src/modules/auth/auth-local.service';
import {
  IResponse,
  IRequestGithubCallback,
  IMiniprogramCloudFnResult,
  IRequest,
  ICrudRequest,
} from '@leaa/api/src/interfaces';
import { Permissions } from '@leaa/api/src/decorators';
import { AuthLoginInput } from '@leaa/common/src/dtos/auth';
import { CrudController, Crud, ParsedRequest, ParsedBody } from '@nestjsx/crud';
import { Company, Auth } from '@leaa/common/src/entrys';
import { CompanyService } from '@leaa/api/src/modules/company/company.service';
import { curdConfig } from '@leaa/api/src/configs';
import { JwtGuard, PermissionsGuard } from '@leaa/api/src/guards';

// @Crud({
//   ...curdConfig,
//   model: {
//     type: Auth,
//   },
// })
@Controller('/auth')
// export class UserController {
// export class UserController {
// @UseGuards(JwtGuard)
export class AuthController {
  constructor(public authLocalService: AuthLocalService) {}

  @HttpCode(200)
  @Post('/login')
  async login(@Req() req: ICrudRequest, @Body() body: AuthLoginInput): Promise<any> {
    return this.authLocalService.login(req, body);
  }

  // //
  // // wechat
  // @Get('/wechat/verify')
  // async wechatVerify(@Req() req: IRequest): Promise<any> {
  //   return this.authWechatService.verifySignature(req);
  // }
  //
  // @HttpCode(200)
  // @Post('/wechat/session')
  // async wechatSession(@Req() req: IRequest, @Body() body: { code: string }): Promise<any> {
  //   return this.authWechatService.getMiniProgramSession(req, body);
  // }
  //
  // @HttpCode(200)
  // @Post('/wechat/decrypt-data')
  // async wechatDecryptData(
  //   @Req() req: IRequest,
  //   @Body() body: { encryptedData: string; iv: string; sessionKey: string; platform: string },
  // ): Promise<any> {
  //   return this.authWechatService.wechatDecryptData(req, body);
  // }
  //
  // @Get('/wechat/login')
  // async wechatLogin(@Req() req: IRequest, @Res() res: IResponse): Promise<any> {
  //   return this.authWechatService.wechatLogin(req, res);
  // }
  //
  // @Get('/wechat/callback')
  // async wechatCallback(@Req() req: IRequest, @Res() res: IResponse): Promise<any> {
  //   return this.authWechatService.wechatCallback(req, res);
  // }
  //
  // //
  // // miniprogram
  // @HttpCode(200)
  // @Post('/miniprogram/login')
  // async miniprogramLogin(@Body() data: IMiniprogramCloudFnResult): Promise<any> {
  //   return this.authMiniprogramService.miniprogramLogin(data);
  // }
  //
  // //
  // // github
  // @UseGuards(AuthGuard('github'))
  // @Get('/github/login')
  // async githubLogin() {}
  //
  // @UseGuards(AuthGuard('github'))
  // @Get('/github/callback')
  // async githubCallback(@Req() req: IRequestGithubCallback, @Res() res: IResponse): Promise<any> {
  //   return this.authGithubService.githubCallback(req, res);
  // }
}
