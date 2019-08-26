import { IsOptional } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class UpdateOauthInput {
  @IsOptional()
  @Field(() => String, { nullable: true })
  public union_id?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  public ticket?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  public access_token?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  public refresh_token?: string;

  @IsOptional()
  @Field(() => Date, { nullable: true })
  public last_oauth_at?: Date;

  @IsOptional()
  @Field(() => Date, { nullable: true })
  public ticket_at?: Date;
}
