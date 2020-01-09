import { Request, Response } from 'express';
import { Controller, Get, Post, Req, Res, Body, HttpCode, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthWechatService } from '@leaa/api/src/modules/auth/auth-wechat.service';
import { AuthGithubService } from '@leaa/api/src/modules/auth/auth-github.service';
import { IResponse, IRequestGithubCallback } from '@leaa/api/src/interfaces';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authWechatService: AuthWechatService,
    private readonly authGithubService: AuthGithubService,
  ) {}

  //
  // wechat
  @Get('/wechat/verify')
  async wechatVerify(@Req() req: Request): Promise<any> {
    return this.authWechatService.verifySignature(req);
  }

  @HttpCode(200)
  @Post('/wechat/session')
  async wechatSession(@Req() req: Request, @Body() body: { code: string }): Promise<any> {
    return this.authWechatService.getMiniProgramSession(req, body);
  }

  @HttpCode(200)
  @Post('/wechat/decrypt-data')
  async wechatDecryptData(
    @Req() req: Request,
    @Body() body: { encryptedData: string; iv: string; sessionKey: string; platform: string },
  ): Promise<any> {
    return this.authWechatService.wechatDecryptData(req, body);
  }

  @Get('/wechat/login')
  async wechatLogin(@Req() req: Request, @Res() res: Response): Promise<any> {
    return this.authWechatService.wechatLogin(req, res);
  }

  @Get('/wechat/callback')
  async wechatCallback(@Req() req: Request, @Res() res: Response): Promise<any> {
    return this.authWechatService.wechatCallback(req, res);
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
