/* eslint-disable import/no-extraneous-dependencies */
const { defaults: tsjPreset } = require('ts-jest/presets');

// 🔰 Tips, if `tsconfig.json`, here will be open
const { pathsToModuleNameMapper } = require('ts-jest/utils');

module.exports = {
  transform: {
    ...tsjPreset.transform,
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js'],
  //
  // 🔰 Tips, if `tsconfig.json`, here will be open
  moduleNameMapper: pathsToModuleNameMapper(
    {
      '@leaa/common/*': ['../_leaa-common/*'],
      '@leaa/api/*': ['./*'],
    },
    { prefix: '<rootDir>/' },
  ),
  //
  modulePathIgnorePatterns: ['<rootDir>/_dist/', '<rootDir>/_deploy/'],
  testRegex: 'src.*\\.(test|spec).(ts|tsx|js)$',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,tsx,ts}',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!**/dist/**',
    '!**/_dist/**',
    '!**/_deploy/**',
  ],
  // coverageReporters: ['json', 'lcov'],
  testEnvironment: 'node',
  collectCoverage: true,
  // coverageDirectory: './coverage',
};
