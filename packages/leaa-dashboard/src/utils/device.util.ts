export const getDeviceScreen = () =>
  window.getComputedStyle(document.body, ':after').getPropertyValue('content').replace(/"/g, '');

console.log(getDeviceScreen());

export const isMobile = (): boolean => {
  return getDeviceScreen() === 'xs';
};
