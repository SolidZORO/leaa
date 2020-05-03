import { IsOptional } from 'class-validator';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateAuthInput {
  @Field(() => String)
  open_id!: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  union_id?: string;

  @Field(() => String)
  app_id!: string;

  @IsOptional()
  @Field(() => String)
  user_id?: string;

  @Field(() => String)
  platform!: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  ticket?: string;

  @IsOptional()
  @Field(() => Date, { nullable: true })
  ticket_at?: Date;

  @IsOptional()
  @Field(() => String, { nullable: true })
  access_token?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  refresh_token?: string;

  @Field(() => String)
  nickname!: string;

  @Field(() => Int)
  sex!: number;

  @Field(() => String)
  city!: string;

  @Field(() => String)
  province!: string;

  @Field(() => String)
  country!: string;

  @Field(() => String)
  avatar_url!: string;

  @IsOptional()
  @Field(() => Date, { nullable: true })
  last_auth_at?: Date;
}
