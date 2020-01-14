import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { errUtil } from '@leaa/api/src/utils';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    if (err || !user) return errUtil.ERROR({ error: errUtil.mapping.UNAUTHORIZED.text });

    return user;
  }
}
