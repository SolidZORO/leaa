import { EventSubscriber, EntitySubscriberInterface, InsertEvent, RemoveEvent } from 'typeorm';

import { Attachment, User } from '@leaa/common/src/entrys';

@EventSubscriber()
export class AttachmentSubscriber implements EntitySubscriberInterface<Attachment> {
  listenTo(): typeof Attachment {
    return Attachment;
  }

  async afterInsert(event: InsertEvent<Attachment>): Promise<void> {
    const { entity } = event;

    if (entity && entity.module_name === 'user' && entity.type_name === 'avatar' && entity.module_id) {
      event.manager.getRepository(User).update(entity.module_id, {
        avatar_string: JSON.stringify({
          in_local: event.entity.in_local,
          in_oss: event.entity.in_oss,
          size: event.entity.size,
          path: event.entity.path,
          width: event.entity.width,
          height: event.entity.height,
        }),
      });
    }
  }

  async afterRemove(event: RemoveEvent<Attachment>): Promise<void> {
    const { entity } = event;

    if (entity && entity.module_name === 'user' && entity.type_name === 'avatar' && entity.module_id) {
      event.manager.getRepository(User).update(entity.module_id, { avatar_string: '' });
    }
  }
}
