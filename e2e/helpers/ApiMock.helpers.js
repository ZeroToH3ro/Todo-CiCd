// helpers/ApiMock.helper.js
const Helper = require('@codeceptjs/helper');

class ApiMockHelper extends Helper {
  async mockEndpoint(method, url, response) {
    const { page } = this.helpers.Playwright;

    // Convert URL to regex pattern if it contains wildcard
    const urlPattern = url.includes('*')
      ? new RegExp(url.replace(/\*/g, '.*'))
      : url;

    await page.route(urlPattern, async (route) => {
      const request = route.request();

      if (request.method() === method) {
        try {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(response)
          });
        } catch (error) {
          console.error(`Failed to mock ${method} ${url}:`, error);
          await route.continue();
        }
      } else {
        await route.continue();
      }
    });
  }

  // Optional: Method to clear all mocks
  async clearMocks() {
    const { page } = this.helpers.Playwright;
    await page.unroute('**/*');
  }
}

module.exports = ApiMockHelper;
