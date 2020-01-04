// import { EventSubscriber, EntitySubscriberInterface, InsertEvent, UpdateEvent, UpdateDateColumn } from 'typeorm';
import { EventSubscriber, EntitySubscriberInterface } from 'typeorm';
import { LoadEvent } from 'typeorm/subscriber/event/LoadEvent';
import { Tag } from '@leaa/common/src/entrys';

@EventSubscriber()
export class TagSubscriber implements EntitySubscriberInterface<Tag> {
  listenTo(): typeof Tag {
    return Tag;
  }

  async afterLoad(entity: Tag, event: LoadEvent<Tag>): Promise<void> {
    if (event.entity && typeof event.entity.views !== 'undefined') {
      event.manager.getRepository(Tag).update(event.entity.id, { views: event.entity.views + 1 });
    }
  }

  // async afterInsert(event: InsertEvent<any>): Promise<void> {
  //   if (event.entity && typeof event.entity.count !== 'undefined') {
  //     // event.manager.getRepository(Tag).update(event.entity.id, { count: event.entity.count + 1 });
  //   }
  // }

  // async afterUpdate(event: UpdateEvent<Tag>): Promise<void> {
  //   if (event.entity && typeof event.entity.count !== 'undefined') {
  //     // event.manager.getRepository(Tag).update(event.entity.id, { count: event.entity.count + 1 });
  //   }
  // }
}
