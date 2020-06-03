import { DEBUG_MODE_SL_KEY } from '@leaa/dashboard/src/constants';
// @ts-ignore

export declare type IDebugModeValue = '1' | '0' | string;

// DebugMode (localStorage)
export const setDebugMode = (value: boolean) => localStorage.setItem(DEBUG_MODE_SL_KEY, `${Number(value)}`);
export const getAuthInfo = (): IDebugModeValue | null => localStorage.getItem(DEBUG_MODE_SL_KEY);
export const isDebugMode = (): boolean => getAuthInfo() === '1';
