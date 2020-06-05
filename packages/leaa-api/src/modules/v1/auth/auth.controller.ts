import { Controller, Post, Req, Body, Headers, HttpCode, Ip } from '@nestjs/common';
import { AuthService } from '@leaa/api/src/modules/v1/auth/auth.service';
import { ICrudRequest, IRequest } from '@leaa/api/src/interfaces';
import { AuthLoginReq } from '@leaa/api/src/dtos/auth';

@Controller('/v1/auth')
export class AuthController {
  constructor(public authService: AuthService) {}

  @HttpCode(200)
  @Post('login')
  async login(
    @Req() req: IRequest,
    @Headers() headers: any,
    @Ip() ip: string,
    @Body() body: AuthLoginReq,
  ): Promise<any> {
    return this.authService.login(req, headers, ip, body);
  }

  @Post('user-by-token')
  async userByToken(@Req() req: ICrudRequest, @Body() body: any): Promise<any> {
    return this.authService.userByToken(body);
  }
}
