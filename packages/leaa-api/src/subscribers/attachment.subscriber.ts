import { EventSubscriber, EntitySubscriberInterface } from 'typeorm';

import { Attachment } from '@leaa/common/src/entrys';

@EventSubscriber()
export class AttachmentSubscriber implements EntitySubscriberInterface<Attachment> {}
