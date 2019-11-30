import { applyMiddleware } from 'graphql-middleware';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { GqlOptionsFactory, GqlModuleOptions } from '@nestjs/graphql';

import { AuthService } from '@leaa/api/src/modules/auth/auth.service';
import { permissionConfig } from '@leaa/api/src/configs';
import { loggerUtil } from '@leaa/api/src/utils';

const CONSTRUCTOR_NAME = 'GraphqlService';

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
      context: async ({ req }: { req: Request }) => {
        const user = await this.authService.validateUserByReq(req);

        return { req, user };
      },
      formatError(error: any) {
        loggerUtil.error(`${JSON.stringify(error)}\n`, CONSTRUCTOR_NAME);

        if (error.message && error.message.error) {
          return new Error(error.message.error);
        }

        return error;
      },
    };
  }
}
