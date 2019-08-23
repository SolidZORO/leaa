import { Request } from 'express';
import { Controller, Get, Req } from '@nestjs/common';
import { OauthService } from '@leaa/api/src/modules/oauth/oauth.service';

@Controller('/oauth')
export class OauthController {
  constructor(private readonly oauthService: OauthService) {}

  @Get('/wechat/verify')
  async wechatVerify(@Req() req: Request): Promise<any> {
    return this.oauthService.verifySignature(req);
  }

  @Get('/wechat/session')
  async wechatSession(@Req() req: Request): Promise<any> {
    return this.oauthService.getMiniProgramSession(req);
  }

  @Get('/wechat/callback')
  async wechatCallback() {
    return 'wechatCallback';
  }
}
