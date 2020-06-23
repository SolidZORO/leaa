export const CSS_SCREEN_XS = getComputedStyle(document.documentElement).getPropertyValue('--screen-xs') || '480px';
export const CSS_SCREEN_SM = getComputedStyle(document.documentElement).getPropertyValue('--screen-sm') || '576px';
export const CSS_SCREEN_MD = getComputedStyle(document.documentElement).getPropertyValue('--screen-md') || '768px';
export const CSS_SCREEN_LG = getComputedStyle(document.documentElement).getPropertyValue('--screen-lg') || '992px';
export const CSS_SCREEN_XL = getComputedStyle(document.documentElement).getPropertyValue('--screen-xl') || '1200px';
export const CSS_SCREEN_XXL = getComputedStyle(document.documentElement).getPropertyValue('--screen-xxl') || '1600px';

export const IS_MOBILE_SCREEN = `(max-width: ${CSS_SCREEN_MD})`;
