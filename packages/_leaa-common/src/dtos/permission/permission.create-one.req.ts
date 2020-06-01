import { IsNotEmpty } from 'class-validator';

export class PermissionCreateOneReq {
  @IsNotEmpty()
  name!: string;

  @IsNotEmpty()
  slug!: string;
}
