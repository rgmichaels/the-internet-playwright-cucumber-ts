import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class ForgotPasswordPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async assertLoaded() {
    const content = this.page.locator('#content');
    const recoveryForm = this.page.locator('form#forgot_password');
    const email = this.page.getByLabel('E-mail', { exact: true });
    const submit = this.page.getByRole('button', { name: 'Retrieve password', exact: true });

    await expect(this.page).toHaveURL(/\/forgot_password$/, { timeout: 20_000 });
    await expect(content).toBeVisible({ timeout: 20_000 });
    await expect(content.locator('h2')).toHaveText('Forgot Password', { timeout: 20_000 });
    await expect(recoveryForm).toBeVisible({ timeout: 20_000 });
    await expect(email).toBeVisible({ timeout: 20_000 });
    await expect(email).toBeEditable();
    await expect(submit).toBeVisible({ timeout: 20_000 });
    await expect(submit).toBeEnabled();
  }

  async assertRecoveryRequestContract() {
    const emailAddress = 'qa-forgot-password@example.com';
    const email = this.page.getByLabel('E-mail', { exact: true });
    const submit = this.page.getByRole('button', { name: 'Retrieve password', exact: true });
    const expectedOrigin = new URL(this.page.url()).origin;

    await email.fill(emailAddress);

    const requestPromise = this.page.waitForRequest((request) => {
      const requestUrl = new URL(request.url());
      return request.method() === 'POST' && requestUrl.pathname === '/forgot_password';
    }, { timeout: 20_000 });

    await submit.click();
    const request = await requestPromise;
    const requestUrl = new URL(request.url());
    const contentType = request.headers()['content-type'];
    const postData = request.postData();

    expect(requestUrl.origin).toBe(expectedOrigin);
    expect(requestUrl.pathname).toBe('/forgot_password');
    expect(request.method()).toBe('POST');
    expect(contentType).toMatch(/^application\/x-www-form-urlencoded(?:;|$)/);
    expect(postData).not.toBeNull();
    expect(Array.from(new URLSearchParams(postData ?? '').entries())).toEqual([
      ['email', emailAddress]
    ]);
  }
}
