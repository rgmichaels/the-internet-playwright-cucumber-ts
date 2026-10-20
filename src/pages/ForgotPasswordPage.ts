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

  async submitRecoveryRequestAndAssertDelivery() {
    const emailAddress = 'test@example.com';
    const email = this.page.getByLabel('E-mail', { exact: true });
    const submit = this.page.getByRole('button', {
      name: 'Retrieve password',
      exact: true,
    });
    const originalOrigin = new URL(this.page.url()).origin;

    await email.fill(emailAddress);

    const [submissionResponse] = await Promise.all([
      this.page.waitForResponse((response) => {
        const request = response.request();
        const requestUrl = new URL(request.url());
        return (
          request.method() === 'POST' &&
          requestUrl.origin === originalOrigin &&
          requestUrl.pathname === '/forgot_password'
        );
      }),
      submit.click(),
    ]);

    const submissionRequest = submissionResponse.request();
    expect(submissionResponse.status()).toBe(303);
    expect(submissionRequest.headers()['content-type']).toMatch(
      /^application\/x-www-form-urlencoded\b/i
    );
    expect(submissionRequest.postDataJSON()).toEqual({ email: emailAddress });

    const redirectLocation = submissionResponse.headers()['location'];
    expect(
      redirectLocation,
      'Recovery response should redirect to the confirmation page'
    ).toBeTruthy();
    expect(new URL(redirectLocation!, originalOrigin).toString()).toBe(
      new URL('/email_sent', originalOrigin).toString()
    );

    await expect(this.page).toHaveURL(/\/email_sent$/, { timeout: 20_000 });
    await expect(this.page.locator('#content')).toHaveText("Your e-mail's been sent!", {
      timeout: 20_000,
    });
  }
}
