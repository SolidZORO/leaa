import { genSlug } from '@leaa/api/src/utils';

describe('stringUtil', () => {
  describe('getSlug', () => {
    it('should is slug', () => {
      expect(genSlug('你的-NS')).toBe('ni-de-ns');
      expect(genSlug('你的-NS')).not.toBe('ni-de-NS');
      expect(genSlug('ABC--123')).toBe('abc--123');
      expect(genSlug('ABC--123')).not.toBe('abc-123');
      expect(genSlug('today is nice day')).toBe('today-is-nice-day');
      expect(genSlug('今天天气好好！')).toBe('jin-tian-tian-qi-hao-hao');
      expect(genSlug('haha今天天气好好！')).toBe('haha-jin-tian-tian-qi-hao-hao');
    });
  });
});
