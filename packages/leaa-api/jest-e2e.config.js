/* eslint-disable import/no-extraneous-dependencies */
const { defaults: tsjPreset } = require('ts-jest/presets');

// 🔰 Tips, if `tsconfig.json`, here will be open
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  transform: {
    ...tsjPreset.transform,
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  //
  // 🔰 Tips, if `tsconfig.json`, here will be open
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  modulePathIgnorePatterns: ['<rootDir>/.cache/', '<rootDir>/_build/', '<rootDir>/_dist/', '<rootDir>/_deploy/'],
  //
  testRegex: '.*\\.e2e-(spec|test).(t|j)s$',
  collectCoverageFrom: [
    'test/**/*.{js,jsx,tsx,ts}',
    // 'src/**/*.{js,jsx,tsx,ts}',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!**/dist/**',
    '!**/.cache/**',
    '!**/_build/**',
    '!**/_dist/**',
    '!**/_deploy/**',
  ],
  coverageReporters: ['json', 'lcov'],
  testEnvironment: 'node',
  coverageDirectory: './coverage',
};
