import { useStore } from '@leaa/www/stores';

const titleWichSiteName = (title: string): string => {
  const store = useStore();

  const settingSiteName = store.setting.globalSettings.find(s => s.slug === 'site_name');
  const siteName = (settingSiteName && settingSiteName.value) || 'NOT-SITE-NAME';

  // console.log(settingSiteName && settingSiteName.value);

  return `${title} - ${siteName}`;
};

export const seoUtil = {
  titleWichSiteName,
};
