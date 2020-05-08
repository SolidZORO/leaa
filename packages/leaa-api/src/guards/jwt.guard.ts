import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { errorMessage } from '@leaa/api/src/utils';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: Error, user: any) {
    if (err || !user) throw errorMessage({ t: ['_error:unauthorized'] });

    return user;
  }
}
