import queryString from 'query-string';
import { Request, Response } from 'express';
import { Controller, Get, Post, Req, Res, Body, HttpCode } from '@nestjs/common';
import { OauthService } from '@leaa/api/src/modules/oauth/oauth.service';

@Controller('/oauth')
export class OauthController {
  constructor(private readonly oauthService: OauthService) {}

  @Get('/wechat/verify')
  async wechatVerify(@Req() req: Request): Promise<any> {
    return this.oauthService.verifySignature(req);
  }

  @HttpCode(200)
  @Post('/wechat/session')
  async wechatSession(@Req() req: Request, @Body() body: { code: string }): Promise<any> {
    return this.oauthService.getMiniProgramSession(req, body);
  }

  @HttpCode(200)
  @Post('/wechat/decrypt-data')
  async wechatDecryptData(
    @Req() req: Request,
    @Body() body: { encryptedData: string; iv: string; sessionKey: string; platform: string },
  ): Promise<any> {
    return this.oauthService.wechatDecryptData(req, body);
  }

  @Get('/wechat/login')
  async wechatLogin(@Req() req: Request, @Res() res: Response): Promise<any> {
    return this.oauthService.wechatLogin(req, res);
  }

  @Get('/wechat/callback')
  async wechatCallback(@Req() req: Request, @Res() res: Response): Promise<any> {
    return this.oauthService.wechatCallback(req, res);
  }

  @Get('/wechat/test')
  test() {
    const object = {
      b: 'xxxx',
      c: 'CCCC',
    };

    console.log(queryString.stringify(object));

    return 'ICU';
  }
}
