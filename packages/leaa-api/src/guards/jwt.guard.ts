import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { errorMsg } from '@leaa/api/src/utils';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: Error, user: any, info: any, context: any) {
    const { t } = context.getRequest();

    if (err || !user) throw errorMsg(t('_error:unauthorized'));

    return user;
  }
}
