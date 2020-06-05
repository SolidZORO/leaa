import { IsNotEmpty } from 'class-validator';

export class RoleCreateOneReq {
  @IsNotEmpty()
  name!: string;

  @IsNotEmpty()
  slug!: string;
}
