import { Injectable } from '@nestjs/common';

import { ConfigService } from '@leaa/api/src/modules/config/config.service';
import { DemoDataObject, SignupAccount } from '@leaa/common/src/dtos/demo';
import { usersSeed } from '@leaa/api/src/modules/seed/seed.data';
import { stringUtil } from '@leaa/api/src/utils';

const CLS_NAME = 'DemoService';

@Injectable()
export class DemoService {
  constructor(private readonly configService: ConfigService) {}

  async demoData(): Promise<DemoDataObject | undefined> {
    if (!this.configService.DEMO_MODE) return {};

    const loginAccountByAdmin = usersSeed.find((u) => u.email === 'admin@local.com');
    const loginAccountByStaff = usersSeed.find((u) => u.email === 'staff@local.com');

    const n = new Date().valueOf();
    const signupAccountByRandom: SignupAccount = {
      name: `demo-${n}`,
      email: `demo-${n}@local.com`,
      password: stringUtil.md5(stringUtil.random()),
    };

    return {
      loginAccountByAdmin,
      loginAccountByStaff,
      signupAccountByRandom,
    };
  }
}
