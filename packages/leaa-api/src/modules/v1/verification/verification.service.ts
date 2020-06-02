import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import svgCaptcha from 'svg-captcha';

import { Verification, Action } from '@leaa/common/src/entrys';
import { captchaConfig } from '@leaa/api/src/configs';
import { ICaptchaResult } from '@leaa/api/src/interfaces';
import { ConfigService } from '@leaa/api/src/modules/v1/config/config.service';
import { checkGuthorization } from '@leaa/api/src/utils';

const CLS_NAME = 'VerificationService';

@Injectable()
export class VerificationService {
  constructor(
    @InjectRepository(Verification) private readonly verificationRepo: Repository<Verification>,
    @InjectRepository(Action) private readonly actionRepo: Repository<Action>,
    private readonly configService: ConfigService,
  ) {
    svgCaptcha.loadFont(captchaConfig.SVG_CAPTCHA_FONT_PATH);
  }

  async createCaptchaForLogin(t?: string): Promise<ICaptchaResult> {
    const token = checkGuthorization(t);

    const guestTokenLoginErrorCount = await this.actionRepo.count({
      where: {
        module: 'auth',
        action: 'login',
        token,
      },
    });

    const captcha = svgCaptcha.create(captchaConfig.SVG_CAPTCHA_OPTION);
    const hasCaptcha = await this.verificationRepo.findOne({ token });
    //
    if (hasCaptcha) {
      await this.verificationRepo.update(hasCaptcha?.id, { code: captcha.text.toLowerCase() });
    } else {
      await this.verificationRepo.save({ token, code: captcha.text.toLowerCase() });
    }

    return {
      // ⚠️ 这里必须在满足条件前给用户发送验证码图片
      // Here, the verification code picture must be sent to the user before the conditions are met
      img: guestTokenLoginErrorCount + 1 >= this.configService.ENABLE_CAPTCHA_BY_LOGIN_FAILD_TIMES ? captcha.data : '',
      count: this.configService.DEBUG_MODE ? guestTokenLoginErrorCount : undefined,
    };
  }
}
