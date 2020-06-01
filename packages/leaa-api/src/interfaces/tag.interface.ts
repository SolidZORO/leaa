import { FindOneOptions } from 'typeorm';
import { TagGetManyReq, TagGetOneReq } from '@leaa/common/src/dtos/tag';
import { Tag } from '@leaa/common/src/entrys';

export type ITagsArgs = TagGetManyReq & FindOneOptions<Tag>;
export type ITagArgs = TagGetOneReq & FindOneOptions<Tag>;
