import { UseGuards } from '@nestjs/common';
import { Args, Query, Mutation, Resolver, Int } from '@nestjs/graphql';

import { Address, User } from '@leaa/common/src/entrys';
import {
  AddressesArgs,
  AddressesWithPaginationObject,
  AddressArgs,
  CreateAddressInput,
  UpdateAddressInput,
} from '@leaa/common/src/dtos/address';
import { AddressService } from '@leaa/api/src/modules/address/address.service';
import { CurrentUser, Permissions } from '@leaa/api/src/decorators';
import { PermissionsGuard } from '@leaa/api/src/guards';

@Resolver(() => Address)
export class AddressResolver {
  constructor(private readonly addressService: AddressService) {}

  @UseGuards(PermissionsGuard)
  @Permissions('address.list-read')
  @Query(() => AddressesWithPaginationObject)
  async addresses(@Args() args: AddressesArgs): Promise<AddressesWithPaginationObject | undefined> {
    return this.addressService.addresses(args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('address.item-read')
  @Query(() => Address)
  async address(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args() args?: AddressArgs,
  ): Promise<Address | undefined> {
    return this.addressService.address(id, args);
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
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('address') args: UpdateAddressInput,
    @CurrentUser() user?: User,
  ): Promise<Address | undefined> {
    return this.addressService.updateAddress(id, args, user);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('address.item-delete')
  @Mutation(() => Address)
  async deleteAddress(
    @Args({ name: 'id', type: () => Int }) id: number,
    @CurrentUser() user?: User,
  ): Promise<Address | undefined> {
    return this.addressService.deleteAddress(id, user);
  }
}
