import { FindOneOptions } from 'typeorm';
import { TagGetManyReq, TagGetOneReq } from '@leaa/api/src/dtos/tag';
import { Tag } from '@leaa/api/src/entrys';

export type ITagsArgs = TagGetManyReq & FindOneOptions<Tag>;
export type ITagArgs = TagGetOneReq & FindOneOptions<Tag>;
