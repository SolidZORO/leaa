import { UseGuards } from '@nestjs/common';
import { Query, Resolver, Args, Float, Int } from '@nestjs/graphql';

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
  testWithAuth(@GqlCtx() gqlCtx: IGqlCtx): string {
    console.log(gqlCtx);

    return `${Math.random()} - ${gqlCtx.user?.email}`;
  }

  @Query(() => String)
  testI18n(@GqlCtx() gqlCtx: IGqlCtx, @Args({ name: 'x', type: () => Int, nullable: true }) x?: number): string {
    return this.testService.testI18n(gqlCtx, x);
  }
}
