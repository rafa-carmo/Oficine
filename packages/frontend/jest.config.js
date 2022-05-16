const { name } = require('./package.json');

module.exports = {
  displayName: name,
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest']
  }
};