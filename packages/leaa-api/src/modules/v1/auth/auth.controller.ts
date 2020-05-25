import { Controller, Post, Req, Body, HttpCode } from '@nestjs/common';
import { AuthService } from '@leaa/api/src/modules/v1/auth/auth.service';
import { ICrudRequest } from '@leaa/api/src/interfaces';
import { AuthLoginInput } from '@leaa/common/src/dtos/auth';

@Controller('/v1/auth')
export class AuthController {
  constructor(public authService: AuthService) {}

  @HttpCode(200)
  @Post('login')
  async login(@Req() req: ICrudRequest, @Body() body: AuthLoginInput): Promise<any> {
    return this.authService.login(req, body);
  }
}
