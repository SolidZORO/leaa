import { Controller, Get, Post, Req, Res, Body, HttpCode, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthWechatService } from '@leaa/api/src/modules/auth/auth-wechat.service';
import { AuthMiniprogramService } from '@leaa/api/src/modules/auth/auth-miniprogram.service';
import { AuthGithubService } from '@leaa/api/src/modules/auth/auth-github.service';
import { IResponse, IRequestGithubCallback, IMiniprogramCloudFnResult, IRequest } from '@leaa/api/src/interfaces';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authWechatService: AuthWechatService,
    private readonly authMiniprogramService: AuthMiniprogramService,
    private readonly authGithubService: AuthGithubService,
  ) {}

  //
  // wechat
  @Get('/wechat/verify')
  async wechatVerify(@Req() req: IRequest): Promise<any> {
    return this.authWechatService.verifySignature(req);
  }

  @HttpCode(200)
  @Post('/wechat/session')
  async wechatSession(@Req() req: IRequest, @Body() body: { code: string }): Promise<any> {
    return this.authWechatService.getMiniProgramSession(req, body);
  }

  @HttpCode(200)
  @Post('/wechat/decrypt-data')
  async wechatDecryptData(
    @Req() req: IRequest,
    @Body() body: { encryptedData: string; iv: string; sessionKey: string; platform: string },
  ): Promise<any> {
    return this.authWechatService.wechatDecryptData(req, body);
  }

  @Get('/wechat/login')
  async wechatLogin(@Req() req: IRequest, @Res() res: IResponse): Promise<any> {
    return this.authWechatService.wechatLogin(req, res);
  }

  @Get('/wechat/callback')
  async wechatCallback(@Req() req: IRequest, @Res() res: IResponse): Promise<any> {
    return this.authWechatService.wechatCallback(req, res);
  }

  //
  // miniprogram
  @HttpCode(200)
  @Post('/miniprogram/login')
  async miniprogramLogin(@Body() data: IMiniprogramCloudFnResult): Promise<any> {
    return this.authMiniprogramService.miniprogramLogin(data);
  }

  //
  // github
  @UseGuards(AuthGuard('github'))
  @Get('/github/login')
  async githubLogin() {}

  @UseGuards(AuthGuard('github'))
  @Get('/github/callback')
  async githubCallback(@Req() req: IRequestGithubCallback, @Res() res: IResponse): Promise<any> {
    return this.authGithubService.githubCallback(req, res);
  }
}
