import { FindOneOptions } from 'typeorm';
import { AddressesArgs, AddressArgs } from '@leaa/common/src/dtos/address';
import { Address } from '@leaa/common/src/entrys';

export type IAddresssArgs = AddressesArgs & FindOneOptions<Address>;
export type IAddressArgs = AddressArgs & FindOneOptions<Address>;
