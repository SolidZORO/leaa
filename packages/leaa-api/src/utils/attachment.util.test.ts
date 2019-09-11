import { attachmentUtil } from '@leaa/api/src/utils';

describe('attachmentUtil', () => {
  describe('isAt2x', () => {
    const at1xFilename = 'xxxx.jpg';
    const at2xFilenameAt = 'xxxx@2x.jpg';
    const at2xFilenameUnderline = 'xxxx_2x.jpg';
    const at2xFilenameFullwidth = 'xxxx_＠2x.jpg';
    const invalidFilename = 'xxxx';

    it('should is not at 2x', () => {
      expect(attachmentUtil.isAt2x(at1xFilename)).toBe(false);
    });

    it('should is at 2x (At)', () => {
      expect(attachmentUtil.isAt2x(at2xFilenameAt)).toBe(true);
    });

    it('should is at 2x (Underline)', () => {
      expect(attachmentUtil.isAt2x(at2xFilenameUnderline)).toBe(true);
    });

    it('should is at 2x (Full Width)', () => {
      expect(attachmentUtil.isAt2x(at2xFilenameFullwidth)).toBe(true);
    });

    it('should is at 2x (Invalid Filename)', () => {
      expect(attachmentUtil.isAt2x(invalidFilename)).toBe(false);
    });
  });

  describe('filenameAt1xToAt2x', () => {
    const at1xFilename = 'xxxx.jpg';
    const at2xFilenameAt = 'xxxx@2x.jpg';

    it('should is 1x to 2x', () => {
      expect(attachmentUtil.filenameAt1xToAt2x(at1xFilename)).toBe('xxxx_2x.jpg');
    });

    it('should is 1x to 2x (At 2x)', () => {
      expect(attachmentUtil.filenameAt1xToAt2x(at2xFilenameAt)).toBe('xxxx@2x_2x.jpg');
    });
  });
});
