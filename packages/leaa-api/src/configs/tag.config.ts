import path from 'path';

const DICT_DIR = path.resolve(__dirname, '../../resources/dicts');
const TAGS_DICT_PATH = `${DICT_DIR}/tags.dict.txt`;

export const tagConfig = {
  DICT_DIR,
  TAGS_DICT_PATH,
};
