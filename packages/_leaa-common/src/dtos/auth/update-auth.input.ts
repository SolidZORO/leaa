import { IsOptional } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class UpdateAuthInput {
  @IsOptional()
  @Field(() => String, { nullable: true })
  union_id?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  ticket?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  access_token?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  refresh_token?: string;

  @IsOptional()
  @Field(() => Date, { nullable: true })
  last_auth_at?: Date;

  @IsOptional()
  @Field(() => Date, { nullable: true })
  ticket_at?: Date;
}
