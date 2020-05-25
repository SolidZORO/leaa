import path from 'path';
import { envConfig } from '@leaa/api/src/modules/v1/config/config.module';

const DIVISION_DIR = path.resolve(__dirname, `../../${envConfig.PUBLIC_DIR}/assets/divisions`);
const DIVISION_OF_CHINA_FILE_PATH = `${DIVISION_DIR}/division_of_china.json`;

export const divisionConfig = {
  DIVISION_DIR,
  DIVISION_OF_CHINA_FILE_PATH,
};
