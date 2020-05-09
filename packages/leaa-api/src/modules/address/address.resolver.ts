import { UseGuards } from '@nestjs/common';
import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';

import { Address, User } from '@leaa/common/src/entrys';
import {
  AddressesArgs,
  AddressesWithPaginationObject,
  AddressArgs,
  CreateAddressInput,
  UpdateAddressInput,
} from '@leaa/common/src/dtos/address';
import { AddressService } from '@leaa/api/src/modules/address/address.service';
import { CurrentUser, Permissions, GqlCtx } from '@leaa/api/src/decorators';
import { PermissionsGuard } from '@leaa/api/src/guards';
import { IGqlCtx } from '@leaa/api/src/interfaces';

@Resolver(() => Address)
export class AddressResolver {
  constructor(private readonly addressService: AddressService) {}

  @UseGuards(PermissionsGuard)
  @Permissions('address.list-read')
  @Query(() => AddressesWithPaginationObject)
  async addresses(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args() args: AddressesArgs,
  ): Promise<AddressesWithPaginationObject | undefined> {
    return this.addressService.addresses(gqlCtx, args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('address.item-read')
  @Query(() => Address)
  async address(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'id', type: () => String }) id: string,
    @Args() args?: AddressArgs,
  ): Promise<Address | undefined> {
    return this.addressService.address(gqlCtx, id, args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('address.item-create')
  @Mutation(() => Address)
  async createAddress(@Args('address') args: CreateAddressInput): Promise<Address | undefined> {
    return this.addressService.createAddress(args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('address.item-update')
  @Mutation(() => Address)
  async updateAddress(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'id', type: () => String }) id: string,
    @Args('address') args: UpdateAddressInput,
  ): Promise<Address | undefined> {
    return this.addressService.updateAddress(gqlCtx, id, args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('address.item-delete')
  @Mutation(() => Address)
  async deleteAddress(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'id', type: () => String }) id: string,
    @CurrentUser() user?: User,
  ): Promise<Address | undefined> {
    return this.addressService.deleteAddress(gqlCtx, id);
  }
}
