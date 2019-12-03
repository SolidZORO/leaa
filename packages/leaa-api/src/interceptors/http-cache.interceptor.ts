import { CacheInterceptor, ExecutionContext, Injectable, RequestMethod } from '@nestjs/common';
import { CACHE_KEY_METADATA } from '@nestjs/common/cache/cache.constants';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    // const request = context.switchToHttp().getRequest();
    // const { httpAdapter } = this.httpAdapterHost;
    // const httpServer = httpAdapter.getHttpServer();

    // const isGetRequest = httpServer.getRequestMethod(request) === 'GET';
    // console.log('111111111', isGetRequest);

    // const cacheKey = this.reflector.get(CACHE_KEY_METADATA, context.getHandler());
    //
    // console.log(cacheKey);

    return undefined;
    // const isGetRequest = httpServer.getRequestMethod(request) === 'GET';
    // const excludePaths: string[] = ['login'];
    //
    // if (!isGetRequest || (isGetRequest && excludePaths.includes(httpServer.getRequestUrl))) {
    //   return undefined;
    // }

    // return httpServer.getRequestUrl(request);
  }
}
