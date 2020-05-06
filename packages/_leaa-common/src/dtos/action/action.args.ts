import { ArgsType } from '@nestjs/graphql';

import { ItemArgs } from '@leaa/common/src/dtos/_common';

@ArgsType()
export class ActionArgs extends ItemArgs {}
