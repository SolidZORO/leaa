import { Args, Query, Mutation, Resolver, ResolveField, Parent, Int } from '@nestjs/graphql';

import { Ax } from '@leaa/common/src/entrys';
import {
  AxsArgs,
  AxsWithPaginationObject,
  AxArgs,
  CreateAxInput,
  UpdateAxInput,
  AxAttachmentsObject,
} from '@leaa/common/src/dtos/ax';
import { Permissions, GqlCtx } from '@leaa/api/src/decorators';
import { AxService } from '@leaa/api/src/modules/ax/ax.service';
import { AxProperty } from '@leaa/api/src/modules/ax/ax.property';

import { IGqlCtx } from '@leaa/api/src/interfaces';

@Resolver(() => Ax)
export class AxResolver {
  constructor(private readonly axService: AxService, private readonly axProperty: AxProperty) {}

  @ResolveField(() => AxAttachmentsObject)
  async attachments(@Parent() ax: Ax | undefined): Promise<AxAttachmentsObject | undefined> {
    return this.axProperty.attachments(ax);
  }

  //
  //

  //
  // @Permissions('ax.item-read')
  // DO NOT CHECK PERMISSIONS
  @Query(() => AxsWithPaginationObject)
  async axs(@GqlCtx() @Args() args: AxsArgs): Promise<AxsWithPaginationObject | undefined> {
    return this.axService.axs(gqlCtx, args);
  }

  //
  // @Permissions('ax.item-read')
  // DO NOT CHECK PERMISSIONS
  @Query(() => Ax)
  async ax(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'id', type: () => String }) id: string,
    @Args() args?: AxArgs,
  ): Promise<Ax | undefined> {
    return this.axService.ax(gqlCtx, id, args);
  }

  //
  // @Permissions('ax.item-read')
  // DO NOT CHECK PERMISSIONS
  @Query(() => Ax)
  async axBySlug(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'slug', type: () => String }) slug: string,
    @Args() args?: AxArgs,
  ): Promise<Ax | undefined> {
    return this.axService.axBySlug(gqlCtx, slug, args);
  }

  @Permissions('ax.item-create')
  @Mutation(() => Ax)
  async createAx(@GqlCtx() @Args('ax') args: CreateAxInput): Promise<Ax | undefined> {
    return this.axService.createAx(gqlCtx, args);
  }

  @Permissions('ax.item-update')
  @Mutation(() => Ax)
  async updateAx(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'id', type: () => String }) id: string,
    @Args('ax') args: UpdateAxInput,
  ): Promise<Ax | undefined> {
    return this.axService.updateAx(gqlCtx, id, args);
  }

  @Permissions('ax.item-delete')
  @Mutation(() => Ax)
  async deleteAx(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'id', type: () => String }) id: string,
  ): Promise<Ax | undefined> {
    return this.axService.deleteAx(gqlCtx, id);
  }
}
