import { Args, Query, Mutation, Resolver, ResolveField, Parent } from '@nestjs/graphql';

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

  @Permissions('coupon.list-read')
  @Query(() => CouponsWithPaginationObject)
  async coupons(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args() args: CouponsArgs,
  ): Promise<CouponsWithPaginationObject | undefined> {
    return this.couponService.coupons(gqlCtx, args);
  }

  @Permissions('coupon.item-read')
  @Query(() => Coupon)
  async coupon(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'id', type: () => String }) id: string,
    @Args() args?: CouponArgs,
  ): Promise<Coupon | undefined> {
    return this.couponService.coupon(gqlCtx, id, args);
  }

  @Permissions('coupon.item-read')
  @Query(() => Coupon)
  async couponByCode(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'code', type: () => String }) code: string,
    @Args() args?: CouponArgs,
  ): Promise<Coupon | undefined> {
    return this.couponService.couponByCode(gqlCtx, code, args);
  }

  @Permissions('coupon.item-create')
  @Mutation(() => Coupon)
  async createCoupon(@GqlCtx() @Args('coupon') args: CreateCouponInput): Promise<Coupon | undefined> {
    return this.couponService.createCoupon(gqlCtx, args);
  }

  @Permissions('coupon.item-update')
  @Mutation(() => Coupon)
  async updateCoupon(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'id', type: () => String }) id: string,
    @Args('coupon') args: UpdateCouponInput,
  ): Promise<Coupon | undefined> {
    return this.couponService.updateCoupon(gqlCtx, id, args);
  }

  @Permissions('coupon.item-delete')
  @Mutation(() => Coupon)
  async deleteCoupon(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'id', type: () => String }) id: string,
  ): Promise<Coupon | undefined> {
    return this.couponService.deleteCoupon(gqlCtx, id);
  }

  @Mutation(() => Coupon)
  async redeemCoupon(@GqlCtx() @Args('info') info: RedeemCouponInput): Promise<Coupon | undefined> {
    return this.couponService.redeemCoupon(gqlCtx, info);
  }
}
