import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Coupon } from '@leaa/common/src/entrys';
import { CreateCouponInput, UpdateCouponInput } from '@leaa/common/src/dtos/coupon';
import { CouponService } from '@leaa/api/src/modules/coupon/coupon.service';
import { CouponProperty } from '@leaa/api/src/modules/coupon/coupon.property';

// MOCK ID
const COUPON_ID = 'ffffffff-ffff-ffff-ffff-00000000000a';

describe('CouponService', () => {
  let couponService: CouponService;
  const COUPON_REPOSITORY_MOCK: Repository<Coupon> = new Repository<Coupon>();

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CouponService,
        {
          provide: getRepositoryToken(Coupon),
          useValue: COUPON_REPOSITORY_MOCK,
        },
        CouponProperty,
      ],
    }).compile();

    couponService = module.get<CouponService>(CouponService);
  });

  it('should be server defined', () => {
    expect(couponService).toBeDefined();
  });

  let couponObject = new Coupon();

  describe('createCoupon', () => {
    const createCouponInput: CreateCouponInput = {
      type: 'coupon',
      quantity: 10,
      name: 'COUPON-TEST',
      amount: 666.66,
      over_amount: 999.99,
      start_time: new Date(),
      expire_time: new Date(),
      status: 1,
    };

    couponObject = {
      ...createCouponInput,
      id: COUPON_ID,
      created_at: new Date(),
    };

    it('should create coupon', async () => {
      jest.spyOn(couponService, 'createCoupon').mockImplementation(async () => couponObject);
      const result = await couponService.createCoupon(createCouponInput);

      expect(result).toBe(couponObject);
    });
  });

  describe('updateCoupon', () => {
    const updateCouponInput: UpdateCouponInput = { start_time: new Date() };

    const updatedCoupon: Coupon = {
      ...couponObject,
      ...updateCouponInput,
    };

    it('should update coupon', async () => {
      jest.spyOn(couponService, 'updateCoupon').mockImplementation(async () => updatedCoupon);
      const result = await couponService.updateCoupon(COUPON_ID, updateCouponInput);

      expect(result).toBe(updatedCoupon);
    });
  });

  describe('getCoupon', () => {
    const couponsObject = {
      items: [couponObject, couponObject],
      page: 1,
      pageSize: 30,
      total: 10,
    };

    it('should return coupons', async () => {
      jest.spyOn(couponService, 'coupons').mockImplementation(async () => couponsObject);
      const result = await couponService.coupons({});

      expect(result).toBe(couponsObject);
    });

    it('should return coupon', async () => {
      jest.spyOn(couponService, 'coupon').mockImplementation(async () => couponObject);
      const result = await couponService.coupon(COUPON_ID);

      expect(result).toBe(couponObject);
    });

    it('should return couponByCode', async () => {
      jest.spyOn(couponService, 'couponByCode').mockImplementation(async () => couponObject);
      const result = await couponService.couponByCode('C76112A50DAE445C');

      expect(result).toBe(couponObject);
    });

    it('should return coupon (undefined)', async () => {
      jest.spyOn(couponService, 'coupon').mockImplementation(async () => undefined);
      const result = await couponService.coupon(COUPON_ID);

      expect(result).toBe(undefined);
    });
  });

  describe('redeemCoupon', () => {
    it('should redeem coupon', async () => {
      jest.spyOn(couponService, 'redeemCoupon').mockImplementation(async () => couponObject);
      const result = await couponService.redeemCoupon({ code: 'C76112A50DAE445C' });

      expect(result).toBe(couponObject);
    });
  });

  describe('deleteCoupon', () => {
    const deletedCoupon = undefined;

    it('should delete coupon', async () => {
      jest.spyOn(couponService, 'deleteCoupon').mockImplementation(async () => deletedCoupon);
      const result = await couponService.deleteCoupon(COUPON_ID);

      expect(result).toBe(deletedCoupon);
    });
  });
});
