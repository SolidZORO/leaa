// eslint-disable-next-line max-classes-per-file

export class LoginAccount {
  email!: string;

  password!: string;
}

export class SignupAccount extends LoginAccount {
  name!: string;
}

export class DemoDataObject {
  readonly loginAccountByAdmin?: LoginAccount;

  readonly loginAccountByStaff?: LoginAccount;

  readonly signupAccountByRandom?: SignupAccount;
}
