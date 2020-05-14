import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';

import { Tag } from '@leaa/common/src/entrys';
import {
  TagsArgs,
  TagsWithPaginationObject,
  TagArgs,
  CreateTagInput,
  UpdateTagInput,
  SyncTagsToFileObject,
} from '@leaa/common/src/dtos/tag';
import { TagService } from '@leaa/api/src/modules/tag/tag.service';

import { Permissions, GqlCtx } from '@leaa/api/src/decorators';
import { IGqlCtx } from '@leaa/api/src/interfaces';

@Resolver(() => Tag)
export class TagResolver {
  constructor(private readonly tagService: TagService) {}

  //
  // @Permissions('tag.list-read')
  // DO NOT CHECK PERMISSIONS
  @Query(() => TagsWithPaginationObject)
  async tags(@GqlCtx() @Args() args: TagsArgs): Promise<TagsWithPaginationObject | undefined> {
    return this.tagService.tags(gqlCtx, args);
  }

  //
  // @Permissions('tag.item-read')
  // DO NOT CHECK PERMISSIONS
  @Query(() => Tag)
  async tag(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'id', type: () => String }) id: string,
    @Args() args?: TagArgs,
  ): Promise<Tag | undefined> {
    return this.tagService.tag(gqlCtx, id, args);
  }

  @Permissions('tag.item-read')
  @Query(() => Tag)
  async tagByName(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'name', type: () => String }) name: string,
    @Args() args?: TagArgs,
  ): Promise<Tag | undefined> {
    return this.tagService.tagByName(gqlCtx, name, args);
  }

  @Permissions('tag.item-create')
  @Mutation(() => Tag)
  async createTag(@GqlCtx() @Args('tag') args: CreateTagInput): Promise<Tag | undefined> {
    return this.tagService.createTag(gqlCtx, args);
  }

  @Permissions('tag.item-create')
  @Mutation(() => Tag)
  async createTags(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'tagNames', type: () => [String] }) tagNames: string[],
  ): Promise<Tag[] | undefined> {
    return this.tagService.createTags(gqlCtx, tagNames);
  }

  @Permissions('tag.item-update')
  @Mutation(() => SyncTagsToFileObject)
  async syncTagsToDictFile(): Promise<SyncTagsToFileObject> {
    return this.tagService.syncTagsToDictFile();
  }

  @Permissions('tag.item-update')
  @Mutation(() => Tag)
  async updateTag(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'id', type: () => String }) id: string,
    @Args('tag') args: UpdateTagInput,
  ): Promise<Tag | undefined> {
    return this.tagService.updateTag(gqlCtx, id, args);
  }

  @Permissions('tag.item-delete')
  @Mutation(() => Tag)
  async deleteTag(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'id', type: () => String }) id: string,
  ): Promise<Tag | undefined> {
    return this.tagService.deleteTag(gqlCtx, id);
  }
}
