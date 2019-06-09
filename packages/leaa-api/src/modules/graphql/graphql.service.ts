import { Request } from 'express';
import { GraphQLSchema } from 'graphql';
import { applyMiddleware } from 'graphql-middleware';
import { Injectable, Logger } from '@nestjs/common';
import { GqlOptionsFactory, GqlModuleOptions } from '@nestjs/graphql';

import { permissions } from '@leaa/api/configs/permission.config';

export interface IRequest {
  req: Request;
}

@Injectable()
export class GraphqlService implements GqlOptionsFactory {
  private logger: Logger;

  constructor() {
    this.logger = new Logger(this.constructor.name);
  }

  createGqlOptions(): GqlModuleOptions {
    return {
      autoSchemaFile: 'schema.graphql',
      debug: true,
      tracing: true,
      playground: true,
      transformSchema: (schema: GraphQLSchema) => {
        return applyMiddleware(schema, permissions);
      },
      context: ({ req }: IRequest) => ({ req }),
    };
  }
}
