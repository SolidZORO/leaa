import { IsNotEmpty, Length } from 'class-validator';

export class CreateVerificationInput {
  @IsNotEmpty({ each: true })
  @Length(10)
  guthorization!: string;
}
