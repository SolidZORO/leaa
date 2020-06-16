# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.5.0](https://github.com/SolidZORO/leaa/compare/v3.4.1...v3.5.0) (2020-06-16)


### Bug Fixes

* append some files to pm2 'ignore_watch` fix loop reset ([2d52bad](https://github.com/SolidZORO/leaa/commit/2d52bad58744429ecf3eeaefbfaf120445eed7d7))
* change `.env.js` to `_env.js`, fix serverless not load ([7c35661](https://github.com/SolidZORO/leaa/commit/7c35661d051657cd90b50b7feca2e217e77a636b))
* LoginForm check env.DEMO_MODE inject account ([b59e64c](https://github.com/SolidZORO/leaa/commit/b59e64c48def40fa3a9ec0970edd5f2827698708))
* reset to `nodejieba`, because `@node-rs/jieba` have bug ([85d7003](https://github.com/SolidZORO/leaa/commit/85d700387305f2d073fa57bea3fd665fb57cc66f))


### Features

* api .env add `AUTO_CUT_TAGS` ([b8ca654](https://github.com/SolidZORO/leaa/commit/b8ca6540de38898097bc74ede8fcbd6e6e574d18))
* delete dotenv of dashboard use `.env.js` replace `.env` ([7cc0950](https://github.com/SolidZORO/leaa/commit/7cc0950930004ef9da852448155734f254f4f891))


### Performance Improvements

* update UX ([cb8867a](https://github.com/SolidZORO/leaa/commit/cb8867a60c125f6aacda13aaf7f4703fd075b035))


### BREAKING CHANGES

* change `.env.js` to `_env.js`, fix serverless not load
* delete dotenv of dashboard use `.env.js` replace `.env`





## [3.4.1](https://github.com/SolidZORO/leaa/compare/v3.4.0...v3.4.1) (2020-06-14)


### Performance Improvements

* api index UX ([95db263](https://github.com/SolidZORO/leaa/commit/95db2632967f0254889654217c1ce8f8eb753ba9))





# [3.4.0](https://github.com/SolidZORO/leaa/compare/v3.3.5...v3.4.0) (2020-06-13)

### Bug Fixes

- recover `getSlug` to `genSlug` ([a3ffb93](https://github.com/SolidZORO/leaa/commit/a3ffb931e2839c5d83cdc1970aa9fe3ab58f6f7d))

### Features

- `ecosystem.config.js.example` pull to api root dir ([b83fed1](https://github.com/SolidZORO/leaa/commit/b83fed1c964169c3808659bd446f539211ef5c49))
- auto push to DeployRepo and Server and RUN! ([a7a91ac](https://github.com/SolidZORO/leaa/commit/a7a91ac2731a989878bb39bde3fe98659540e3a7))

### Performance Improvements

- auto deploy workflow ([eb0bf5a](https://github.com/SolidZORO/leaa/commit/eb0bf5a250faa552fc05b105a8004d4af747b4df))

## [3.3.5](https://github.com/SolidZORO/leaa/compare/v3.3.4...v3.3.5) (2020-06-11)

### Bug Fixes

- clean ajax console.log ([be7ce89](https://github.com/SolidZORO/leaa/commit/be7ce8968a1120aeaae05c4efcc3b889dba09562))

## [3.3.4](https://github.com/SolidZORO/leaa/compare/v3.3.3...v3.3.4) (2020-06-11)

**Note:** Version bump only for package @leaa/root

# [3.1.0](https://github.com/SolidZORO/leaa/compare/v3.3.3...v3.1.0) (2020-06-11)

## [3.3.3](https://github.com/SolidZORO/leaa/compare/v3.3.2...v3.3.3) (2020-06-11)

### Bug Fixes

- ajax timeout to 10s ([b6f56ed](https://github.com/SolidZORO/leaa/commit/b6f56ed472e93e5deba0a59f76bfd8a15ddcacda))

## [3.3.2](https://github.com/SolidZORO/leaa/compare/v3.1.1...v3.3.2) (2020-06-11)

### Bug Fixes

- deploy docker_test fn ([c501324](https://github.com/SolidZORO/leaa/commit/c501324279a19c6d014666f9a960089f23885e5d))
- fix ajax finally memory leak ([6fdd9f6](https://github.com/SolidZORO/leaa/commit/6fdd9f662befe10d789b997b441cb2588e5e4704))
- fix all Components `memory leak in your application.` ([d55e741](https://github.com/SolidZORO/leaa/commit/d55e7417e2580996e1559f7c5a0afe79f2b27371))
- fix atta box missing attachmentParams ([ba160a2](https://github.com/SolidZORO/leaa/commit/ba160a291410c25454d9cb4ccf72777fb73deac2))
- fix rowKey types ([4a11331](https://github.com/SolidZORO/leaa/commit/4a11331c85ac0b55c68a40010b0608292dbf6f70))
- fix test load .env path ([c084508](https://github.com/SolidZORO/leaa/commit/c084508e7d6b5b6c1960ee87960a58fab8736c21))
- fix the `cache-manager` package is missing ([3e8c4b7](https://github.com/SolidZORO/leaa/commit/3e8c4b7e4b5aba4a33412b604bd5d3065fa208d2))
- selectCategoryIdByTree This is a no-op, memory leak ([2cdcff8](https://github.com/SolidZORO/leaa/commit/2cdcff8cf6678c606acfdbb69818323a19eb59e3))
- update user and update avatar at the same time ([298ccfa](https://github.com/SolidZORO/leaa/commit/298ccfa0917ee2968666ce637b743fd166adb8a7))

### Code Refactoring

- 💡 .env change to production default env file ([dcca7d0](https://github.com/SolidZORO/leaa/commit/dcca7d0e2fbe55c0cd5775d9d76deaf6ce4d7d32))

### Features

- .env add `ENABLE_CAPTCHA_BY_LOGIN_FAILD_TIMES` ([5925c5a](https://github.com/SolidZORO/leaa/commit/5925c5a83f5546272340a2742cf065dde1f6c8e6))
- .env add `LOGO_(BLACK|WHITE)_FILENAME` can mod default logo ([4978e30](https://github.com/SolidZORO/leaa/commit/4978e307508c348fabd7d00fdf399cd53eb5d2fc))
- .env add `SERVER_NAME` ([bc3965d](https://github.com/SolidZORO/leaa/commit/bc3965db35d4e7f81187ae8e5f0043be158ef07f))
- .env add GRAVATAR_TYPE ([dcb3ba1](https://github.com/SolidZORO/leaa/commit/dcb3ba1b959ad9702e5656255b7daebbd59c8e0a))
- <BuildInfo> add props showSwitchDebug ([3901a1d](https://github.com/SolidZORO/leaa/commit/3901a1d667fccb863fe21d30e8942683d69880c8))
- add deploy bash script ([d3914d1](https://github.com/SolidZORO/leaa/commit/d3914d19f4c05932cb3abda3bdc3c483c6d0f0fb))
- add use phone login dashboard ([4824440](https://github.com/SolidZORO/leaa/commit/482444069b3ea99e395ce50db09f52de526fc0c7))
- can create user by phone ([77237f9](https://github.com/SolidZORO/leaa/commit/77237f9b615fbeaba1adc097635bb83f71ddbaa7))
- dashboard add `debugMode` in header dropdown menu ([932d994](https://github.com/SolidZORO/leaa/commit/932d9946f09cb53e10a14de4d7c359cd81b8cf70))
- user add avatar change ([c317528](https://github.com/SolidZORO/leaa/commit/c317528eabcb7e21dd280c5a2ebdf2afbb3a06a7))

### Performance Improvements

- ajax timeout to 100s ([38aac42](https://github.com/SolidZORO/leaa/commit/38aac42cfbe4d8624aec58f3bb751d2823e6a541))
- debugCount 10 to 5 ([5614f84](https://github.com/SolidZORO/leaa/commit/5614f84159c74c02039ac75dfb1b27ffad364b30))

### BREAKING CHANGES

- 🧨 .env change to production default env file, keep docker .env compatible,
  and follow dotenv recommended @link
  https://github.com/motdotla/dotenv#should-i-have-multiple-env-files

## [3.1.1](https://github.com/SolidZORO/leaa/compare/v3.1.0...v3.1.1) (2020-06-01)

### Bug Fixes

- fix packages version ([14e1ffb](https://github.com/SolidZORO/leaa/commit/14e1ffb64de596c0f28075acd9d73d9099305000))

# [3.1.0](https://github.com/SolidZORO/leaa/compare/v3.0.1...v3.1.0) (2020-06-01)

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
- fix husky no effect ([b13f8d3](https://github.com/SolidZORO/leaa/commit/b13f8d349acb00f53d394afeebd5786d8f01b181))
- fix validateUserByPayload last_token_at Compare jwt `iattz` ([9c18c02](https://github.com/SolidZORO/leaa/commit/9c18c02c56cec75deed10fac2637449c8b030926))
- rimraf add to packages ([294834a](https://github.com/SolidZORO/leaa/commit/294834af917b9e7c9be3bc38dfccf214fb57efa6))
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

- .babelrc add ignore ([99040ad](https://github.com/SolidZORO/leaa/commit/99040adf66b67fa3ca409bb86acdab9f1458aaa3))
- babel useBuiltIns: 'usage' replace @babel/polyfill ([ee25c09](https://github.com/SolidZORO/leaa/commit/ee25c092152ddddf917ca5dff8c031e6006bf4a3))
- format code ([e8502d3](https://github.com/SolidZORO/leaa/commit/e8502d3c9455b685e47ac18e39769f4d5e588724))
- improves validateUserByPayload logic ([6208557](https://github.com/SolidZORO/leaa/commit/6208557b4fc91ca73c0c77b05775756eb7d400a9))
- more files code style to `named export` ([1006863](https://github.com/SolidZORO/leaa/commit/10068635531f842b543e9519381a266c309f7918))

## [2.0.6](https://github.com/SolidZORO/leaa/compare/v1.1.0...v2.0.6) (2020-05-05)

### Bug Fixes

- divisions gen ([787ed42](https://github.com/SolidZORO/leaa/commit/787ed42eec16776702f3bdde9d4aef425e378cf3))
- just a git-cz test ([44168f3](https://github.com/SolidZORO/leaa/commit/44168f3cacb4afccaabfff41397d751a73e64c1f))
- seed data ([0d6e6e8](https://github.com/SolidZORO/leaa/commit/0d6e6e84807ccd7d94b4a0882379325dfaf3fd87))
- test commit-version ([7fd9729](https://github.com/SolidZORO/leaa/commit/7fd972944a256a463658ff9f08efdc99d192130f))

# [1.1.0](https://github.com/SolidZORO/leaa/compare/v1.0.5...v1.1.0) (2020-03-22)

## [1.0.5](https://github.com/SolidZORO/leaa/compare/v1.0.4...v1.0.5) (2020-02-21)

## [1.0.4](https://github.com/SolidZORO/leaa/compare/v1.0.3...v1.0.4) (2020-01-15)

## [1.0.3](https://github.com/SolidZORO/leaa/compare/v1.0.2...v1.0.3) (2020-01-02)

## [1.0.2](https://github.com/SolidZORO/leaa/compare/v1.0.1...v1.0.2) (2019-11-23)

## [1.0.1](https://github.com/SolidZORO/leaa/compare/v0.0.4...v1.0.1) (2019-11-23)

## [0.0.4](https://github.com/SolidZORO/leaa/compare/v0.0.1...v0.0.4) (2019-10-28)

## [0.0.1](https://github.com/SolidZORO/leaa/compare/v0.0.2...v0.0.1) (2019-08-17)

## [0.0.2](https://github.com/SolidZORO/leaa/compare/0.0.1...v0.0.2) (2019-08-17)
