import { Controller, Post, Req, Body, HttpCode, Ip } from '@nestjs/common';
import { AuthService } from '@leaa/api/src/modules/v1/auth/auth.service';
import { ICrudRequest } from '@leaa/api/src/interfaces';
import { AuthLoginInput } from '@leaa/common/src/dtos/auth';

@Controller('/v1/auth')
export class AuthController {
  constructor(public authService: AuthService) {}

  @HttpCode(200)
  @Post('login')
  async login(@Req() req: ICrudRequest, @Ip() ip: string, @Body() body: AuthLoginInput): Promise<any> {
    return this.authService.login(req, ip, body);
  }

  @Post('user-by-token')
  async userByToken(@Req() req: ICrudRequest, @Body() body: any): Promise<any> {
    return this.authService.userByToken(body);
  }
}
