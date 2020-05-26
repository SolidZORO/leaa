export class CreateAttachmentInput {
  id!: string;

  title!: string;

  alt!: string;

  type!: string;

  filename!: string;

  //
  // description?: string;

  //
  // link?: string;

  moduleName!: string;

  moduleId!: string;

  typeName!: string;

  typePlatform?: string;

  ext!: string;

  width!: number;

  height!: number;

  size!: number;

  path!: string;

  external_url?: string;

  at2x!: number;

  in_local!: number;

  in_oss!: number;

  categoryId?: string | null;

  userId?: string | null;

  sort!: number;

  status!: number;
}
