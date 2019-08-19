/* eslint-disable import/no-extraneous-dependencies */
const { defaults: tsjPreset } = require('ts-jest/presets');

// 🔰 Tips, if `tsconfig.json`, here will be open
// const { pathsToModuleNameMapper } = require('ts-jest/utils');
// const { compilerOptions } = require('./tsconfig');

module.exports = {
  transform: {
    ...tsjPreset.transform,
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  //
  // 🔰 Tips, if `tsconfig.json`, here will be open
  // moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  //
  testRegex: '.e2e-(test|spec).ts$',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,tsx,ts}',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!**/dist/**',
    '!**/_dist/**',
    '!**/_deploy/**',
  ],
  coverageReporters: ['json', 'lcov'],
  testEnvironment: 'node',
  coverageDirectory: './coverage',
};
