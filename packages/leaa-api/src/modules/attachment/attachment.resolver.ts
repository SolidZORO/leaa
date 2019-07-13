import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';

import { Attachment } from '@leaa/common/entrys';
import {
  AttachmentsArgs,
  AttachmentsObject,
  AttachmentArgs,
  UpdateAttachmentInput,
  DeleteAttachmentsObject,
} from '@leaa/common/dtos/attachment';
import { AttachmentService } from './attachment.service';

@Resolver(() => Attachment)
export class AttachmentResolver {
  constructor(private readonly attachmentService: AttachmentService) {}

  @Query(() => AttachmentsObject)
  async attachments(@Args() args: AttachmentsArgs): Promise<AttachmentsObject | undefined> {
    return this.attachmentService.attachments(args);
  }

  @Query(() => Attachment)
  async attachment(
    @Args({ name: 'uuid', type: () => String }) uuid: string,
    @Args() args?: AttachmentArgs,
  ): Promise<Attachment | undefined> {
    return this.attachmentService.attachment(uuid, args);
  }

  @Mutation(() => Attachment)
  async updateAttachment(
    @Args({ name: 'uuid', type: () => String }) uuid: string,
    @Args('attachment') args: UpdateAttachmentInput,
  ): Promise<Attachment | undefined> {
    return this.attachmentService.updateAttachment(uuid, args);
  }

  @Mutation(() => DeleteAttachmentsObject)
  async deleteAttachments(
    @Args({ name: 'uuid', type: () => [String] }) uuid: string[],
  ): Promise<DeleteAttachmentsObject | undefined> {
    return this.attachmentService.deleteAttachments(uuid);
  }
}
