import { UseGuards } from '@nestjs/common';
import { Args, Query, Mutation, Resolver, ResolveProperty, Parent } from '@nestjs/graphql';
import { Int } from 'type-graphql';

import { Ax, User } from '@leaa/common/src/entrys';
import {
  AxsArgs,
  AxsWithPaginationObject,
  AxArgs,
  CreateAxInput,
  UpdateAxInput,
  AxAttachmentsObject,
} from '@leaa/common/src/dtos/ax';
import { CurrentUser, Permissions } from '@leaa/api/src/decorators';
import { AxService } from '@leaa/api/src/modules/ax/ax.service';
import { AxProperty } from '@leaa/api/src/modules/ax/ax.property';
import { PermissionsGuard } from '@leaa/api/src/guards';

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
  async axs(@Args() args: AxsArgs, @CurrentUser() user?: User): Promise<AxsWithPaginationObject | undefined> {
    return this.axService.axs(args, user);
  }

  // @UseGuards(PermissionsGuard)
  // @Permissions('ax.item-read')
  // DO NOT CHECK PERMISSIONS
  @Query(() => Ax)
  async ax(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args() args?: AxArgs,
    @CurrentUser() user?: User,
  ): Promise<Ax | undefined> {
    return this.axService.ax(id, args, user);
  }

  // @UseGuards(PermissionsGuard)
  // @Permissions('ax.item-read')
  // DO NOT CHECK PERMISSIONS
  @Query(() => Ax)
  async axBySlug(
    @Args({ name: 'slug', type: () => String }) slug: string,
    @Args() args?: AxArgs,
    @CurrentUser() user?: User,
  ): Promise<Ax | undefined> {
    return this.axService.axBySlug(slug, args, user);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('ax.item-create')
  @Mutation(() => Ax)
  async createAx(@Args('ax') args: CreateAxInput): Promise<Ax | undefined> {
    return this.axService.createAx(args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('ax.item-update')
  @Mutation(() => Ax)
  async updateAx(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('ax') args: UpdateAxInput,
  ): Promise<Ax | undefined> {
    return this.axService.updateAx(id, args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('ax.item-delete')
  @Mutation(() => Ax)
  async deleteAx(@Args({ name: 'id', type: () => Int }) id: number): Promise<Ax | undefined> {
    return this.axService.deleteAx(id);
  }
}
