import { Category } from '@leaa/api/src/entrys';

export class CategoryGetTreeRes extends Category {
  //
  // readonly key!: string;

  readonly value!: string;

  readonly title?: string;

  readonly subtitle?: string;

  readonly expanded?: boolean | 'true' | 'false';

  readonly children?: CategoryGetTreeRes[];
}
