import { getAt2xPath } from '@leaa/api/src/utils';

describe('pathUtil', () => {
  describe('getAt2xPath', () => {
    it('should get at 2x path', () => {
      const at1xPath = '/attachments/2019/07/19744632-558c-483d-b3db-71b0af66fe05.png';
      const at2xPath = '/attachments/2019/07/19744632-558c-483d-b3db-71b0af66fe05_2x.png';

      expect(getAt2xPath(at1xPath)).toBe(at2xPath);
    });

    it('should get at 2x path (long)', () => {
      const at1xPath = '/attachments/.png/aaa/ccc/bbb.png/kk/2019/07/19744632-558c-483d-b3db-71b0af66fe05.png';
      const at2xPath = '/attachments/.png/aaa/ccc/bbb.png/kk/2019/07/19744632-558c-483d-b3db-71b0af66fe05_2x.png';

      expect(getAt2xPath(at1xPath)).toBe(at2xPath);
    });

    it('should get null', () => {
      const at1xPath = '';

      expect(getAt2xPath(at1xPath)).toBe(null);
    });
  });
});
