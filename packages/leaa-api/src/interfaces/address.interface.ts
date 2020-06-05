import { FindOneOptions } from 'typeorm';
import { AddressGetManyReq, AddressGetOneReq } from '@leaa/api/src/dtos/address';
import { Address } from '@leaa/api/src/entrys';

export type IAddresssArgs = AddressGetManyReq & FindOneOptions<Address>;
export type IAddressArgs = AddressGetOneReq & FindOneOptions<Address>;
