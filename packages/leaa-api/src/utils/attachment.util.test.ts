import { filenameAt1xToAt2x, isAt2x } from '@leaa/api/src/utils';

describe('attachmentUtil', () => {
  describe('isAt2x', () => {
    const at1xFilename = 'xxxx.jpg';
    const at2xFilenameAt = 'xxxx@2x.jpg';
    const at2xFilenameUnderline = 'xxxx_2x.jpg';
    const at2xFilenameFullwidth = 'xxxx_＠2x.jpg';
    const invalidFilename = 'xxxx';

    it('should is not at 2x', () => {
      expect(isAt2x(at1xFilename)).toBe(false);
    });

    it('should is at 2x (At)', () => {
      expect(isAt2x(at2xFilenameAt)).toBe(true);
    });

    it('should is at 2x (Underline)', () => {
      expect(isAt2x(at2xFilenameUnderline)).toBe(true);
    });

    it('should is at 2x (Full Width)', () => {
      expect(isAt2x(at2xFilenameFullwidth)).toBe(true);
    });

    it('should is at 2x (Invalid Filename)', () => {
      expect(isAt2x(invalidFilename)).toBe(false);
    });
  });

  describe('filenameAt1xToAt2x', () => {
    const at1xFilename = 'xxxx.jpg';
    const at2xFilenameAt = 'xxxx@2x.jpg';

    it('should is 1x to 2x', () => {
      expect(filenameAt1xToAt2x(at1xFilename)).toBe('xxxx_2x.jpg');
    });

    it('should is 1x to 2x (At 2x)', () => {
      expect(filenameAt1xToAt2x(at2xFilenameAt)).toBe('xxxx@2x_2x.jpg');
    });
  });
});
