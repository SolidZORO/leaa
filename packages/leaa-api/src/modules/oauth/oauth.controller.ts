import queryString from 'query-string';
import { Request, Response } from 'express';
import { Controller, Get, Req, Res } from '@nestjs/common';
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
      a: 1,
      b: 'xxxx',
      c: 'CCCC',
      d: { d1: 1, d2: 'KKKK' },
    };

    console.log(queryString.stringify(object));

    return 'ICU';
  }
}
