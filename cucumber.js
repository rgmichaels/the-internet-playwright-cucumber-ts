/**
 * CucumberJS configuration
 */
module.exports = {
  default: {
    requireModule: ['ts-node/register/transpile-only'],
    require: ['src/support/**/*.ts', 'src/steps/**/*.ts'],
    paths: ['features/**/*.feature'],
    format: [
      'progress-bar',
      'summary',
      'json:reports/cucumber.json',
      'junit:reports/junit.xml'
    ],
    parallel: 1,
    retry: 0,
    worldParameters: {
      baseUrl: process.env.BASE_URL || 'https://the-internet.herokuapp.com'
    }
  }
};
