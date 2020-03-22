import { UseGuards } from '@nestjs/common';
import { Query, Resolver, Args } from '@nestjs/graphql';
import { Float, Int } from '@nestjs/graphql';

import { TestService } from '@leaa/api/src/modules/test/test.service';
import { PermissionsGuard } from '@leaa/api/src/guards';
import { GqlCtx } from '@leaa/api/src/decorators';
import { IGqlCtx } from '@leaa/api/src/interfaces';

@Resolver()
export class TestResolver {
  constructor(private readonly testService: TestService) {}

  @Query(() => Float)
  test(): number {
    return Math.random();
  }

  @UseGuards(PermissionsGuard)
  @Query(() => String)
  testWithAuth(@GqlCtx() ctx: IGqlCtx): string {
    return `${Math.random()} - ${ctx.user?.email}`;
  }

  @Query(() => String)
  testI18n(@Args({ name: 'x', type: () => Int, nullable: true }) x?: number, @GqlCtx() gqlCtx?: IGqlCtx): string {
    return this.testService.testI18n(x, gqlCtx);
  }
}
