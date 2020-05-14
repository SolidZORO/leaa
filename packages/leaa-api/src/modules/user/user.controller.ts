import { Controller, Post, Req, HttpCode, UseGuards, Body } from '@nestjs/common';
import { AuthLocalService } from '@leaa/api/src/modules/auth/auth-local.service';
import { ICrudRequest } from '@leaa/api/src/interfaces';
import { UserService } from '@leaa/api/src/modules/user/user.service';
import { JwtGuard, PermissionsGuard } from '@leaa/api/src/guards';

@Controller('/users')
// @UseGuards(JwtGuard, PermissionsGuard)
export class UserController {
  constructor(public authLocalService: AuthLocalService, public userService: UserService) {}

  @HttpCode(200)
  @Post('/userByToken')
  async userByToken(@Req() req: ICrudRequest, @Body() body: any): Promise<any> {
    return this.userService.userByToken(body?.token);
  }
}
