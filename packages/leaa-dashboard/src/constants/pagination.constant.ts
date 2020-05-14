import { ICrudQueryParams } from '@leaa/dashboard/src/interfaces';

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 8;

export const DEFAULT_QUERY = {
  page: 1,
  limit: DEFAULT_PAGE_SIZE,
};

export const DEFAULT_PAGE_SIZE_OPTIONS = [
  '5',
  '8',
  '10',
  '15',
  '20',
  '30',
  '50',
  '100',
  '200',
  '500',
  '1000',
  '5000',
  '999999999',
];
