import { Base, Category } from '@leaa/app/src/entrys';

export interface Article extends Base {
  title: string;
  slug?: string;
  category_id?: number;
  user_id?: number;
  description?: string;
  content?: string;
  status?: number;
  category?: Category;
}
