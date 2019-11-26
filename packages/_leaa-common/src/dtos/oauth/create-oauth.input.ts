import { IsOptional } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class CreateOauthInput {
  @Field(() => String)
  open_id!: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  union_id?: string;

  @Field(() => String)
  app_id!: string;

  @IsOptional()
  @Field(() => Int)
  user_id?: number;

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
  last_oauth_at?: Date;
}
