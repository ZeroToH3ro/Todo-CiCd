const Helper = require('@codeceptjs/helper');
const axios = require('axios');

class ApiMockHelper extends Helper {
  constructor(config) {
    super(config);
    this.baseUrl = 'http://localhost:8080';
    this.mockDefinitions = new Map();
    this.axiosInstance = axios.create({
      baseURL: `${this.baseUrl}/__admin`,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async _before() {
    const { page } = this.helpers.Playwright;
    if (page) {
      page.on('console', msg => console.log(msg.text()));
      page.on('pageerror', error => console.log(error));
      page.on('requestfailed', request =>
        console.log(`Failed request: ${request.url()}: ${request.failure().errorText}`)
      );
    }
  }

  async _beforeSuite() {
    await this.clearMocks();
  }

  async mockEndpoint(method, url, response, statusCode = 200) {
    try {
      const mockDefinition = {
        priority: 1,
        request: {
          method: method.toUpperCase(),
          urlPattern: url.replace(/\*/g, '.*'),
        },
        response: {
          status: statusCode,
          headers: {
            'Content-Type': 'application/json'
          },
          jsonBody: response
        }
      };

      await this.axiosInstance.post('/mappings', mockDefinition);
      this.mockDefinitions.set(`${method}-${url}`, mockDefinition);
    } catch (error) {
      console.error(`Failed to mock ${method} ${url}:`, error);
      throw error;
    }
  }

  async clearMocks() {
    try {
      await this.axiosInstance.post('/reset');
      this.mockDefinitions.clear();
    } catch (error) {
      console.error('Failed to clear mocks:', error);
      throw error;
    }
  }

  async verifyMockCalled(method, url, times = 1) {
    try {
      const response = await this.axiosInstance.post('/requests/count', {
        method: method.toUpperCase(),
        urlPattern: url.replace(/\*/g, '.*'),
      });

      const count = response.data.count;
      if (count !== times) {
        throw new Error(`Expected ${times} calls to ${method} ${url}, but got ${count}`);
      }
    } catch (error) {
      console.error(`Failed to verify mock ${method} ${url}:`, error);
      throw error;
    }
  }

  // Additional helper methods
  async addMockRoute(method, url, response, statusCode = 200) {
    await this.mockEndpoint(method, url, response, statusCode);
  }

  async applyMocks() {
    // No need to do anything as mocks are applied immediately when added
    return;
  }
}

module.exports = ApiMockHelper;
