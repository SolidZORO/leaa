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
    @Args() args: AttachmentsArgs,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<AttachmentsWithPaginationObject | undefined> {
    return this.attachmentService.attachments(args, gqlCtx);
  }

  @Query(() => Attachment)
  async attachment(
    @Args({ name: 'uuid', type: () => String }) uuid: string,
    @Args() args?: AttachmentArgs,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<Attachment | undefined> {
    return this.attachmentService.attachment(uuid, args, gqlCtx);
  }

  @Mutation(() => Attachment)
  async updateAttachment(
    @Args({ name: 'uuid', type: () => String }) uuid: string,
    @Args('attachment') args: UpdateAttachmentInput,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<Attachment | undefined> {
    return this.attachmentService.updateAttachment(uuid, args, gqlCtx);
  }

  @Mutation(() => AttachmentsObject)
  async updateAttachments(
    @Args({ name: 'attachments', type: () => [UpdateAttachmentsInput] }) attachments: UpdateAttachmentsInput[],
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<AttachmentsObject> {
    return this.attachmentService.updateAttachments(attachments, gqlCtx);
  }

  @Mutation(() => DeleteAttachmentsObject)
  async deleteAttachments(
    @Args({ name: 'uuid', type: () => [String] }) uuid: string[],
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<DeleteAttachmentsObject | undefined> {
    return this.attachmentService.deleteAttachments(uuid, gqlCtx);
  }
}
