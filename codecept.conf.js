const { setHeadlessWhen, setCommonPlugins } = require('@codeceptjs/configure');
// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);

// enable all common plugins https://github.com/codeceptjs/configure#setcommonplugins
setCommonPlugins();

/** @type {CodeceptJS.MainConfig} */
exports.config = {
  tests: './e2e/specs/**/*_test.js',
  output: './e2e/output',
  helpers: {
    Playwright: {
      url: 'http://localhost:4200',
      show: true,
      browser: 'chromium',
      waitForTimeout: 5000
    },
    ApiMockHelper: {
      require: './e2e/helpers/ApiMock.helper.js'
    }
  },
  include: {
    I: './e2e/steps_file.js'
  },
  bootstrap: null,
  mocha: {},
  name: 'todo-app',
  plugins: {
    allure: {
      enabled: true,
      outputDir: './e2e/output'
    },
    pauseOnFail: {},
    retryFailedStep: {
      enabled: true
    },
    tryTo: {
      enabled: true
    },
    screenshotOnFail: {
      enabled: true
    }
  }
};
