// eslint-disable-next-line max-classes-per-file
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class LoginAccount {
  @Field(() => String)
  email!: string;

  @Field(() => String)
  password!: string;
}

@ObjectType()
export class SignupAccount extends LoginAccount {
  @Field(() => String)
  name!: string;
}

@ObjectType()
export class DemoDataObject {
  @Field(() => LoginAccount, { nullable: true })
  readonly loginAccountByAdmin?: LoginAccount;

  @Field(() => LoginAccount, { nullable: true })
  readonly loginAccountByStaff?: LoginAccount;

  @Field(() => SignupAccount, { nullable: true })
  readonly signupAccountByRandom?: SignupAccount;
}
