import { GraphQLSchema } from 'graphql';
import { applyMiddleware } from 'graphql-middleware';
import { Injectable } from '@nestjs/common';
import { GqlOptionsFactory, GqlModuleOptions } from '@nestjs/graphql';
import { AuthService } from '@leaa/api/modules/auth/auth.service';
import { permissions } from '@leaa/api/configs/permission.config';
import { Request } from 'express';

@Injectable()
export class GraphqlService implements GqlOptionsFactory {
  constructor(private readonly authService: AuthService) {}

  createGqlOptions(): GqlModuleOptions {
    return {
      autoSchemaFile: 'schema.graphql',
      // installSubscriptionHandlers: true,
      debug: true,
      tracing: true,
      playground: true,
      transformSchema: (schema: any): any => {
      // transformSchema: (schema: GraphQLSchema) => {
        return applyMiddleware(schema, permissions);
      },
      context: async ({ req }: { req: Request }) => {
        const user = await this.authService.validateUserByReq(req);

        return { req, user };
      },
    };
  }
}
