// jest.config.cjs
module.exports = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/test/**/*.test.js'],
  moduleFileExtensions: ['js', 'json', 'node'],
  collectCoverage: true,
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
};
