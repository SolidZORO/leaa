import { Category } from '@leaa/common/src/entrys';

export class CategoryTreeObject extends Category {
  //
  // readonly key!: string;

  readonly value!: string;

  readonly title?: string;

  readonly subtitle?: string;

  readonly expanded?: boolean | 'true' | 'false';

  readonly children?: CategoryTreeObject[];
}
