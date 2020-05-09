import { Args, Query, Mutation, Resolver, ResolveField, Parent } from '@nestjs/graphql';

import { Attachment } from '@leaa/common/src/entrys';
import { IGqlCtx } from '@leaa/api/src/interfaces';
import {
  AttachmentsArgs,
  AttachmentsWithPaginationObject,
  AttachmentArgs,
  UpdateAttachmentInput,
  UpdateAttachmentsInput,
  DeleteAttachmentsObject,
  AttachmentsObject,
} from '@leaa/common/src/dtos/attachment';
import { AttachmentService } from '@leaa/api/src/modules/attachment/attachment.service';
import { AttachmentProperty } from '@leaa/api/src/modules/attachment/attachment.property';
import { GqlCtx } from '@leaa/api/src/decorators';

@Resolver(() => Attachment)
export class AttachmentResolver {
  constructor(
    private readonly attachmentService: AttachmentService,
    private readonly attachmentProperty: AttachmentProperty,
  ) {}

  @ResolveField(() => String, { nullable: true })
  url(@Parent() attachment: Attachment): string | null {
    return this.attachmentProperty.url(attachment);
  }

  @ResolveField(() => String, { nullable: true })
  urlAt2x(@Parent() attachment: Attachment): string | null {
    return this.attachmentProperty.urlAt2x(attachment);
  }

  //
  //

  @Query(() => AttachmentsWithPaginationObject)
  async attachments(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args() args: AttachmentsArgs,
  ): Promise<AttachmentsWithPaginationObject | undefined> {
    return this.attachmentService.attachments(gqlCtx, args);
  }

  @Query(() => Attachment)
  async attachment(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'uuid', type: () => String }) uuid: string,
    @Args() args?: AttachmentArgs,
  ): Promise<Attachment | undefined> {
    return this.attachmentService.attachment(gqlCtx, uuid, args);
  }

  @Mutation(() => Attachment)
  async updateAttachment(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'uuid', type: () => String }) uuid: string,
    @Args('attachment') args: UpdateAttachmentInput,
  ): Promise<Attachment | undefined> {
    return this.attachmentService.updateAttachment(gqlCtx, uuid, args);
  }

  @Mutation(() => AttachmentsObject)
  async updateAttachments(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'attachments', type: () => [UpdateAttachmentsInput] }) attachments: UpdateAttachmentsInput[],
  ): Promise<AttachmentsObject> {
    return this.attachmentService.updateAttachments(gqlCtx, attachments);
  }

  @Mutation(() => DeleteAttachmentsObject)
  async deleteAttachments(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'uuid', type: () => [String] }) uuid: string[],
  ): Promise<DeleteAttachmentsObject | undefined> {
    return this.attachmentService.deleteAttachments(gqlCtx, uuid);
  }
}
