export const getDeviceScreen = () =>
  window.getComputedStyle(document.body, ':after').getPropertyValue('content').replace(/"/g, '');

export const isMobile = (): boolean => {
  return getDeviceScreen() === 'xs';
};
