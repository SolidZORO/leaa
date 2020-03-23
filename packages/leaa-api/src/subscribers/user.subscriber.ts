import crypto from 'crypto';
import { EventSubscriber, EntitySubscriberInterface, InsertEvent } from 'typeorm';

import { User } from '@leaa/common/src/entrys';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo(): typeof User {
    return User;
  }

  async afterInsert(event: InsertEvent<User>): Promise<void> {
    const { entity } = event;

    if (entity && entity.avatar_url === null) {
      const emailHash = crypto.createHash('md5').update(entity.email).digest('hex');

      const avatarParams = 's=160&d=monsterid';
      const avatarUrl = `//secure.gravatar.com/avatar/${emailHash}?${avatarParams}`;

      event.manager.getRepository(User).update(entity.id, { avatar_url: avatarUrl });
    }
  }
}
