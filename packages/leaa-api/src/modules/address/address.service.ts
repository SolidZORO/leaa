import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Address, Permission, User } from '@leaa/common/src/entrys';
import { AddressesWithPaginationObject, CreateAddressInput, UpdateAddressInput } from '@leaa/common/src/dtos/address';
import { argsFormat, commonUpdate, commonDelete, calcQbPageInfo, errorMessage } from '@leaa/api/src/utils';
import { IAddresssArgs, IAddressArgs } from '@leaa/api/src/interfaces';

const CLS_NAME = 'AddressService';

@Injectable()
export class AddressService {
  constructor(@InjectRepository(Address) private readonly addressRepository: Repository<Address>) {}

  async addresses(args: IAddresssArgs): Promise<AddressesWithPaginationObject | undefined> {
    const nextArgs = argsFormat(args);

    const PRIMARY_TABLE = 'addresses';
    const qb = this.addressRepository.createQueryBuilder(PRIMARY_TABLE);
    qb.select().orderBy(nextArgs.orderBy || 'id', nextArgs.orderSort);

    // q
    if (nextArgs.q) {
      const qLike = `%${nextArgs.q}%`;

      ['address', 'consignee'].forEach((key) => {
        qb.orWhere(`${PRIMARY_TABLE}.${key} LIKE :${key}`, { [key]: qLike });
      });
    }

    // order
    if (nextArgs.orderBy && nextArgs.orderSort) {
      qb.orderBy(`${PRIMARY_TABLE}.${nextArgs.orderBy}`, nextArgs.orderSort);
    }

    return calcQbPageInfo({ qb, page: nextArgs.page, pageSize: nextArgs.pageSize });
  }

  async address(id: string, args?: IAddressArgs): Promise<Address | undefined> {
    if (!id) throw errorMessage({ t: ['_error:notFoundId'] });

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

  async updateAddress(id: string, args: UpdateAddressInput, user?: User): Promise<Address | undefined> {
    const relationArgs: { permissions?: Permission[] } = {};

    return commonUpdate({ repository: this.addressRepository, CLS_NAME, id, args, relation: relationArgs });
  }

  async deleteAddress(id: string, user?: User): Promise<Address | undefined> {
    return commonDelete({ repository: this.addressRepository, CLS_NAME, id });
  }
}
