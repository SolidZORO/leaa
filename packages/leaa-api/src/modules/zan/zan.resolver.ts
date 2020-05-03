import { UseGuards } from '@nestjs/common';
import { Args, Query, Mutation, Resolver, Int } from '@nestjs/graphql';

import { Zan } from '@leaa/common/src/entrys';
import { ZansArgs, ZansWithPaginationObject, ZanArgs, CreateZanInput, UpdateZanInput } from '@leaa/common/src/dtos/zan';
import { Permissions, GqlCtx } from '@leaa/api/src/decorators';
import { ZanService } from '@leaa/api/src/modules/zan/zan.service';
import { PermissionsGuard } from '@leaa/api/src/guards';
import { IGqlCtx } from '@leaa/api/src/interfaces';

@Resolver(() => Zan)
export class ZanResolver {
  constructor(private readonly zanService: ZanService) {}

  @Query(() => ZansWithPaginationObject)
  async zans(@Args() args: ZansArgs, @GqlCtx() gqlCtx?: IGqlCtx): Promise<ZansWithPaginationObject | undefined> {
    return this.zanService.zans(args, gqlCtx);
  }

  @Query(() => Zan)
  async zan(
    @Args({ name: 'id', type: () => String }) id: string,
    @Args() args?: ZanArgs,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<Zan | undefined> {
    return this.zanService.zan(id, args, gqlCtx);
  }

  @Mutation(() => Zan)
  async createZan(@Args('zan') args: CreateZanInput, @GqlCtx() gqlCtx?: IGqlCtx): Promise<Zan | undefined> {
    return this.zanService.createZan(args, gqlCtx);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('zan.item-update')
  @Mutation(() => Zan)
  async updateZan(
    @Args({ name: 'id', type: () => String }) id: string,
    @Args('zan') args: UpdateZanInput,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<Zan | undefined> {
    return this.zanService.updateZan(id, args, gqlCtx);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('zan.item-delete')
  @Mutation(() => Zan)
  async deleteZan(
    @Args({ name: 'id', type: () => String }) id: string,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<Zan | undefined> {
    return this.zanService.deleteZan(id, gqlCtx);
  }

  @Mutation(() => Zan)
  async likeZan(
    @Args({ name: 'id', type: () => String }) id: string,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<Zan | undefined> {
    return this.zanService.likeZan(id, gqlCtx);
  }

  @Mutation(() => Zan)
  async deleteZanUser(
    @Args({ name: 'id', type: () => String }) id: string,
    @Args({ name: 'userId', type: () => String }) userId: string,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<Zan | undefined> {
    return this.zanService.deleteZanUser(id, userId, gqlCtx);
  }
}
