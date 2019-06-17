import { ExecutionContext, Injectable, UnauthorizedException, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
@UseInterceptors()
export class JwtGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
