import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Category } from '@leaa/common/src/entrys';
import { CreateCategoryInput, UpdateCategoryInput } from '@leaa/common/src/dtos/category';
import { CategoryService } from '@leaa/api/src/modules/category/category.service';

describe('CategoryService', () => {
  let categoryService: CategoryService;
  const CATEGORY_REPOSITORY_MOCK: Repository<Category> = new Repository<Category>();

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(Category),
          useValue: CATEGORY_REPOSITORY_MOCK,
        },
      ],
    }).compile();

    categoryService = module.get<CategoryService>(CategoryService);
  });

  it('should be server defined', () => {
    expect(categoryService).toBeDefined();
  });

  let categoryObject = new Category();

  describe('createCategory', () => {
    const createCategoryInput: CreateCategoryInput = {
      name: 'name',
      slug: 'slug',
      description: 'description',
    };

    categoryObject = {
      ...createCategoryInput,
      id: 1,
      parent_id: 0,
      created_at: new Date(),
    };

    it('should create category', async () => {
      jest.spyOn(categoryService, 'createCategory').mockImplementation(async () => categoryObject);
      const result = await categoryService.createCategory(createCategoryInput);

      expect(result).toBe(categoryObject);
    });
  });

  describe('updateCategory', () => {
    const updateCategoryInput: UpdateCategoryInput = { name: 'update' };

    const updatedCategory: Category | any = {
      ...categoryObject,
      ...updateCategoryInput,
    };

    it('should update category', async () => {
      jest.spyOn(categoryService, 'updateCategory').mockImplementation(async () => updatedCategory);
      const result = await categoryService.updateCategory(1, updateCategoryInput);

      expect(result).toBe(updatedCategory);
    });
  });

  describe('getCategory', () => {
    const categoriesObject = {
      items: [categoryObject, categoryObject],
      page: 1,
      pageSize: 30,
      total: 10,
    };

    it('should return categories', async () => {
      jest.spyOn(categoryService, 'categories').mockImplementation(async () => categoriesObject);
      const result = await categoryService.categories({});

      expect(result).toBe(categoriesObject);
    });

    it('should return category', async () => {
      jest.spyOn(categoryService, 'category').mockImplementation(async () => categoryObject);
      const result = await categoryService.category(1);

      expect(result).toBe(categoryObject);
    });

    it('should return category (undefined)', async () => {
      jest.spyOn(categoryService, 'category').mockImplementation(async () => undefined);
      const result = await categoryService.category(2);

      expect(result).toBe(undefined);
    });
  });

  describe('deleteCategory', () => {
    const deletedCategory = undefined;

    it('should delete category', async () => {
      jest.spyOn(categoryService, 'deleteCategory').mockImplementation(async () => deletedCategory);
      const result = await categoryService.deleteCategory(1);

      expect(result).toBe(deletedCategory);
    });
  });
});
