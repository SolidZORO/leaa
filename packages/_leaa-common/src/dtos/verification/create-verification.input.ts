import { IsNotEmpty, Length } from 'class-validator';

export class CreateVerificationInput {
  @Length(12)
  @IsNotEmpty()
  guthorization!: string;
}
