import fs from 'fs';
import nodejieba from 'nodejieba';

import { dictConfig } from '@leaa/api/src/configs';

const cutTags = (text: string, limit = 5): string[] => {
  if (fs.existsSync(dictConfig.TAGS_DICT_PATH)) {
    nodejieba.load({
      // dict: nodejieba.DEFAULT_DICT,
      // hmmDict: nodejieba.DEFAULT_HMM_DICT,
      // idfDict: nodejieba.DEFAULT_IDF_DICT,
      // stopWordDict: nodejieba.DEFAULT_STOP_WORD_DICT,
      // userDict: '@leaa/api/src/assets/dicts/user.dict.utf8',
      userDict: dictConfig.TAGS_DICT_PATH,
    });
  }

  // @ts-ignore
  const jiebaAllTags = nodejieba.tagWordsToStr(nodejieba.tag(text));
  const jiebaExtractTags: { word: string; weight: number }[] = nodejieba.extractWithWords(jiebaAllTags, limit);

  return jiebaExtractTags.map(tag => tag.word);
};

export const dictUtil = {
  cutTags,
};
