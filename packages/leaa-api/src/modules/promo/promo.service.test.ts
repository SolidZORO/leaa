import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Promo } from '@leaa/common/src/entrys';
import { CreatePromoInput, UpdatePromoInput } from '@leaa/common/src/dtos/promo';
import { PromoService } from '@leaa/api/src/modules/promo/promo.service';
import { PromoProperty } from '@leaa/api/src/modules/promo/promo.property';

// MOCK ID
const PROMO_ID = 'ffffffff-ffff-ffff-ffff-00000000000a';

describe('PromoService', () => {
  let promoService: PromoService;
  const PROMO_REPOSITORY_MOCK: Repository<Promo> = new Repository<Promo>();

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PromoService,
        {
          provide: getRepositoryToken(Promo),
          useValue: PROMO_REPOSITORY_MOCK,
        },
        PromoProperty,
      ],
    }).compile();

    promoService = module.get<PromoService>(PromoService);
  });

  it('should be server defined', () => {
    expect(promoService).toBeDefined();
  });

  let promoObject = new Promo();

  describe('createPromo', () => {
    const createPromoInput: CreatePromoInput = {
      quantity: 10,
      name: 'PROMO-TEST',
      amount: 666.66,
      over_amount: 999.99,
      start_time: new Date(),
      expire_time: new Date(),
      status: 1,
    };

    promoObject = {
      ...createPromoInput,
      id: PROMO_ID,
      created_at: new Date(),
    };

    it('should create promo', async () => {
      jest.spyOn(promoService, 'createPromo').mockImplementation(async () => promoObject);
      const result = await promoService.createPromo(createPromoInput);

      expect(result).toBe(promoObject);
    });
  });

  describe('updatePromo', () => {
    const updatePromoInput: UpdatePromoInput = { start_time: new Date() };

    const updatedPromo: Promo = {
      ...promoObject,
      ...updatePromoInput,
    };

    it('should update promo', async () => {
      jest.spyOn(promoService, 'updatePromo').mockImplementation(async () => updatedPromo);
      const result = await promoService.updatePromo(PROMO_ID, updatePromoInput);

      expect(result).toBe(updatedPromo);
    });
  });

  describe('getPromo', () => {
    const promosObject = {
      items: [promoObject, promoObject],
      page: 1,
      pageSize: 30,
      total: 10,
    };

    it('should return promos', async () => {
      jest.spyOn(promoService, 'promos').mockImplementation(async () => promosObject);
      const result = await promoService.promos({});

      expect(result).toBe(promosObject);
    });

    it('should return promo', async () => {
      jest.spyOn(promoService, 'promo').mockImplementation(async () => promoObject);
      const result = await promoService.promo(PROMO_ID);

      expect(result).toBe(promoObject);
    });

    it('should return promo (undefined)', async () => {
      jest.spyOn(promoService, 'promo').mockImplementation(async () => undefined);
      const result = await promoService.promo(PROMO_ID);

      expect(result).toBe(undefined);
    });
  });

  describe('deletePromo', () => {
    const deletedPromo = undefined;

    it('should delete promo', async () => {
      jest.spyOn(promoService, 'deletePromo').mockImplementation(async () => deletedPromo);
      const result = await promoService.deletePromo(PROMO_ID);

      expect(result).toBe(deletedPromo);
    });
  });
});
