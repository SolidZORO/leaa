import { getSlug } from '@leaa/api/src/utils';

describe('stringUtil', () => {
  describe('getSlug', () => {
    it('should is slug', () => {
      expect(getSlug('你的-NS')).toBe('ns');
      expect(getSlug('你的-NS')).not.toBe('NS');
      expect(getSlug('ABC--123')).toBe('abc-123');
      expect(getSlug('today is nice day')).toBe('today-is-nice-day');
      expect(getSlug('今天天气好好！')).toBe('今天天气好好！');
      expect(getSlug('haha今天天气好好！')).toBe('haha');
    });
  });
});
