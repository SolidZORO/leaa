import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType, Int } from '@nestjs/graphql';

import { User } from '@leaa/common/src/entrys';

@InputType()
export class CreateZanInput {
  @IsNotEmpty()
  @Field(() => String)
  title!: string;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  status?: number;

  @IsOptional()
  @Field(() => String, { nullable: true })
  description?: string;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  target_zan_quantity?: number;

  @IsOptional()
  creator?: User;
}
