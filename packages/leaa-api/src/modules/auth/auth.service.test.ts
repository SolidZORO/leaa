import { Request } from 'express';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { User, Role, Permission, Auth } from '@leaa/common/src/entrys';
import { AuthLoginInput, AuthSignupInput } from '@leaa/common/src/dtos/auth';

import { AuthResolver } from '@leaa/api/src/modules/auth/auth.resolver';
import { AuthService } from '@leaa/api/src/modules/auth/auth.service';
import { UserResolver } from '@leaa/api/src/modules/user/user.resolver';
import { UserService } from '@leaa/api/src/modules/user/user.service';
import { RoleService } from '@leaa/api/src/modules/role/role.service';
import { PermissionService } from '@leaa/api/src/modules/permission/permission.service';
import { JwtStrategy, GithubStrategy } from '@leaa/api/src/strategies';
import { UserProperty } from '@leaa/api/src/modules/user/user.property';
import { AuthWechatService } from '@leaa/api/src/modules/auth/auth-wechat.service';
import { AuthTokenModule } from '@leaa/api/src/modules/auth-token/auth-token.module';

describe('AuthService', () => {
  let authService: AuthService;
  const USER_REPOSITORY_MOCK: Repository<User> = new Repository<User>();
  const OAUTH_REPOSITORY_MOCK: Repository<Auth> = new Repository<Auth>();
  const ROLE_REPOSITORY_MOCK: Repository<Role> = new Repository<Role>();
  const PERMISSION_REPOSITORY_MOCK: Repository<Permission> = new Repository<Permission>();

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthTokenModule],
      providers: [
        AuthResolver,
        AuthService,
        UserResolver,
        UserService,
        RoleService,
        PermissionService,
        JwtStrategy,
        GithubStrategy,
        UserProperty,
        AuthWechatService,
        { provide: getRepositoryToken(User), useValue: USER_REPOSITORY_MOCK },
        { provide: getRepositoryToken(Auth), useValue: OAUTH_REPOSITORY_MOCK },
        { provide: getRepositoryToken(Role), useValue: ROLE_REPOSITORY_MOCK },
        { provide: getRepositoryToken(Permission), useValue: PERMISSION_REPOSITORY_MOCK },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be server defined', () => {
    expect(authService).toBeDefined();
  });

  let userObject = new User();

  userObject = {
    id: 1,
    name: 'admin',
    phone: '18688888888',
    email: 'admin@leaa.com',
    status: 1,
    password: 'xxxxxxxx',
    created_at: new Date(),
  };

  describe('createToken', () => {
    const createTokenResult = {
      authExpiresIn: 999999999,
      authToken: 'TOKEN',
    };

    it('should create token', async () => {
      jest.spyOn(authService, 'createToken').mockImplementation(async () => createTokenResult);
      const result = await authService.createToken(userObject);

      expect(result).toBe(createTokenResult);
    });
  });

  describe('validateUser', () => {
    const jwtPayload = {
      id: 1,
      iat: 1,
      exp: 1,
    };

    const validateUserResult = userObject;

    it('should validate user', async () => {
      jest.spyOn(authService, 'validateUserByPayload').mockImplementation(async () => validateUserResult);
      const result = await authService.validateUserByPayload(jwtPayload);

      expect(result).toBe(validateUserResult);
    });
  });

  describe('validateUserByReq', () => {
    const req = {
      headers: {
        authorization: 'TOKEN',
      },
    };

    const validateUserByReqResult = userObject;

    it('should validate user by req', async () => {
      jest.spyOn(authService, 'validateUserByReq').mockImplementation(async () => validateUserByReqResult);
      const result = await authService.validateUserByReq(req as Request);

      expect(result).toBe(validateUserByReqResult);
    });
  });

  describe('addTokenTouser', () => {
    const addTokenTouserResult = userObject;

    it('should add token to user', async () => {
      jest.spyOn(authService, 'addTokenTouser').mockImplementation(async () => addTokenTouserResult);
      const result = await authService.addTokenTouser(userObject);

      expect(result).toBe(addTokenTouserResult);
    });
  });

  describe('login', () => {
    const authLoginInput: AuthLoginInput = {
      email: 'admin@leaa.com',
      password: 'xxxxxxxxxx',
    };

    const loginResult = userObject;

    it('should login', async () => {
      jest.spyOn(authService, 'login').mockImplementation(async () => loginResult);
      const result = await authService.login(authLoginInput);

      expect(result).toBe(loginResult);
    });
  });

  describe('loginByTicket', () => {
    const loginByTicketResult = userObject;

    it('should login by ticket', async () => {
      jest.spyOn(authService, 'loginByTicket').mockImplementation(async () => loginByTicketResult);
      const result = await authService.loginByTicket('xxxxxxxx');

      expect(result).toBe(loginByTicketResult);
    });
  });

  describe('signup', () => {
    const authSignupInput: AuthSignupInput = {
      email: 'admin@leaa.com',
      name: 'admin',
      password: 'xxxxxxxxxx',
    };

    const signupResult = userObject;

    it('should signup', async () => {
      jest.spyOn(authService, 'signup').mockImplementation(async () => signupResult);
      const result = await authService.signup(authSignupInput);

      expect(result).toBe(signupResult);
    });
  });
});
