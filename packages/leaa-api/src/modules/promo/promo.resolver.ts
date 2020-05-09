import { UseGuards } from '@nestjs/common';
import { Args, Query, Mutation, Resolver, ResolveField, Parent, Int } from '@nestjs/graphql';

import { Promo } from '@leaa/common/src/entrys';
import {
  PromosArgs,
  PromosWithPaginationObject,
  PromoArgs,
  CreatePromoInput,
  UpdatePromoInput,
  RedeemPromoInput,
} from '@leaa/common/src/dtos/promo';
import { Permissions, GqlCtx } from '@leaa/api/src/decorators';
import { PromoService } from '@leaa/api/src/modules/promo/promo.service';
import { PromoProperty } from '@leaa/api/src/modules/promo/promo.property';
import { PermissionsGuard } from '@leaa/api/src/guards';
import { IGqlCtx } from '@leaa/api/src/interfaces';

@Resolver(() => Promo)
export class PromoResolver {
  constructor(private readonly promoService: PromoService, private readonly promoProperty: PromoProperty) {}

  @ResolveField(() => Boolean)
  async available(@Parent() promo: Promo): Promise<boolean> {
    return this.promoProperty.available(promo);
  }

  //

  @UseGuards(PermissionsGuard)
  @Permissions('promo.list-read')
  @Query(() => PromosWithPaginationObject)
  async promos(@GqlCtx() gqlCtx: IGqlCtx, @Args() args: PromosArgs): Promise<PromosWithPaginationObject | undefined> {
    return this.promoService.promos(gqlCtx, args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('promo.item-read')
  @Query(() => Promo)
  async promo(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'id', type: () => String }) id: string,
    @Args() args?: PromoArgs,
  ): Promise<Promo | undefined> {
    return this.promoService.promo(gqlCtx, id, args);
  }

  @Query(() => Promo)
  @Permissions('promo.item-read')
  async promoByCode(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'code', type: () => String }) code: string,
    @Args() args?: PromoArgs,
  ): Promise<Promo | undefined> {
    return this.promoService.promoByCode(gqlCtx, code, args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('promo.item-create')
  @Mutation(() => Promo)
  async createPromo(@GqlCtx() gqlCtx: IGqlCtx, @Args('promo') args: CreatePromoInput): Promise<Promo | undefined> {
    return this.promoService.createPromo(gqlCtx, args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('promo.item-update')
  @Mutation(() => Promo)
  async updatePromo(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'id', type: () => String }) id: string,
    @Args('promo') args: UpdatePromoInput,
  ): Promise<Promo | undefined> {
    return this.promoService.updatePromo(gqlCtx, id, args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('promo.item-delete')
  @Mutation(() => Promo)
  async deletePromo(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'id', type: () => String }) id: string,
  ): Promise<Promo | undefined> {
    return this.promoService.deletePromo(gqlCtx, id);
  }

  @Mutation(() => Promo)
  async redeemPromo(@GqlCtx() gqlCtx: IGqlCtx, @Args('info') info: RedeemPromoInput): Promise<Promo | undefined> {
    return this.promoService.redeemPromo(gqlCtx, info);
  }
}
