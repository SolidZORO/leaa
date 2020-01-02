import { FindOneOptions } from 'typeorm';
import { PromosArgs, PromoArgs } from '@leaa/common/src/dtos/promo';
import { Promo } from '@leaa/common/src/entrys';

export type IPromosArgs = PromosArgs & FindOneOptions<Promo>;
export type IPromoArgs = PromoArgs & FindOneOptions<Promo>;
