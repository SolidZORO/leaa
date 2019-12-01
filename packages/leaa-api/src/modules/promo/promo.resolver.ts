import { UseGuards } from '@nestjs/common';
import { Args, Query, Mutation, Resolver, ResolveProperty, Parent } from '@nestjs/graphql';
import { Int } from 'type-graphql';

import { Promo, User } from '@leaa/common/src/entrys';
import {
  PromosArgs,
  PromosWithPaginationObject,
  PromoArgs,
  CreatePromoInput,
  UpdatePromoInput,
  RedeemPromoInput,
} from '@leaa/common/src/dtos/promo';
import { CurrentUser, Permissions } from '@leaa/api/src/decorators';
import { PromoService } from '@leaa/api/src/modules/promo/promo.service';
import { PromoProperty } from '@leaa/api/src/modules/promo/promo.property';
import { PermissionsGuard } from '@leaa/api/src/guards';

@Resolver(() => Promo)
export class PromoResolver {
  constructor(private readonly promoService: PromoService, private readonly promoProperty: PromoProperty) {}

  @ResolveProperty(() => Boolean)
  async available(@Parent() promo: Promo): Promise<boolean> {
    return this.promoProperty.available(promo);
  }

  //

  @UseGuards(PermissionsGuard)
  @Permissions('promo.list-read')
  @Query(() => PromosWithPaginationObject)
  async promos(@Args() args: PromosArgs, @CurrentUser() user?: User): Promise<PromosWithPaginationObject | undefined> {
    return this.promoService.promos(args, user);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('promo.item-read')
  @Query(() => Promo)
  async promo(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args() args?: PromoArgs,
    @CurrentUser() user?: User,
  ): Promise<Promo | undefined> {
    return this.promoService.promo(id, args, user);
  }

  @Query(() => Promo)
  @Permissions('promo.item-read')
  async promoByCode(
    @Args({ name: 'code', type: () => String }) code: string,
    @Args() args?: PromoArgs,
    @CurrentUser() user?: User,
  ): Promise<Promo | undefined> {
    return this.promoService.promoByCode(code, args, user);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('promo.item-create')
  @Mutation(() => Promo)
  async createPromo(@Args('promo') args: CreatePromoInput): Promise<Promo | undefined> {
    return this.promoService.createPromo(args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('promo.item-update')
  @Mutation(() => Promo)
  async updatePromo(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('promo') args: UpdatePromoInput,
  ): Promise<Promo | undefined> {
    return this.promoService.updatePromo(id, args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('promo.item-delete')
  @Mutation(() => Promo)
  async deletePromo(@Args({ name: 'id', type: () => Int }) id: number): Promise<Promo | undefined> {
    return this.promoService.deletePromo(id);
  }

  @Mutation(() => Promo)
  async redeemPromo(@Args('info') info: RedeemPromoInput, @CurrentUser() user?: User): Promise<Promo | undefined> {
    return this.promoService.redeemPromo(info, user);
  }
}
