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
    @Args({ name: 'uuid', type: () => String }) uuid: string,
    @Args() args?: ZanArgs,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<Zan | undefined> {
    return this.zanService.zan(uuid, args, gqlCtx);
  }

  @Mutation(() => Zan)
  async createZan(@Args('zan') args: CreateZanInput, @GqlCtx() gqlCtx?: IGqlCtx): Promise<Zan | undefined> {
    return this.zanService.createZan(args, gqlCtx);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('zan.item-update')
  @Mutation(() => Zan)
  async updateZan(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('zan') args: UpdateZanInput,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<Zan | undefined> {
    return this.zanService.updateZan(id, args, gqlCtx);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('zan.item-delete')
  @Mutation(() => Zan)
  async deleteZan(
    @Args({ name: 'id', type: () => Int }) id: number,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<Zan | undefined> {
    return this.zanService.deleteZan(id, gqlCtx);
  }

  @Mutation(() => Zan)
  async likeZan(
    @Args({ name: 'uuid', type: () => String }) uuid: string,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<Zan | undefined> {
    return this.zanService.likeZan(uuid, gqlCtx);
  }

  @Mutation(() => Zan)
  async deleteZanUser(
    @Args({ name: 'uuid', type: () => String }) uuid: string,
    @Args({ name: 'userId', type: () => Int }) userId: number,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<Zan | undefined> {
    return this.zanService.deleteZanUser(uuid, userId, gqlCtx);
  }
}
