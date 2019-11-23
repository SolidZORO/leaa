import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Ax, Category } from '@leaa/common/src/entrys';
import { CreateAxInput, UpdateAxInput } from '@leaa/common/src/dtos/ax';
import { AxService } from '@leaa/api/src/modules/ax/ax.service';

describe('AxService', () => {
  let axService: AxService;
  const AX_REPOSITORY_MOCK: Repository<Ax> = new Repository<Ax>();
  const CATEGORY_REPOSITORY_MOCK: Repository<Category> = new Repository<Category>();

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AxService,
        {
          provide: getRepositoryToken(Ax),
          useValue: AX_REPOSITORY_MOCK,
        },
        {
          provide: getRepositoryToken(Category),
          useValue: CATEGORY_REPOSITORY_MOCK,
        },
      ],
    }).compile();

    axService = module.get<AxService>(AxService);
  });

  it('should be server defined', () => {
    expect(axService).toBeDefined();
  });

  let axObject = new Ax();

  describe('createAx', () => {
    const createAxInput: CreateAxInput = {
      title: 'title',
      slug: 'slug',
      description: 'description',
      status: 1,
    };

    axObject = {
      ...createAxInput,
      id: 1,
      created_at: new Date(),
    };

    it('should create ax', async () => {
      jest.spyOn(axService, 'createAx').mockImplementation(async () => axObject);
      const result = await axService.createAx(createAxInput);

      expect(result).toBe(axObject);
    });
  });

  describe('updateAx', () => {
    const updateAxInput: UpdateAxInput = { title: 'update' };

    const updatedAx: Ax = {
      ...axObject,
      ...updateAxInput,
    };

    it('should update ax', async () => {
      jest.spyOn(axService, 'updateAx').mockImplementation(async () => updatedAx);
      const result = await axService.updateAx(1, updateAxInput);

      expect(result).toBe(updatedAx);
    });
  });

  describe('getAx', () => {
    const axsObject = {
      items: [axObject, axObject],
      page: 1,
      pageSize: 30,
      total: 10,
    };

    it('should return axs', async () => {
      jest.spyOn(axService, 'axs').mockImplementation(async () => axsObject);
      const result = await axService.axs({});

      expect(result).toBe(axsObject);
    });

    it('should return ax', async () => {
      jest.spyOn(axService, 'ax').mockImplementation(async () => axObject);
      const result = await axService.ax(1);

      expect(result).toBe(axObject);
    });

    it('should return ax (undefined)', async () => {
      jest.spyOn(axService, 'ax').mockImplementation(async () => undefined);
      const result = await axService.ax(2);

      expect(result).toBe(undefined);
    });
  });

  describe('deleteAx', () => {
    const deletedAx = undefined;

    it('should delete ax', async () => {
      jest.spyOn(axService, 'deleteAx').mockImplementation(async () => deletedAx);
      const result = await axService.deleteAx(1);

      expect(result).toBe(deletedAx);
    });
  });
});
