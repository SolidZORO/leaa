import { IsNotEmpty } from 'class-validator';

export declare type SettingUpdateOne = {
  id: string;
  value?: string;
};

export class SettingUpdateManyReq {
  @IsNotEmpty()
  settings!: {
    id: string;
    value?: string;
  }[];

  // id!: string;
  //
  // @IsNotEmpty()
  // value!: string;
}
