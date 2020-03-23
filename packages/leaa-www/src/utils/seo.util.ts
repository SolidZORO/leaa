import { useStore } from '@leaa/www/src/stores';

const titleWichSiteName = (title?: string): string => {
  const store = useStore();

  const settingSiteName = store && store.setting && store.setting.globalSettings.find((s) => s.slug === 'site_name');

  let siteName = 'NOT-SITE-NAME';

  if (settingSiteName && settingSiteName.value) {
    siteName = settingSiteName.value;
  }

  return `${title} - ${siteName}`;
};

export const seoUtil = {
  titleWichSiteName,
};
