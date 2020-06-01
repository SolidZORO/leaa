import { Injectable, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import svgCaptcha from 'svg-captcha';

import { Verification, Action } from '@leaa/common/src/entrys';
import { captchaConfig } from '@leaa/api/src/configs';
import { CreateVerificationInput } from '@leaa/common/src/dtos/verification';
import { ICaptchaResult } from '@leaa/api/src/interfaces';
import { MUST_VERIFICATION_CAPTCHA_BY_LOGIN_ERROR } from '@leaa/api/src/modules/v1/auth/auth.service';
import { ConfigService } from '@leaa/api/src/modules/v1/config/config.service';

const CLS_NAME = 'VerificationService';

@Injectable()
export class VerificationService {
  constructor(
    @InjectRepository(Verification) private readonly verificationRepo: Repository<Verification>,
    @InjectRepository(Action) private readonly actionRepo: Repository<Action>,
    private readonly configService: ConfigService,
  ) {}

  async createCaptchaForLogin(headers?: CreateVerificationInput): Promise<ICaptchaResult> {
    if (!headers || !headers.guthorization) throw new BadRequestException();

    const guestTokenLoginErrorCount = await this.actionRepo.count({
      where: {
        module: 'auth',
        action: 'login',
        token: headers.guthorization,
      },
    });

    const captcha = svgCaptcha.create(captchaConfig.SVG_CAPTCHA);

    const hasCaptcha = await this.verificationRepo.findOne({ token: headers.guthorization });
    //
    if (hasCaptcha) {
      await this.verificationRepo.update(hasCaptcha?.id, { code: captcha.text.toLowerCase() });
    } else {
      await this.verificationRepo.save({ token: headers.guthorization, code: captcha.text.toLowerCase() });
    }

    return {
      // ⚠️ 这里必须在满足条件前给用户发送验证码图片
      // Here, the verification code picture must be sent to the user before the conditions are met
      img: guestTokenLoginErrorCount + 1 >= MUST_VERIFICATION_CAPTCHA_BY_LOGIN_ERROR ? captcha.data : '',
      count: this.configService.DEBUG_MODE ? guestTokenLoginErrorCount : undefined,
    };
  }
}
