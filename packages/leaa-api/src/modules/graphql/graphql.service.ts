import { applyMiddleware } from 'graphql-middleware';
import { Injectable } from '@nestjs/common';
import { GqlOptionsFactory, GqlModuleOptions } from '@nestjs/graphql';
import { AuthService } from '@leaa/api/modules/auth/auth.service';
import { permissionConfig } from '@leaa/api/configs';
import { Request } from 'express';

@Injectable()
export class GraphqlService implements GqlOptionsFactory {
  constructor(private readonly authService: AuthService) {}

  createGqlOptions(): GqlModuleOptions {
    const dev = process.env.NODE_ENV !== 'production';

    return {
      autoSchemaFile: 'schema.graphql',
      // installSubscriptionHandlers: dev,
      debug: dev,
      tracing: dev,
      playground: dev,
      transformSchema: (schema: any): any => applyMiddleware(schema, permissionConfig.permissions),
      context: async ({ req }: { req: Request }) => {
        const user = await this.authService.validateUserByReq(req);

        return { req, user };
      },
    };
  }
}
