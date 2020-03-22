import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateAddressInput {
  @IsNotEmpty()
  @Field(() => String)
  address!: string;

  @IsNotEmpty()
  @Field(() => String)
  province!: string;

  @IsNotEmpty()
  @Field(() => String)
  city!: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  area?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  consignee!: string;

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
