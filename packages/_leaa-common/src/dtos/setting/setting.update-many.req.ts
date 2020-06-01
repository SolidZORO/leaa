import { IsNotEmpty } from 'class-validator';

export class SettingUpdateManyReq {
  @IsNotEmpty()
  settings!: {
    id: string;
    value: string;
  }[];

  // id!: string;
  //
  // @IsNotEmpty()
  // value!: string;
}
