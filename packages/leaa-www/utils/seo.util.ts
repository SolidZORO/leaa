import { envConfig } from '@leaa/www/configs';

const titleWichSiteName = (title: string): string => `${title} - ${envConfig.NAME}`;

export const seoUtil = {
  titleWichSiteName,
};
