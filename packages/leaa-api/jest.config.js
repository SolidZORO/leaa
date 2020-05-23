/* eslint-disable import/no-extraneous-dependencies */
const { defaults: tsjPreset } = require('ts-jest/presets');

// 🔰 Tips, if `tsconfig.json`, here will be open
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  transform: {
    ...tsjPreset.transform,
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js'],
  //
  // 🔰 Tips, if `tsconfig.json`, here will be open
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  modulePathIgnorePatterns: ['<rootDir>/.cache/', '<rootDir>/_build/', '<rootDir>/_dist/', '<rootDir>/_deploy/'],
  //
  testRegex: '.*\\.(spec|test).(t|j)s$',
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
  // coverageReporters: ['json', 'lcov'],
  testEnvironment: 'node',
  collectCoverage: true,
  // coverageDirectory: './coverage',
};
