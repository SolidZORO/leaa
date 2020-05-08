import { applyMiddleware } from 'graphql-middleware';
import { Injectable } from '@nestjs/common';
import { GqlOptionsFactory, GqlModuleOptions } from '@nestjs/graphql';

import { AuthService } from '@leaa/api/src/modules/auth/auth.service';
import { permissionConfig } from '@leaa/api/src/configs';
import { logger } from '@leaa/api/src/utils';
import { IRequest } from '@leaa/api/src/interfaces';

const CLS_NAME = 'GraphqlService';

@Injectable()
export class GraphqlService implements GqlOptionsFactory {
  constructor(private readonly authService: AuthService) {}

  createGqlOptions(): GqlModuleOptions {
    const dev = process.env.NODE_ENV !== 'production';

    return {
      autoSchemaFile: 'schema.graphql',
      installSubscriptionHandlers: dev,
      debug: dev,
      tracing: dev,
      playground: dev,
      transformSchema: (schema: any): any => applyMiddleware(schema, permissionConfig.permissions),
      context: async (ctx: { req: IRequest }) => {
        return {
          ...ctx,
          user: await this.authService.validateUserByReq(ctx.req),
          lang: ctx.req.headers.lang,
        };
      },
      formatError(error: any) {
        if (typeof error.message === 'object') {
          return error.message;
        }

        let nextMessage = error.message;
        let statusCode;

        const messageInfo = error.message.split('__STATUS_CODE__');

        if (messageInfo && messageInfo[0]) {
          nextMessage = messageInfo[0].replace(/(GraphQL error:|Context creation failed:)\s?/, '');
        }

        if (messageInfo && messageInfo[1]) {
          // why join the statusCode?
          // because the frontend needs to check this statusCode, decide whether to do something.
          // e.g. jwt has expired or error return 401, auth force logout.
          // eslint-disable-next-line prefer-destructuring
          statusCode = Number(messageInfo[1]);
        }

        logger.error(`${nextMessage} / ${JSON.stringify(error)}\n`, CLS_NAME);

        return {
          ...error,
          message: nextMessage,
          statusCode,
        };
      },
    };
  }
}
