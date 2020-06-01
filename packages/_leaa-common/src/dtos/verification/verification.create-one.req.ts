import { IsNotEmpty, Length } from 'class-validator';

export class VerificationCreateOneReq {
  @IsNotEmpty({ each: true })
  @Length(10)
  guthorization!: string;
}
