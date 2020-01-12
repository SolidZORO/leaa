import { Query, Resolver } from '@nestjs/graphql';

import { DemoDataObject } from '@leaa/common/src/dtos/demo';
import { DemoService } from '@leaa/api/src/modules/demo/demo.service';

@Resolver()
export class DemoResolver {
  constructor(private readonly demoService: DemoService) {}

  @Query(() => DemoDataObject)
  async demoData(): Promise<DemoDataObject | undefined> {
    return this.demoService.demoData();
  }
}
