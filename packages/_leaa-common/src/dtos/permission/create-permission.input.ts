import { IsNotEmpty } from 'class-validator';

export class CreatePermissionInput {
  @IsNotEmpty()
  name!: string;

  @IsNotEmpty()
  slug!: string;
}
