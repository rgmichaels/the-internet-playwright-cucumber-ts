/**
 * CucumberJS configuration
 */
const requestedRetryCount = Number.parseInt(process.env.LOCAL_MACOS_CUCUMBER_RETRY ?? '0', 10);
const retryCount = Number.isInteger(requestedRetryCount) && requestedRetryCount >= 0
  ? requestedRetryCount
  : 0;

module.exports = {
  default: {
    requireModule: ['ts-node/register/transpile-only'],
    require: ['src/support/**/*.ts', 'src/steps/**/*.ts'],
    format: [
      'progress-bar',
      'summary',
      'json:reports/cucumber.json',
      'junit:reports/junit.xml'
    ],
    parallel: 1,
    retry: retryCount,
    worldParameters: {
      baseUrl: process.env.BASE_URL || 'https://the-internet.herokuapp.com'
    }
  }
};
