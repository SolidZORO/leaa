import { UseGuards } from '@nestjs/common';
import { Args, Query, Mutation, Resolver, Int } from '@nestjs/graphql';

import { Division, User } from '@leaa/common/src/entrys';
import {
  DivisionsArgs,
  DivisionsWithPaginationObject,
  DivisionArgs,
  CreateDivisionInput,
  UpdateDivisionInput,
  SyncDivisionToFileObject,
} from '@leaa/common/src/dtos/division';
import { DivisionService } from '@leaa/api/src/modules/division/division.service';
import { CurrentUser, Permissions } from '@leaa/api/src/decorators';
import { PermissionsGuard } from '@leaa/api/src/guards';

@Resolver(() => Division)
export class DivisionResolver {
  constructor(private readonly divisionService: DivisionService) {}

  @UseGuards(PermissionsGuard)
  @Permissions('division.list-read')
  @Query(() => DivisionsWithPaginationObject)
  async divisions(
    @Args() args: DivisionsArgs,
    @CurrentUser() user?: User,
  ): Promise<DivisionsWithPaginationObject | undefined> {
    return this.divisionService.divisions(args);
  }

  // DO NOT CHECK PERMISSIONS
  @Query(() => String)
  async divisionsMapping(): Promise<string | undefined> {
    return this.divisionService.divisionsMapping();
  }

  // DO NOT CHECK PERMISSIONS
  @Query(() => String)
  async divisionsTree(): Promise<string | undefined | void> {
    return this.divisionService.divisionsTree();
  }

  @UseGuards(PermissionsGuard)
  @Permissions('division.item-read')
  @Query(() => Division)
  async division(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args() args?: DivisionArgs,
    @CurrentUser() user?: User,
  ): Promise<Division | undefined> {
    return this.divisionService.division(id, args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('division.item-create')
  @Mutation(() => Division)
  async createDivision(@Args('division') args: CreateDivisionInput): Promise<Division | undefined> {
    return this.divisionService.createDivision(args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('division.item-update')
  @Mutation(() => SyncDivisionToFileObject)
  async syncDivisionToFile(): Promise<SyncDivisionToFileObject> {
    return this.divisionService.syncDivisionToFile();
  }

  @UseGuards(PermissionsGuard)
  @Permissions('division.item-update')
  @Mutation(() => Division)
  async updateDivision(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('division') args: UpdateDivisionInput,
  ): Promise<Division | undefined> {
    return this.divisionService.updateDivision(id, args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('division.item-delete')
  @Mutation(() => Division)
  async deleteDivision(@Args({ name: 'id', type: () => Int }) id: number): Promise<Division | undefined> {
    return this.divisionService.deleteDivision(id);
  }
}
