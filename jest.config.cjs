module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\.tsx?$': [
      'ts-jest',
      {
        diagnostics: {
          ignoreCodes: ['TS151001'],
        },
        astTransformers: {
          before: [
            {
              path: 'ts-jest-mock-import-meta',
              options: { metaObjectReplacement: { env: { VITE_API_BASE_URL: 'http://localhost:3001/api' } } },
            },
          ],
        },
      },
    ],
  },
  testMatch: ['**/src/**/*.test.(ts|tsx|js|jsx)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/src/jest.setup.js'],
};
