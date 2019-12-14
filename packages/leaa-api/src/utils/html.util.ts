import htmlToText from 'html-to-text';

const formatHtmlToText = (content?: string, title?: string): string => {
  const resultTitle = `${title || ''}\n\n`;
  let resultText = '';

  if (content) {
    // @see https://github.com/werk85/node-html-to-text
    resultText = htmlToText.fromString(content, { wordwrap: false, ignoreHref: true });
  }

  return resultTitle + resultText;
};

export const htmlUtil = {
  formatHtmlToText,
};
