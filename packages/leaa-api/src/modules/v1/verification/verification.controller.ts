import { Controller, Get, Headers } from '@nestjs/common';

import { ICaptchaResult } from '@leaa/api/src/interfaces';

import { VerificationService } from './verification.service';

@Controller('/v1/verification')
export class VerificationController {
  constructor(public verificationService: VerificationService) {}

  @Get('captcha-for-login')
  async createCaptchaForLogin(@Headers('guthorization') token?: string): Promise<ICaptchaResult> {
    return this.verificationService.createCaptchaForLogin(token);
  }
}
