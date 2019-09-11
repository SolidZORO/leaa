import { attachmentUtil } from '@leaa/api/src/utils';

describe('attachmentUtil', () => {
  describe('isAt2x', () => {
    const at1xFilename = 'xxxx.jpg';
    const at2xFilenameAt = 'xxxx@2x.jpg';
    const at2xFilenameUnderline = 'xxxx_2x.jpg';
    const at2xFilenameFullwidth = 'xxxx_＠2x.jpg';
    const invalidFilename = 'xxxx';

    it('should is not at 2x', async () => {
      expect(attachmentUtil.isAt2x(at1xFilename)).toBe(false);
    });

    it('should is at 2x (At)', async () => {
      expect(attachmentUtil.isAt2x(at2xFilenameAt)).toBe(true);
    });

    it('should is at 2x (Underline)', async () => {
      expect(attachmentUtil.isAt2x(at2xFilenameUnderline)).toBe(true);
    });

    it('should is at 2x (Full Width)', async () => {
      expect(attachmentUtil.isAt2x(at2xFilenameFullwidth)).toBe(true);
    });

    it('should is at 2x (Invalid Filename)', async () => {
      expect(attachmentUtil.isAt2x(invalidFilename)).toBe(false);
    });
  });

  describe('filenameAt1xToAt2x', () => {
    const at1xFilename = 'xxxx.jpg';
    const at2xFilenameAt = 'xxxx@2x.jpg';

    it('should is 1x to 2x', async () => {
      expect(attachmentUtil.filenameAt1xToAt2x(at1xFilename)).toBe('xxxx_2x.jpg');
    });

    it('should is 1x to 2x (At 2x)', async () => {
      expect(attachmentUtil.filenameAt1xToAt2x(at2xFilenameAt)).toBe('xxxx@2x_2x.jpg');
    });
  });
});
