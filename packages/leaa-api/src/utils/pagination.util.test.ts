import { paginationUtil } from '@leaa/api/src/utils';
import { IPageInfo, IPageInfoResult } from '@leaa/api/src/utils/pagination.util';

describe('paginationUtil', () => {
  describe('calcPageInfo', () => {
    it('should get page info', async () => {
      const items = [];

      for (let i = 0; i < 100; i += 1) {
        items.push(i);
      }

      const input: IPageInfo = { items, total: 100, pageSize: 30, page: 1 };
      const output: IPageInfoResult = {
        items,
        itemsCount: 100,
        total: 100,
        pageSize: 30,
        page: 1,
        nextPage: 2,
      };

      const result = paginationUtil.calcPageInfo(input);

      expect(result).toEqual(output);
    });

    it('should get page info (not next page)', async () => {
      const items = [];

      for (let i = 0; i < 1; i += 1) {
        items.push(i);
      }

      const input: IPageInfo = { items, total: 1, pageSize: 30, page: 1 };
      const output: IPageInfoResult = {
        items,
        itemsCount: 1,
        total: 1,
        pageSize: 30,
        page: 1,
        nextPage: null,
      };

      const result = paginationUtil.calcPageInfo(input);

      expect(result).toEqual(output);
    });
  });
});
