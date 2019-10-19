import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';
import { Int } from 'type-graphql';

import { Tag } from '@leaa/common/src/entrys';
import { TagsArgs, TagsWithPaginationObject, TagArgs, CreateTagInput, UpdateTagInput } from '@leaa/common/src/dtos/tag';
import { TagService } from '@leaa/api/src/modules/tag/tag.service';

@Resolver(() => Tag)
export class TagResolver {
  constructor(private readonly tagService: TagService) {}

  //
  //

  @Query(() => TagsWithPaginationObject)
  async tags(@Args() args: TagsArgs): Promise<TagsWithPaginationObject | undefined> {
    return this.tagService.tags(args);
  }

  @Query(() => Tag)
  async tag(@Args({ name: 'id', type: () => Int }) id: number, @Args() args?: TagArgs): Promise<Tag | undefined> {
    return this.tagService.tag(id, args);
  }

  @Mutation(() => Tag)
  async createTag(@Args('tag') args: CreateTagInput): Promise<Tag | undefined> {
    return this.tagService.createTag(args);
  }

  @Mutation(() => Tag)
  async updateTag(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('tag') args: UpdateTagInput,
  ): Promise<Tag | undefined> {
    return this.tagService.updateTag(id, args);
  }

  @Mutation(() => Tag)
  async deleteTag(@Args({ name: 'id', type: () => Int }) id: number): Promise<Tag | undefined> {
    return this.tagService.deleteTag(id);
  }
}
