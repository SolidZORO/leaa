import _ from 'lodash';
import { applyMiddleware } from 'graphql-middleware';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { GqlOptionsFactory, GqlModuleOptions } from '@nestjs/graphql';

import { AuthService } from '@leaa/api/src/modules/auth/auth.service';
import { permissionConfig } from '@leaa/api/src/configs';
import { loggerUtil, errUtil } from '@leaa/api/src/utils';

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
      context: async (ctx: { req: Request }) => ({
        ...ctx,
        user: await this.authService.validateUserByReq(ctx.req),
      }),
      formatError(error: any) {
        const nextMessage = error.message.replace(/(GraphQL error:|Context creation failed:)\s?/, '');
        const errMapping: any = _.find(errUtil.mapping, { text: nextMessage });

        loggerUtil.error(`${nextMessage} / ${JSON.stringify(error)}\n`, CLS_NAME);

        return {
          ...error,
          message: nextMessage,
          code: errMapping?.code || undefined,
        };
      },
    };
  }
}
