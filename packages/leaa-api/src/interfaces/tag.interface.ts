import { FindOneOptions } from 'typeorm';
import { TagsArgs, TagArgs } from '@leaa/common/src/dtos/tag';
import { Tag } from '@leaa/common/src/entrys';

export type ITagsArgs = TagsArgs & FindOneOptions<Tag>;
export type ITagArgs = TagArgs & FindOneOptions<Tag>;
