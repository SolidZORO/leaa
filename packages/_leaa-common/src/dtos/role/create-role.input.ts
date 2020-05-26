import { IsNotEmpty } from 'class-validator';

export class CreateRoleInput {
  @IsNotEmpty()
  name!: string;

  @IsNotEmpty()
  slug!: string;
}
