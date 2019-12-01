import { UseGuards } from '@nestjs/common';
import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';
import { Int } from 'type-graphql';

import { Tag, User } from '@leaa/common/src/entrys';
import {
  TagsArgs,
  TagsWithPaginationObject,
  TagArgs,
  CreateTagInput,
  UpdateTagInput,
  SyncTagsToFileObject,
} from '@leaa/common/src/dtos/tag';
import { TagService } from '@leaa/api/src/modules/tag/tag.service';
import { PermissionsGuard } from '@leaa/api/src/guards';
import { Permissions, CurrentUser } from '@leaa/api/src/decorators';

@Resolver(() => Tag)
export class TagResolver {
  constructor(private readonly tagService: TagService) {}

  @UseGuards(PermissionsGuard)
  @Permissions('tag.list-read')
  @Query(() => TagsWithPaginationObject)
  async tags(@Args() args: TagsArgs): Promise<TagsWithPaginationObject | undefined> {
    return this.tagService.tags(args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('tag.item-read')
  @Query(() => Tag)
  async tag(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args() args?: TagArgs,
    @CurrentUser() user?: User,
  ): Promise<Tag | undefined> {
    return this.tagService.tag(id, args, user);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('tag.item-read')
  @Query(() => Tag)
  async tagByName(
    @Args({ name: 'name', type: () => String }) name: string,
    @Args() args?: TagArgs,
  ): Promise<Tag | undefined> {
    return this.tagService.tagByName(name, args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('tag.item-create')
  @Mutation(() => Tag)
  async createTag(@Args('tag') args: CreateTagInput): Promise<Tag | undefined> {
    return this.tagService.createTag(args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('tag.item-create')
  @Mutation(() => Tag)
  async createTags(
    @Args({ name: 'tagNames', type: () => [String] }) tagNames: string[],
    @CurrentUser() user?: User,
  ): Promise<Tag[] | undefined> {
    return this.tagService.createTags(tagNames, user);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('tag.item-update')
  @Mutation(() => SyncTagsToFileObject)
  async syncTagsToDictFile(): Promise<SyncTagsToFileObject> {
    return this.tagService.syncTagsToDictFile();
  }

  @UseGuards(PermissionsGuard)
  @Permissions('tag.item-update')
  @Mutation(() => Tag)
  async updateTag(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('tag') args: UpdateTagInput,
  ): Promise<Tag | undefined> {
    return this.tagService.updateTag(id, args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('tag.item-delete')
  @Mutation(() => Tag)
  async deleteTag(@Args({ name: 'id', type: () => Int }) id: number): Promise<Tag | undefined> {
    return this.tagService.deleteTag(id);
  }
}
