import { UseGuards } from '@nestjs/common';
import { Args, Query, Mutation, Resolver, ResolveProperty, Parent, Int } from '@nestjs/graphql';

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
import { PermissionsGuard } from '@leaa/api/src/guards';
import { IGqlCtx } from '@leaa/api/src/interfaces';

@Resolver(() => Ax)
export class AxResolver {
  constructor(private readonly axService: AxService, private readonly axProperty: AxProperty) {}

  @ResolveProperty(() => AxAttachmentsObject)
  async attachments(@Parent() ax: Ax | undefined): Promise<AxAttachmentsObject | undefined> {
    return this.axProperty.attachments(ax);
  }

  //
  //

  // @UseGuards(PermissionsGuard)
  // @Permissions('ax.item-read')
  // DO NOT CHECK PERMISSIONS
  @Query(() => AxsWithPaginationObject)
  async axs(@Args() args: AxsArgs, @GqlCtx() gqlCtx?: IGqlCtx): Promise<AxsWithPaginationObject | undefined> {
    return this.axService.axs(args, gqlCtx);
  }

  // @UseGuards(PermissionsGuard)
  // @Permissions('ax.item-read')
  // DO NOT CHECK PERMISSIONS
  @Query(() => Ax)
  async ax(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args() args?: AxArgs,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<Ax | undefined> {
    return this.axService.ax(id, args, gqlCtx);
  }

  // @UseGuards(PermissionsGuard)
  // @Permissions('ax.item-read')
  // DO NOT CHECK PERMISSIONS
  @Query(() => Ax)
  async axBySlug(
    @Args({ name: 'slug', type: () => String }) slug: string,
    @Args() args?: AxArgs,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<Ax | undefined> {
    return this.axService.axBySlug(slug, args, gqlCtx);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('ax.item-create')
  @Mutation(() => Ax)
  async createAx(@Args('ax') args: CreateAxInput, @GqlCtx() gqlCtx?: IGqlCtx): Promise<Ax | undefined> {
    return this.axService.createAx(args, gqlCtx);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('ax.item-update')
  @Mutation(() => Ax)
  async updateAx(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('ax') args: UpdateAxInput,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<Ax | undefined> {
    return this.axService.updateAx(id, args, gqlCtx);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('ax.item-delete')
  @Mutation(() => Ax)
  async deleteAx(
    @Args({ name: 'id', type: () => Int }) id: number,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<Ax | undefined> {
    return this.axService.deleteAx(id, gqlCtx);
  }
}
