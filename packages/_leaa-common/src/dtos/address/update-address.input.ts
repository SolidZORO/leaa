import { IsOptional } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class UpdateAddressInput {
  @IsOptional()
  @Field(() => String, { nullable: true })
  address?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  province?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  city?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  area?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  consignee?: string;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  zip?: number;

  @IsOptional()
  @Field(() => String, { nullable: true })
  phone?: string;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  status?: number;
}
