import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class FormAuthPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private heading() {
    // This page uses h2 for "Login Page"
    return this.page.locator('#content h2');
  }

  private username() {
    return this.page.locator('#username');
  }

  private password() {
    return this.page.locator('#password');
  }

  private loginButton() {
    return this.page.locator('button[type="submit"]');
  }

  private flash() {
    return this.page.locator('#flash');
  }

  private secureAreaHeading(page: Page = this.page) {
    return page.locator('#content h2');
  }

  private logoutButton(page: Page = this.page) {
    return page.locator('a.button.secondary.radius');
  }

  async assertLoaded() {
    await expect(this.page).toHaveURL(/\/login$/, { timeout: 20_000 });
    await expect(this.heading()).toHaveText('Login Page', { timeout: 20_000 });

    // Form controls present
    await expect(this.username()).toBeVisible({ timeout: 20_000 });
    await expect(this.password()).toBeVisible({ timeout: 20_000 });
    await expect(this.loginButton()).toBeVisible({ timeout: 20_000 });
  }

  private async login(user: string, pass: string) {
    await this.username().fill(user);
    await this.password().fill(pass);
    await this.loginButton().click();
  }

  async openSecureAreaDirectly(baseUrl: string) {
    await this.page.goto(`${baseUrl}/secure`);
  }

  async assertUnauthenticatedAccessRejected() {
    await this.assertLoaded();
    await expect(this.flash()).toBeVisible({ timeout: 20_000 });
    await expect(this.flash()).toContainText(
      'You must login to view the secure area!',
      { timeout: 20_000 }
    );
  }

  async assertInvalidLoginDismissible() {
    await this.login('baduser', 'badpass');
    await expect(this.flash()).toBeVisible({ timeout: 20_000 });
    await expect(this.flash()).toContainText('Your username is invalid!', { timeout: 20_000 });

    const close = this.flash().locator('a.close');
    await expect(close).toBeVisible({ timeout: 20_000 });
    await close.click();

    await expect(this.flash()).toBeHidden({ timeout: 20_000 });
  }

  async assertInvalidPasswordDismissible() {
    await this.login('tomsmith', 'incorrect-password');

    await expect(this.page).toHaveURL(/\/login$/, { timeout: 20_000 });
    await expect(this.heading()).toHaveText('Login Page', { timeout: 20_000 });
    await expect(this.logoutButton()).toBeHidden({ timeout: 20_000 });
    await expect(this.flash()).toBeVisible({ timeout: 20_000 });
    await expect(this.flash()).toContainText('Your password is invalid!', { timeout: 20_000 });

    const close = this.flash().locator('a.close');
    await expect(close).toBeVisible({ timeout: 20_000 });
    await close.click();

    await expect(this.flash()).toBeHidden({ timeout: 20_000 });
  }

  private async assertSecureAreaLoaded(page: Page) {
    await expect(page).toHaveURL(/\/secure$/, { timeout: 20_000 });
    await expect(this.secureAreaHeading(page)).toContainText('Secure Area', { timeout: 20_000 });
    await expect(this.logoutButton(page)).toBeVisible({ timeout: 20_000 });
  }

  private async loginSuccessfully() {
    await this.login('tomsmith', 'SuperSecretPassword!');
    await this.assertSecureAreaLoaded(this.page);
    await expect(this.flash()).toContainText('You logged into a secure area!', { timeout: 20_000 });
  }

  private async logOut() {
    await this.logoutButton().click();

    await expect(this.page).toHaveURL(/\/login$/, { timeout: 20_000 });
    await expect(this.flash()).toContainText('You logged out of the secure area!', { timeout: 20_000 });
    await expect(this.heading()).toHaveText('Login Page', { timeout: 20_000 });
  }

  async loginSuccessfullyAndLogOut() {
    await this.loginSuccessfully();
    await this.logOut();
  }

  async assertLogoutInvalidatesAuthenticatedSiblingTab(baseUrl: string) {
    await this.loginSuccessfully();

    const siblingPage = await this.page.context().newPage();

    try {
      await siblingPage.goto(`${baseUrl}/secure`);
      await this.assertSecureAreaLoaded(siblingPage);

      await this.logOut();
      await siblingPage.reload({ waitUntil: 'domcontentloaded' });

      await expect(siblingPage).toHaveURL(/\/login$/, { timeout: 20_000 });
      await expect(siblingPage.locator('#content h2')).toHaveText('Login Page', {
        timeout: 20_000,
      });
      await expect(siblingPage.locator('#flash')).toContainText(
        'You must login to view the secure area!',
        { timeout: 20_000 }
      );
      await expect(siblingPage.getByRole('heading', { name: 'Secure Area', level: 2 })).toHaveCount(0);
      await expect(this.logoutButton(siblingPage)).toHaveCount(0);
      await expect(siblingPage.locator('#content')).not.toContainText('Welcome to the Secure Area.');
    } finally {
      await siblingPage.close().catch(() => {});
    }
  }

  async exercise() {
    // 1) Invalid login -> error flash
    await this.login('baduser', 'badpass');
    await expect(this.flash()).toBeVisible({ timeout: 20_000 });
    await expect(this.flash()).toContainText('Your username is invalid!', { timeout: 20_000 });

    // 2) Valid login -> secure area + logout
    await this.loginSuccessfullyAndLogOut();
  }
}
