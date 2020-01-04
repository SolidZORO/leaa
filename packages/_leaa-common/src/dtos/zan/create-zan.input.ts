import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class CreateZanInput {
  @IsNotEmpty()
  @Field(() => String)
  title!: string;

  @IsNotEmpty()
  @Field(() => String)
  uuid!: string;

  @IsNotEmpty()
  @Field(() => Int)
  status!: number;

  @IsOptional()
  @Field(() => String, { nullable: true })
  description?: string;
}
