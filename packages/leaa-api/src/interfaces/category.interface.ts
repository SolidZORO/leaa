import { Category } from '@leaa/common/entrys';

type ICategoryBase = Pick<Category, 'id' | 'parent_id'>;

export interface ICategoryTreeWithKey extends ICategoryBase {
  key: string;
  title: string;
  value: number;
  children?: ICategoryTreeWithKey[];
}
