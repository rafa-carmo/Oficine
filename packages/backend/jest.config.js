const { name } = require('./package.json');

module.exports = {
  displayName: name,
  transform: {
    '^.+\\.ts?$': ['@swc/jest']
  },
  collectCoverage: true,
  coverageDirectory: 'coverage'
};