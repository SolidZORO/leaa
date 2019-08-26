import { IsOptional } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class CreateOauthInput {
  @Field(() => String)
  public open_id!: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  public union_id?: string;

  @Field(() => String)
  public app_id!: string;

  @IsOptional()
  @Field(() => Int)
  public user_id?: number;

  @Field(() => String)
  public platform!: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  public ticket?: string;

  @IsOptional()
  @Field(() => Date, { nullable: true })
  public ticket_at?: Date;

  @IsOptional()
  @Field(() => String, { nullable: true })
  public access_token?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  public refresh_token?: string;

  @Field(() => String)
  public nickname!: string;

  @Field(() => Int)
  public sex!: number;

  @Field(() => String)
  public city!: string;

  @Field(() => String)
  public province!: string;

  @Field(() => String)
  public country!: string;

  @Field(() => String)
  public avatar_url!: string;

  @IsOptional()
  @Field(() => Date, { nullable: true })
  public last_oauth_at?: Date;
}
