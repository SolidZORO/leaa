import { Args, Query, Mutation, Resolver, ResolveProperty, Parent } from '@nestjs/graphql';

import { Attachment, User } from '@leaa/common/entrys';
import {
  AttachmentsArgs,
  AttachmentsWithPaginationObject,
  AttachmentArgs,
  UpdateAttachmentInput,
  UpdateAttachmentsInput,
  DeleteAttachmentsObject,
  AttachmentsObject,
} from '@leaa/common/dtos/attachment';
import { AttachmentService } from '@leaa/api/modules/attachment/attachment.service';
import { AttachmentProperty } from '@leaa/api/modules/attachment/attachment.property';
import { UserDecorator } from '@leaa/api/decorators';

@Resolver(() => Attachment)
export class AttachmentResolver {
  constructor(
    private readonly attachmentService: AttachmentService,
    private readonly attachmentProperty: AttachmentProperty,
  ) {}

  @ResolveProperty(() => String, { nullable: true })
  url(@Parent() attachment: Attachment): string | null {
    return this.attachmentProperty.resolvePropertyUrl(attachment);
  }

  @ResolveProperty(() => String, { nullable: true })
  urlAt2x(@Parent() attachment: Attachment): string | null {
    return this.attachmentProperty.resolvePropertyUrlAt2x(attachment);
  }

  //
  //

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
