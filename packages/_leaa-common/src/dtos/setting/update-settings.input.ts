import { IsNotEmpty } from 'class-validator';

export class UpdateSettingsInput {
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
