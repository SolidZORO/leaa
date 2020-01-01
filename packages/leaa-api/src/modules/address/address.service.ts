import { Injectable } from '@nestjs/common';
import { Repository, FindOneOptions } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Address, Permission, User } from '@leaa/common/src/entrys';
import {
  AddressesArgs,
  AddressArgs,
  AddressesWithPaginationObject,
  CreateAddressInput,
  UpdateAddressInput,
} from '@leaa/common/src/dtos/address';
import { argsUtil, curdUtil, paginationUtil } from '@leaa/api/src/utils';

type IAddresssArgs = AddressesArgs & FindOneOptions<Address>;
type IAddressArgs = AddressArgs & FindOneOptions<Address>;

const CLS_NAME = 'AddressService';

@Injectable()
export class AddressService {
  constructor(@InjectRepository(Address) private readonly addressRepository: Repository<Address>) {}

  async addresses(args: IAddresssArgs): Promise<AddressesWithPaginationObject | undefined> {
    const nextArgs = argsUtil.format(args);

    const PRIMARY_TABLE = 'addresses';
    const qb = this.addressRepository.createQueryBuilder(PRIMARY_TABLE);
    qb.select().orderBy(nextArgs.orderBy || 'id', nextArgs.orderSort);

    // q
    if (nextArgs.q) {
      const qLike = `%${nextArgs.q}%`;

      ['address', 'consignee'].forEach(key => {
        qb.orWhere(`${PRIMARY_TABLE}.${key} LIKE :${key}`, { [key]: qLike });
      });
    }

    // order
    qb.orderBy(`${PRIMARY_TABLE}.${nextArgs.orderBy}`, nextArgs.orderSort);

    return paginationUtil.calcQueryBuilderPageInfo({ qb, page: nextArgs.page, pageSize: nextArgs.pageSize });
  }

  async address(id: number, args?: IAddressArgs): Promise<Address | undefined> {
    let nextArgs: IAddressArgs = {};

    if (args) {
      nextArgs = args;
      // nextArgs.relations = ['permissions'];
    }

    return this.addressRepository.findOne(id, nextArgs);
  }

  async createAddress(args: CreateAddressInput): Promise<Address | undefined> {
    return this.addressRepository.save({ ...args });
  }

  async updateAddress(id: number, args: UpdateAddressInput, user?: User): Promise<Address | undefined> {
    const relationArgs: { permissions?: Permission[] } = {};

    return curdUtil.commonUpdate(this.addressRepository, CLS_NAME, id, args, relationArgs);
  }

  async deleteAddress(id: number, user?: User): Promise<Address | undefined> {
    return curdUtil.commonDelete(this.addressRepository, CLS_NAME, id);
  }
}
