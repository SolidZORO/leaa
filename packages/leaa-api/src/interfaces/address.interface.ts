import { FindOneOptions } from 'typeorm';
import { AddressGetManyReq, AddressGetOneReq } from '@leaa/common/src/dtos/address';
import { Address } from '@leaa/common/src/entrys';

export type IAddresssArgs = AddressGetManyReq & FindOneOptions<Address>;
export type IAddressArgs = AddressGetOneReq & FindOneOptions<Address>;
