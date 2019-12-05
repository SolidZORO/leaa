import { Category } from '@leaa/common/src/entrys';

type ICategoryBase = Pick<Category, 'id' | 'parent_id'>;

export interface ICategoryTreeWithKey extends ICategoryBase {
  key: string;
  title: string;
  value: number;
  slug?: string;
  subtitle?: string;
  children?: ICategoryTreeWithKey[];
}
