import { Controller, Get, Headers } from '@nestjs/common';

import { ICaptchaResult } from '@leaa/api/src/interfaces';
import { CreateVerificationInput } from '@leaa/common/src/dtos/verification';

import { VerificationService } from './verification.service';

@Controller('/v1/verification')
export class VerificationController {
  constructor(public verificationService: VerificationService) {}

  @Get('captcha-for-login')
  async createCaptchaForLogin(@Headers() headers?: CreateVerificationInput): Promise<ICaptchaResult> {
    return this.verificationService.createCaptchaForLogin(headers);
  }
}
