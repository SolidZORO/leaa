import queryString from 'query-string';
import { Request, Response } from 'express';
import { Controller, Get, Post, Req, Res, Body, HttpCode, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OauthWechatService } from '@leaa/api/src/modules/oauth/oauth-wechat.service';
import { OauthGithubService } from '@leaa/api/src/modules/oauth/oauth-github.service';
import { IRequest, IResponse } from '@leaa/api/src/interfaces';

@Controller('/oauth')
export class OauthController {
  constructor(
    private readonly oauthWechatService: OauthWechatService,
    private readonly oauthGithubService: OauthGithubService,
  ) {}

  //
  // wechat
  @Get('/wechat/verify')
  async wechatVerify(@Req() req: Request): Promise<any> {
    return this.oauthWechatService.verifySignature(req);
  }

  @HttpCode(200)
  @Post('/wechat/session')
  async wechatSession(@Req() req: Request, @Body() body: { code: string }): Promise<any> {
    return this.oauthWechatService.getMiniProgramSession(req, body);
  }

  @HttpCode(200)
  @Post('/wechat/decrypt-data')
  async wechatDecryptData(
    @Req() req: Request,
    @Body() body: { encryptedData: string; iv: string; sessionKey: string; platform: string },
  ): Promise<any> {
    return this.oauthWechatService.wechatDecryptData(req, body);
  }

  @Get('/wechat/login')
  async wechatLogin(@Req() req: Request, @Res() res: Response): Promise<any> {
    return this.oauthWechatService.wechatLogin(req, res);
  }

  @Get('/wechat/callback')
  async wechatCallback(@Req() req: Request, @Res() res: Response): Promise<any> {
    return this.oauthWechatService.wechatCallback(req, res);
  }

  //
  // github
  @UseGuards(AuthGuard('github'))
  @Get('/github/login')
  async githubLogin() {}

  @UseGuards(AuthGuard('github'))
  @Get('/github/callback')
  async githubCallback(@Req() req: IRequest, @Res() res: IResponse): Promise<any> {
    return this.oauthGithubService.githubCallback(req, res);
  }
}
