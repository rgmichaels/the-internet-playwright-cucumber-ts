import { Page, Response } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

const CONGRATS_MESSAGE = 'Congratulations! You must have the proper credentials.';

export class BasicAuthPage extends BasePage {
  constructor(page: Page) { super(page); }

  async assertLoaded() {
    await expect(this.page.locator('#content')).toContainText(CONGRATS_MESSAGE);
  }

  async open(baseUrl: string): Promise<Response | null> {
    return this.page.goto(`${baseUrl.replace(/\/+$/, '')}/basic_auth`);
  }

  assertUnauthorizedResponse(response: Response | null) {
    expect(response, 'Expected a response from basic auth navigation').not.toBeNull();

    if (!response) {
      throw new Error('Basic auth navigation did not return an HTTP response');
    }

    expect(response.status()).toBe(401);
  }

  assertBasicAuthenticationChallenge(response: Response | null) {
    expect(response, 'Expected a response from basic auth navigation').not.toBeNull();

    if (!response) {
      throw new Error('Basic auth navigation did not return an HTTP response');
    }

    const challenge = response.headers()['www-authenticate'];
    expect(challenge, 'Expected a WWW-Authenticate challenge').toBeTruthy();
    expect(challenge).toMatch(/^Basic\s+realm="Restricted Area"$/);
  }

  async assertProtectedContentNotDisplayed() {
    await expect(this.page.locator('body')).not.toContainText(CONGRATS_MESSAGE);
  }

  async exercise() {
    // Auth page "exercise" is the content assertion above
    await this.assertLoaded();
  }
}
