import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Address, Permission } from '@leaa/common/src/entrys';
import { AddressesWithPaginationObject, CreateAddressInput, UpdateAddressInput } from '@leaa/common/src/dtos/address';
import { argsFormat, commonUpdate, commonDelete, calcQbPageInfo, errorMsg } from '@leaa/api/src/utils';
import { IAddresssArgs, IAddressArgs, IGqlCtx } from '@leaa/api/src/interfaces';

const CLS_NAME = 'AddressService';

@Injectable()
export class AddressService {
  constructor(@InjectRepository(Address) private readonly addressRepository: Repository<Address>) {}

  async addresses(gqlCtx: IGqlCtx, args: IAddresssArgs): Promise<AddressesWithPaginationObject | undefined> {
    // const { t } = gqlCtx;

    const nextArgs = argsFormat(args, gqlCtx);

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

  async address(gqlCtx: IGqlCtx, id: string, args?: IAddressArgs): Promise<Address | undefined> {
    const { t } = gqlCtx;

    if (!id) throw errorMsg(t('_error:notFoundId'));

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

  async updateAddress(gqlCtx: IGqlCtx, id: string, args: UpdateAddressInput): Promise<Address | undefined> {
    const relationArgs: { permissions?: Permission[] } = {};

    return commonUpdate({ repository: this.addressRepository, CLS_NAME, id, args, relation: relationArgs, gqlCtx });
  }

  async deleteAddress(gqlCtx: IGqlCtx, id: string): Promise<Address | undefined> {
    return commonDelete({ repository: this.addressRepository, CLS_NAME, id, gqlCtx });
  }
}
