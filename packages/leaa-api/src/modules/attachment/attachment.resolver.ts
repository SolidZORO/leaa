import { Args, Query, Mutation, Resolver, ResolveProperty, Parent } from '@nestjs/graphql';

import { Attachment, Ax, User } from '@leaa/common/entrys';
import {
  AttachmentsArgs,
  AttachmentsWithPaginationObject,
  AttachmentArgs,
  UpdateAttachmentInput,
  UpdateAttachmentsInput,
  DeleteAttachmentsObject,
  AttachmentsObject,
} from '@leaa/common/dtos/attachment';
import { AttachmentService } from './attachment.service';
import { UserDecorator } from '@leaa/api/decorators';

@Resolver(() => Attachment)
export class AttachmentResolver {
  constructor(private readonly attachmentService: AttachmentService) {}

  @ResolveProperty(() => String, { nullable: true })
  pathAt2x(@Parent() attachment: Attachment): string | null {
    return this.attachmentService.pathAt2x(attachment);
  }

  @Query(() => AttachmentsWithPaginationObject)
  async attachments(
    @Args() args: AttachmentsArgs,
    @UserDecorator() user?: User,
  ): Promise<AttachmentsWithPaginationObject | undefined> {
    return this.attachmentService.attachments(args, user);
  }

  @Query(() => Attachment)
  async attachment(
    @Args({ name: 'uuid', type: () => String }) uuid: string,
    @Args() args?: AttachmentArgs,
    @UserDecorator() user?: User,
  ): Promise<Attachment | undefined> {
    return this.attachmentService.attachment(uuid, args, user);
  }

  @Mutation(() => Attachment)
  async updateAttachment(
    @Args({ name: 'uuid', type: () => String }) uuid: string,
    @Args('attachment') args: UpdateAttachmentInput,
  ): Promise<Attachment | undefined> {
    return this.attachmentService.updateAttachment(uuid, args);
  }

  @Mutation(() => AttachmentsObject)
  async updateAttachments(
    @Args({ name: 'attachments', type: () => [UpdateAttachmentsInput] }) attachments: UpdateAttachmentsInput[],
  ): Promise<AttachmentsObject> {
    return this.attachmentService.updateAttachments(attachments);
  }

  @Mutation(() => DeleteAttachmentsObject)
  async deleteAttachments(
    @Args({ name: 'uuid', type: () => [String] }) uuid: string[],
  ): Promise<DeleteAttachmentsObject | undefined> {
    return this.attachmentService.deleteAttachments(uuid);
  }
}
