import { UseGuards } from '@nestjs/common';
import { Args, Query, Mutation, Resolver, ResolveProperty, Parent } from '@nestjs/graphql';
import { Int } from 'type-graphql';

import { Zan, User } from '@leaa/common/src/entrys';
import { ZansArgs, ZansWithPaginationObject, ZanArgs, CreateZanInput, UpdateZanInput } from '@leaa/common/src/dtos/zan';
import { CurrentUser, Permissions } from '@leaa/api/src/decorators';
import { ZanService } from '@leaa/api/src/modules/zan/zan.service';
import { PermissionsGuard } from '@leaa/api/src/guards';

@Resolver(() => Zan)
export class ZanResolver {
  constructor(private readonly zanService: ZanService) {}

  //
  //

  // @UseGuards(PermissionsGuard)
  // @Permissions('zan.item-read')
  @Query(() => ZansWithPaginationObject)
  async zans(@Args() args: ZansArgs, @CurrentUser() user?: User): Promise<ZansWithPaginationObject | undefined> {
    return this.zanService.zans(args, user);
  }

  // @UseGuards(PermissionsGuard)
  // @Permissions('zan.item-read')
  @Query(() => Zan)
  async zan(
    @Args({ name: 'uuid', type: () => String }) uuid: string,
    @Args() args?: ZanArgs,
    @CurrentUser() user?: User,
  ): Promise<Zan | undefined> {
    return this.zanService.zan(uuid, args, user);
  }

  // @UseGuards(PermissionsGuard)
  // @Permissions('zan.item-create')
  @Mutation(() => Zan)
  async createZan(@Args('zan') args: CreateZanInput): Promise<Zan | undefined> {
    return this.zanService.createZan(args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('zan.item-update')
  @Mutation(() => Zan)
  async updateZan(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('zan') args: UpdateZanInput,
  ): Promise<Zan | undefined> {
    return this.zanService.updateZan(id, args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('zan.item-delete')
  @Mutation(() => Zan)
  async deleteZan(@Args({ name: 'id', type: () => Int }) id: number): Promise<Zan | undefined> {
    return this.zanService.deleteZan(id);
  }

  @Mutation(() => Zan)
  async likeZan(
    @Args({ name: 'uuid', type: () => String }) uuid: string,
    @CurrentUser() user?: User,
  ): Promise<Zan | undefined> {
    return this.zanService.likeZan(uuid, user);
  }
}
