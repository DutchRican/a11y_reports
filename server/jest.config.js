/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  setupFilesAfterEnv: ['./jest.setup.js'],
  testEnvironment: 'node',
  testMatch: [
    "<rootDir>/__tests__/**/*.test.js",
    "<rootDir>/routes/__tests__/**/*.test.js"
  ],
  moduleNameMapper: {
    "^../index$": "<rootDir>/index.js",
    "^../models/ScanResult$": "<rootDir>/models/ScanResult.js"
  }
};