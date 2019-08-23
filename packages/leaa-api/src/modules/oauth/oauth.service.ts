import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wechat, MiniProgram } from 'wechat-jssdk';

import { User } from '@leaa/common/src/entrys';
import { oauthConfig } from '@leaa/api/src/configs';
import { Request } from 'express';

const CONSTRUCTOR_NAME = 'OauthService';

@Injectable()
export class OauthService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async oauthWechat(query: any): Promise<any> {
    console.log('QUERY ----------->', query);

    const wx = new Wechat(oauthConfig.wechat);
    const xcx = new MiniProgram(oauthConfig.wechat);

    if (query.code) {
      const sss = await xcx.getSession(query.code);

      console.log(sss);

      return sss;
    }

    // const s = await wx.jssdk.getSignature(url);
    const sss = await wx.jssdk.verifySignature(query);

    if (sss) {
      return query.echostr;
    }

    return null;
  }

  async verifySignature(req: Request): Promise<string | null> {
    console.log('verifySignature REQ >>>>>>>>', req.query);

    const wechat = new Wechat(oauthConfig.wechat);

    const signature = await wechat.jssdk.verifySignature(req.query);

    if (signature) {
      return req.query.echostr;
    }

    return 'NOT-SIGNATURE-ECHOSTR';
  }

  async getMiniProgramSession(req: Request): Promise<string | null> {
    console.log('getMiniProgramSession REQ >>>>>>>>', req.query);

    const miniProgram = new MiniProgram(oauthConfig.wechat);

    if (req.query.code) {
      return miniProgram.getSession(req.query.code);
    }

    return 'NOT-SESSION11111xxx-1122xx111xx11x222';
  }
}
