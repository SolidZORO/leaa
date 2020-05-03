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
  async promos(@Args() args: PromosArgs, @GqlCtx() gqlCtx?: IGqlCtx): Promise<PromosWithPaginationObject | undefined> {
    return this.promoService.promos(args, gqlCtx);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('promo.item-read')
  @Query(() => Promo)
  async promo(
    @Args({ name: 'id', type: () => String }) id: string,
    @Args() args?: PromoArgs,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<Promo | undefined> {
    return this.promoService.promo(id, args, gqlCtx);
  }

  @Query(() => Promo)
  @Permissions('promo.item-read')
  async promoByCode(
    @Args({ name: 'code', type: () => String }) code: string,
    @Args() args?: PromoArgs,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<Promo | undefined> {
    return this.promoService.promoByCode(code, args, gqlCtx);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('promo.item-create')
  @Mutation(() => Promo)
  async createPromo(@Args('promo') args: CreatePromoInput, @GqlCtx() gqlCtx?: IGqlCtx): Promise<Promo | undefined> {
    return this.promoService.createPromo(args, gqlCtx);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('promo.item-update')
  @Mutation(() => Promo)
  async updatePromo(
    @Args({ name: 'id', type: () => String }) id: string,
    @Args('promo') args: UpdatePromoInput,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<Promo | undefined> {
    return this.promoService.updatePromo(id, args, gqlCtx);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('promo.item-delete')
  @Mutation(() => Promo)
  async deletePromo(
    @Args({ name: 'id', type: () => String }) id: string,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<Promo | undefined> {
    return this.promoService.deletePromo(id, gqlCtx);
  }

  @Mutation(() => Promo)
  async redeemPromo(@Args('info') info: RedeemPromoInput, @GqlCtx() gqlCtx?: IGqlCtx): Promise<Promo | undefined> {
    return this.promoService.redeemPromo(info, gqlCtx);
  }
}
