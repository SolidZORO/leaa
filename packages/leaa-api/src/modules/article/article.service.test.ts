import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Article, Category, Tag } from '@leaa/common/src/entrys';
import { CreateArticleInput, UpdateArticleInput } from '@leaa/common/src/dtos/article';
import { ArticleService } from '@leaa/api/src/modules/article/article.service';
import { TagService } from '@leaa/api/src/modules/tag/tag.service';

describe('ArticleService', () => {
  let articleService: ArticleService;
  const ARTICLE_REPOSITORY_MOCK: Repository<Article> = new Repository<Article>();
  const CATEGORY_REPOSITORY_MOCK: Repository<Category> = new Repository<Category>();
  const TAG_REPOSITORY_MOCK: Repository<Tag> = new Repository<Tag>();

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleService,
        TagService,
        {
          provide: getRepositoryToken(Article),
          useValue: ARTICLE_REPOSITORY_MOCK,
        },
        {
          provide: getRepositoryToken(Category),
          useValue: CATEGORY_REPOSITORY_MOCK,
        },
        {
          provide: getRepositoryToken(Tag),
          useValue: TAG_REPOSITORY_MOCK,
        },
      ],
    }).compile();

    articleService = module.get<ArticleService>(ArticleService);
  });

  it('should be server defined', () => {
    expect(articleService).toBeDefined();
  });

  let articleObject = new Article();

  describe('createArticle', () => {
    const createArticleInput: CreateArticleInput = {
      title: 'title',
      slug: 'slug',
      categoryIds: [1],
      user_id: 1,
      description: 'description',
      content: '<p>content</p>',
      status: 1,
    };

    articleObject = {
      ...createArticleInput,
      id: 1,
      created_at: new Date(),
    };

    it('should create article', async () => {
      jest.spyOn(articleService, 'createArticle').mockImplementation(async () => articleObject);
      const result = await articleService.createArticle(createArticleInput);

      expect(result).toBe(articleObject);
    });
  });

  describe('updateArticle', () => {
    const updateArticleInput: UpdateArticleInput = { title: 'update' };

    const updatedArticle: Article = {
      ...articleObject,
      ...updateArticleInput,
    };

    it('should update article', async () => {
      jest.spyOn(articleService, 'updateArticle').mockImplementation(async () => updatedArticle);
      const result = await articleService.updateArticle(1, updateArticleInput);

      expect(result).toBe(updatedArticle);
    });
  });

  describe('getArticle', () => {
    const articlesObject = {
      items: [articleObject, articleObject],
      page: 1,
      pageSize: 30,
      total: 10,
    };

    it('should return articles', async () => {
      jest.spyOn(articleService, 'articles').mockImplementation(async () => articlesObject);
      const result = await articleService.articles({});

      expect(result).toBe(articlesObject);
    });

    it('should return article', async () => {
      jest.spyOn(articleService, 'article').mockImplementation(async () => articleObject);
      const result = await articleService.article(1);

      expect(result).toBe(articleObject);
    });

    it('should return article (undefined)', async () => {
      jest.spyOn(articleService, 'article').mockImplementation(async () => undefined);
      const result = await articleService.article(2);

      expect(result).toBe(undefined);
    });
  });

  describe('deleteArticle', () => {
    const deletedArticle = undefined;

    it('should delete article', async () => {
      jest.spyOn(articleService, 'deleteArticle').mockImplementation(async () => deletedArticle);
      const result = await articleService.deleteArticle(1);

      expect(result).toBe(deletedArticle);
    });
  });
});
