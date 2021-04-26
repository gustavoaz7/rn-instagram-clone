const packagesToTranspile = ['react-native'];

module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['./setup-tests.js'],
  transformIgnorePatterns: [
    `/node_modules/(?!${packagesToTranspile.join('|')})`,
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/coverage/**',
    '!**/node_modules/**',
    '!./App.tsx',
  ],
  moduleNameMapper: {
    '\\.svg': '<rootDir>/__mocks__/svgMock.js',
  },
};
