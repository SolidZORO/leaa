# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.4.0](https://github.com/SolidZORO/leaa/compare/v3.3.5...v3.4.0) (2020-06-13)

### Bug Fixes

- recover `getSlug` to `genSlug` ([a3ffb93](https://github.com/SolidZORO/leaa/commit/a3ffb931e2839c5d83cdc1970aa9fe3ab58f6f7d))

### Features

- `ecosystem.config.js.example` pull to api root dir ([b83fed1](https://github.com/SolidZORO/leaa/commit/b83fed1c964169c3808659bd446f539211ef5c49))
- auto push to DeployRepo and Server and RUN! ([a7a91ac](https://github.com/SolidZORO/leaa/commit/a7a91ac2731a989878bb39bde3fe98659540e3a7))

### Performance Improvements

- auto deploy workflow ([eb0bf5a](https://github.com/SolidZORO/leaa/commit/eb0bf5a250faa552fc05b105a8004d4af747b4df))

## [3.3.4](https://github.com/SolidZORO/leaa/compare/v3.3.3...v3.3.4) (2020-06-11)

**Note:** Version bump only for package @leaa/api

## [3.3.2](https://github.com/SolidZORO/leaa/compare/v3.3.3...v3.3.2) (2020-06-11)

## [3.3.2](https://github.com/SolidZORO/leaa/compare/v3.1.1...v3.3.2) (2020-06-11)

### Bug Fixes

- deploy docker_test fn ([c501324](https://github.com/SolidZORO/leaa/commit/c501324279a19c6d014666f9a960089f23885e5d))
- fix test load .env path ([c084508](https://github.com/SolidZORO/leaa/commit/c084508e7d6b5b6c1960ee87960a58fab8736c21))
- fix the `cache-manager` package is missing ([3e8c4b7](https://github.com/SolidZORO/leaa/commit/3e8c4b7e4b5aba4a33412b604bd5d3065fa208d2))
- update user and update avatar at the same time ([298ccfa](https://github.com/SolidZORO/leaa/commit/298ccfa0917ee2968666ce637b743fd166adb8a7))

### Code Refactoring

- 💡 .env change to production default env file ([dcca7d0](https://github.com/SolidZORO/leaa/commit/dcca7d0e2fbe55c0cd5775d9d76deaf6ce4d7d32))

### Features

- .env add `ENABLE_CAPTCHA_BY_LOGIN_FAILD_TIMES` ([5925c5a](https://github.com/SolidZORO/leaa/commit/5925c5a83f5546272340a2742cf065dde1f6c8e6))
- .env add `SERVER_NAME` ([bc3965d](https://github.com/SolidZORO/leaa/commit/bc3965db35d4e7f81187ae8e5f0043be158ef07f))
- .env add GRAVATAR_TYPE ([dcb3ba1](https://github.com/SolidZORO/leaa/commit/dcb3ba1b959ad9702e5656255b7daebbd59c8e0a))
- add deploy bash script ([d3914d1](https://github.com/SolidZORO/leaa/commit/d3914d19f4c05932cb3abda3bdc3c483c6d0f0fb))
- add use phone login dashboard ([4824440](https://github.com/SolidZORO/leaa/commit/482444069b3ea99e395ce50db09f52de526fc0c7))
- can create user by phone ([77237f9](https://github.com/SolidZORO/leaa/commit/77237f9b615fbeaba1adc097635bb83f71ddbaa7))
- user add avatar change ([c317528](https://github.com/SolidZORO/leaa/commit/c317528eabcb7e21dd280c5a2ebdf2afbb3a06a7))

### BREAKING CHANGES

- 🧨 .env change to production default env file, keep docker .env compatible,
  and follow dotenv recommended @link
  https://github.com/motdotla/dotenv#should-i-have-multiple-env-files

## [3.1.1](https://github.com/SolidZORO/leaa/compare/v3.1.0...v3.1.1) (2020-06-01)

### Features

- add verification code(captcha) to login ([41a0b9c](https://github.com/SolidZORO/leaa/commit/41a0b9cbd7e2398caebba0137050e875c609ab76))
- cLI show local real ip address ([33ca1e2](https://github.com/SolidZORO/leaa/commit/33ca1e262098e8051db2d55151504b1629aa1563))
- delete atta will delete relation atta files ([359ab99](https://github.com/SolidZORO/leaa/commit/359ab99ef8d630256558d3e50800ae888a1c586a))
- remote delete aliyun oss files ([72b4bc1](https://github.com/SolidZORO/leaa/commit/72b4bc1ec71b9dba141e9ebf7834091d053383dd))
- svgCaptcha load a new font ([fe89fee](https://github.com/SolidZORO/leaa/commit/fe89fee51cb29f9d8da2fa94683a9453a4cfe027))
- upload atta to ali-oss ([40d6636](https://github.com/SolidZORO/leaa/commit/40d6636a405dc7bc5d942b9179cc71fe67b8719b))

### Performance Improvements

- mUST_VERIFICATION_CAPTCHA_BY_LOGIN_ERROR 3 -> 5 ([f39ec55](https://github.com/SolidZORO/leaa/commit/f39ec55691914dedb0305634c451dd14a329fac8))

## [3.0.1](https://github.com/SolidZORO/leaa/compare/v2.0.6...v3.0.1) (2020-05-29)

### Bug Fixes

- all `curd` rename to `crud` ([1f47746](https://github.com/SolidZORO/leaa/commit/1f477463a05b45e9fb6c81c805fb8c746db9440f))
- fix validateUserByPayload last_token_at Compare jwt `iattz` ([9c18c02](https://github.com/SolidZORO/leaa/commit/9c18c02c56cec75deed10fac2637449c8b030926))
- update login logic, not token will set 'NO-TOKEN' ([f32e216](https://github.com/SolidZORO/leaa/commit/f32e216ded0a5d48d2917202e308d117507d4675))

### Features

- add genCrudQuerySearch ([9558c72](https://github.com/SolidZORO/leaa/commit/9558c72641560e4a89d89b9476ec4bd0dfc96b80))
- add new data seed ([434b6a8](https://github.com/SolidZORO/leaa/commit/434b6a8dc7f3ed37de3da0815e4d9cfded9a4ff5))
- add TransformInterceptor and HttpExceptionFilter ([4866653](https://github.com/SolidZORO/leaa/commit/48666532d497bc4f497fe9bf9d9be32278244efa))
- attachmentBox can work! ([99c247a](https://github.com/SolidZORO/leaa/commit/99c247a740ed50964f85f0c00c9484bd477ab7d1))
- auth login add Captcha (not display by default, auto tigger) ([a068b54](https://github.com/SolidZORO/leaa/commit/a068b543e81c65b235cb85a8430d4ca27285219f))
- category crud ([adbf2c4](https://github.com/SolidZORO/leaa/commit/adbf2c499c94c90d521814e576c429d50cf5ca32))
- done all user method ([aec4913](https://github.com/SolidZORO/leaa/commit/aec4913aeffd3cf0b6711e6d98a626f2f477d0c1))
- new FilterIcon and new SearchInput ([0f37f45](https://github.com/SolidZORO/leaa/commit/0f37f45c61717decf97c5b77c245243e7a0a614c))
- replace react-dnd to react-beautiful-dnd ([a851781](https://github.com/SolidZORO/leaa/commit/a85178189d0f2ad1075ec4a148eb4d5a3ede9c93))
- setting crud ([800f107](https://github.com/SolidZORO/leaa/commit/800f10718d89b0dc1239bf014949a3676806056e))

### Performance Improvements

- babel useBuiltIns: 'usage' replace @babel/polyfill ([ee25c09](https://github.com/SolidZORO/leaa/commit/ee25c092152ddddf917ca5dff8c031e6006bf4a3))
- format code ([e8502d3](https://github.com/SolidZORO/leaa/commit/e8502d3c9455b685e47ac18e39769f4d5e588724))
- improves validateUserByPayload logic ([6208557](https://github.com/SolidZORO/leaa/commit/6208557b4fc91ca73c0c77b05775756eb7d400a9))
- more files code style to `named export` ([1006863](https://github.com/SolidZORO/leaa/commit/10068635531f842b543e9519381a266c309f7918))

## [2.0.6](https://github.com/SolidZORO/leaa/compare/v1.1.0...v2.0.6) (2020-05-05)

### Bug Fixes

- divisions gen ([787ed42](https://github.com/SolidZORO/leaa/commit/787ed42eec16776702f3bdde9d4aef425e378cf3))
- just a git-cz test ([44168f3](https://github.com/SolidZORO/leaa/commit/44168f3cacb4afccaabfff41397d751a73e64c1f))
- seed data ([0d6e6e8](https://github.com/SolidZORO/leaa/commit/0d6e6e84807ccd7d94b4a0882379325dfaf3fd87))

# [1.1.0](https://github.com/SolidZORO/leaa/compare/v1.0.5...v1.1.0) (2020-03-22)

## [1.0.5](https://github.com/SolidZORO/leaa/compare/v1.0.4...v1.0.5) (2020-02-21)

## [1.0.4](https://github.com/SolidZORO/leaa/compare/v1.0.3...v1.0.4) (2020-01-15)

## [1.0.3](https://github.com/SolidZORO/leaa/compare/v1.0.2...v1.0.3) (2020-01-02)

## [1.0.2](https://github.com/SolidZORO/leaa/compare/v1.0.1...v1.0.2) (2019-11-23)

## [1.0.1](https://github.com/SolidZORO/leaa/compare/v0.0.4...v1.0.1) (2019-11-23)

## [0.0.4](https://github.com/SolidZORO/leaa/compare/v0.0.1...v0.0.4) (2019-10-28)

## [0.0.1](https://github.com/SolidZORO/leaa/compare/v0.0.2...v0.0.1) (2019-08-17)
