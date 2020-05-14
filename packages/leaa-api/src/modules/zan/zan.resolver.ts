import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';

import { Zan } from '@leaa/common/src/entrys';
import { ZansArgs, ZansWithPaginationObject, ZanArgs, CreateZanInput, UpdateZanInput } from '@leaa/common/src/dtos/zan';
import { Permissions, GqlCtx } from '@leaa/api/src/decorators';
import { ZanService } from '@leaa/api/src/modules/zan/zan.service';

import { IGqlCtx } from '@leaa/api/src/interfaces';

@Resolver(() => Zan)
export class ZanResolver {
  constructor(private readonly zanService: ZanService) {}

  @Query(() => ZansWithPaginationObject)
  async zans(@GqlCtx() @Args() args: ZansArgs): Promise<ZansWithPaginationObject | undefined> {
    return this.zanService.zans(gqlCtx, args);
  }

  @Query(() => Zan)
  async zan(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'id', type: () => String }) id: string,
    @Args() args?: ZanArgs,
  ): Promise<Zan | undefined> {
    return this.zanService.zan(gqlCtx, id, args);
  }

  @Mutation(() => Zan)
  async createZan(@GqlCtx() @Args('zan') args: CreateZanInput): Promise<Zan | undefined> {
    return this.zanService.createZan(gqlCtx, args);
  }

  @Permissions('zan.item-update')
  @Mutation(() => Zan)
  async updateZan(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'id', type: () => String }) id: string,
    @Args('zan') args: UpdateZanInput,
  ): Promise<Zan | undefined> {
    return this.zanService.updateZan(gqlCtx, id, args);
  }

  @Permissions('zan.item-delete')
  @Mutation(() => Zan)
  async deleteZan(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'id', type: () => String }) id: string,
  ): Promise<Zan | undefined> {
    return this.zanService.deleteZan(gqlCtx, id);
  }

  @Mutation(() => Zan)
  async likeZan(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'id', type: () => String }) id: string,
  ): Promise<Zan | undefined> {
    return this.zanService.likeZan(gqlCtx, id);
  }

  @Mutation(() => Zan)
  async deleteZanUser(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'id', type: () => String }) id: string,
    @Args({ name: 'userId', type: () => String }) userId: string,
  ): Promise<Zan | undefined> {
    return this.zanService.deleteZanUser(gqlCtx, id, userId);
  }
}
