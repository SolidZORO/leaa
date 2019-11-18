import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Coupon, Category } from '@leaa/common/src/entrys';
import { CreateCouponInput, UpdateCouponInput } from '@leaa/common/src/dtos/coupon';
import { CouponService } from '@leaa/api/src/modules/coupon/coupon.service';

describe('CouponService', () => {
  let couponService: CouponService;
  const ARTICLE_REPOSITORY_MOCK: Repository<Coupon> = new Repository<Coupon>();
  const CATEGORY_REPOSITORY_MOCK: Repository<Category> = new Repository<Category>();

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CouponService,
        {
          provide: getRepositoryToken(Coupon),
          useValue: ARTICLE_REPOSITORY_MOCK,
        },
        {
          provide: getRepositoryToken(Category),
          useValue: CATEGORY_REPOSITORY_MOCK,
        },
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
      slug: 'COUPON-TEST',
      amount: 66.66,
      over_amount: 99.99,
      start_time: new Date(),
      expire_time: new Date(),
      status: 1,
    };

    couponObject = {
      ...createCouponInput,
      id: 1,
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
      const result = await couponService.updateCoupon(1, updateCouponInput);

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
      const result = await couponService.coupon(1);

      expect(result).toBe(couponObject);
    });

    it('should return coupon (undefined)', async () => {
      jest.spyOn(couponService, 'coupon').mockImplementation(async () => undefined);
      const result = await couponService.coupon(2);

      expect(result).toBe(undefined);
    });
  });

  describe('deleteCoupon', () => {
    const deletedCoupon = undefined;

    it('should delete coupon', async () => {
      jest.spyOn(couponService, 'deleteCoupon').mockImplementation(async () => deletedCoupon);
      const result = await couponService.deleteCoupon(1);

      expect(result).toBe(deletedCoupon);
    });
  });
});
