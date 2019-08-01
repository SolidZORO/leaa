/* eslint-disable import/no-extraneous-dependencies */
const { defaults: tsjPreset, pathsToModuleNameMapper } = require('ts-jest/presets');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  transform: {
    ...tsjPreset.transform,
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  testRegex: '/src/.*\\.(test|spec).(ts|tsx|js)$',
  collectCoverageFrom: ['src/**/*.{js,jsx,tsx,ts}', '!**/node_modules/**', '!**/vendor/**'],
  coverageReporters: ['json', 'lcov'],
  testEnvironment: 'node',
  coverageDirectory: './coverage',
};
