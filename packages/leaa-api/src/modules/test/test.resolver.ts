import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { Float } from 'type-graphql';

import { TestService } from '@leaa/api/src/modules/test/test.service';
import { PermissionsGuard } from '@leaa/api/src/guards';
import { CurrentUser } from '@leaa/api/src/decorators';
import { User } from '@leaa/common/src/entrys';

@Resolver()
export class TestResolver {
  constructor(private readonly testService: TestService) {}

  @Query(() => Float)
  test(): number {
    return Math.random();
  }

  @UseGuards(PermissionsGuard)
  @Query(() => String)
  testWithAuth(@CurrentUser() user?: User): string {
    return `${Math.random()} - ${user?.email}`;
  }

  @Query(() => String)
  async i18n(): Promise<string> {
    return this.testService.i18n();
  }
}
