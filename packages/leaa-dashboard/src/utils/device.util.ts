const getScreen = () => window.getComputedStyle(document.body, ':after').getPropertyValue('content').replace(/"/g, '');

const isMobile = (): boolean => {
  return getScreen() === 'xs';
};

export const deviceUtil = {
  getScreen,
  isMobile,
};
