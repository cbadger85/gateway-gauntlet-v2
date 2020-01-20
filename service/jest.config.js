module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/src/__tests__/__data__/setupEnv.ts'],
  testPathIgnorePatterns: ['/__data__/'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
};
