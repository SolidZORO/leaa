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
import { UserDecorator } from '@leaa/api/src/decorators';
import { AxService } from '@leaa/api/src/modules/ax/ax.service';
import { AxProperty } from '@leaa/api/src/modules/ax/ax.property';

@Resolver(() => Ax)
export class CouponResolver {
  constructor(private readonly axService: AxService, private readonly axProperty: AxProperty) {}

  @ResolveProperty(() => AxAttachmentsObject)
  async attachments(@Parent() ax: Ax | undefined): Promise<AxAttachmentsObject | undefined> {
    return this.axProperty.resolvePropertyAttachments(ax);
  }

  //
  //

  @Query(() => AxsWithPaginationObject)
  async axs(@Args() args: AxsArgs, @UserDecorator() user?: User): Promise<AxsWithPaginationObject | undefined> {
    return this.axService.axs(args, user);
  }

  @Query(() => Ax)
  async ax(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args() args?: AxArgs,
    @UserDecorator() user?: User,
  ): Promise<Ax | undefined> {
    return this.axService.ax(id, args, user);
  }

  @Query(() => Ax)
  async axBySlug(
    @Args({ name: 'slug', type: () => String }) slug: string,
    @Args() args?: AxArgs,
    @UserDecorator() user?: User,
  ): Promise<Ax | undefined> {
    return this.axService.axBySlug(slug, args, user);
  }

  @Mutation(() => Ax)
  async createAx(@Args('ax') args: CreateAxInput): Promise<Ax | undefined> {
    return this.axService.createAx(args);
  }

  @Mutation(() => Ax)
  async updateAx(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('ax') args: UpdateAxInput,
  ): Promise<Ax | undefined> {
    return this.axService.updateAx(id, args);
  }

  @Mutation(() => Ax)
  async deleteAx(@Args({ name: 'id', type: () => Int }) id: number): Promise<Ax | undefined> {
    return this.axService.deleteAx(id);
  }
}
