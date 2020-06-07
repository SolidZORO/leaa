import * as nodejieba from '@node-rs/jieba';

export const cutTags = (text: string, limit = 5): string[] => {
  nodejieba.load();

  return nodejieba.extract(text, limit);
};
