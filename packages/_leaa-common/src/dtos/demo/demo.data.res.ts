// eslint-disable-next-line max-classes-per-file
export class LoginAccount {
  account!: string;
  password!: string;
}

export class SignupAccount extends LoginAccount {
  name!: string;
}

export class DemoDataRes {
  readonly loginAccountByAdmin?: LoginAccount;
  readonly loginAccountByStaff?: LoginAccount;
  readonly signupAccountByRandom?: SignupAccount;
}
