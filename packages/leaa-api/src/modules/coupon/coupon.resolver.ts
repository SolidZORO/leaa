import { UseGuards } from '@nestjs/common';
import { Args, Query, Mutation, Resolver, ResolveField, Parent, Int } from '@nestjs/graphql';

import { Coupon } from '@leaa/common/src/entrys';
import {
  CouponsArgs,
  CouponsWithPaginationObject,
  CouponArgs,
  CreateCouponInput,
  UpdateCouponInput,
  RedeemCouponInput,
} from '@leaa/common/src/dtos/coupon';
import { Permissions, GqlCtx } from '@leaa/api/src/decorators';
import { CouponService } from '@leaa/api/src/modules/coupon/coupon.service';
import { CouponProperty } from '@leaa/api/src/modules/coupon/coupon.property';
import { PermissionsGuard } from '@leaa/api/src/guards';
import { IGqlCtx } from '@leaa/api/src/interfaces';

@Resolver(() => Coupon)
export class CouponResolver {
  constructor(private readonly couponService: CouponService, private readonly couponProperty: CouponProperty) {}

  @ResolveField(() => Boolean)
  available(@Parent() coupon: Coupon): boolean {
    return this.couponProperty.available(coupon);
  }

  @ResolveField(() => Boolean)
  canRedeem(@Parent() coupon: Coupon): boolean {
    return this.couponProperty.canRedeem(coupon);
  }

  //

  @UseGuards(PermissionsGuard)
  @Permissions('coupon.list-read')
  @Query(() => CouponsWithPaginationObject)
  async coupons(
    @Args() args: CouponsArgs,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<CouponsWithPaginationObject | undefined> {
    return this.couponService.coupons(args, gqlCtx);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('coupon.item-read')
  @Query(() => Coupon)
  async coupon(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args() args?: CouponArgs,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<Coupon | undefined> {
    return this.couponService.coupon(id, args, gqlCtx);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('coupon.item-read')
  @Query(() => Coupon)
  async couponByCode(
    @Args({ name: 'code', type: () => String }) code: string,
    @Args() args?: CouponArgs,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<Coupon | undefined> {
    return this.couponService.couponByCode(code, args, gqlCtx);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('coupon.item-create')
  @Mutation(() => Coupon)
  async createCoupon(@Args('coupon') args: CreateCouponInput, @GqlCtx() gqlCtx?: IGqlCtx): Promise<Coupon | undefined> {
    return this.couponService.createCoupon(args, gqlCtx);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('coupon.item-update')
  @Mutation(() => Coupon)
  async updateCoupon(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('coupon') args: UpdateCouponInput,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<Coupon | undefined> {
    return this.couponService.updateCoupon(id, args, gqlCtx);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('coupon.item-delete')
  @Mutation(() => Coupon)
  async deleteCoupon(
    @Args({ name: 'id', type: () => Int }) id: number,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<Coupon | undefined> {
    return this.couponService.deleteCoupon(id, gqlCtx);
  }

  @Mutation(() => Coupon)
  async redeemCoupon(@Args('info') info: RedeemCouponInput, @GqlCtx() gqlCtx?: IGqlCtx): Promise<Coupon | undefined> {
    return this.couponService.redeemCoupon(info, gqlCtx);
  }
}
