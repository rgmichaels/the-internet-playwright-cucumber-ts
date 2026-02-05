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

  private logoutButton() {
    return this.page.locator('a.button.secondary.radius');
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

  async assertInvalidLoginDismissible() {
    await this.login('baduser', 'badpass');
    await expect(this.flash()).toBeVisible({ timeout: 20_000 });
    await expect(this.flash()).toContainText('Your username is invalid!', { timeout: 20_000 });

    const close = this.flash().locator('a.close');
    await expect(close).toBeVisible({ timeout: 20_000 });
    await close.click();

    await expect(this.flash()).toBeHidden({ timeout: 20_000 });
  }

  async exercise() {
    // 1) Invalid login -> error flash
    await this.login('baduser', 'badpass');
    await expect(this.flash()).toBeVisible({ timeout: 20_000 });
    await expect(this.flash()).toContainText('Your username is invalid!', { timeout: 20_000 });

    // 2) Valid login -> secure area + logout
    await this.login('tomsmith', 'SuperSecretPassword!');
    await expect(this.page).toHaveURL(/\/secure$/, { timeout: 20_000 });

    await expect(this.page.locator('#content h2')).toContainText('Secure Area', { timeout: 20_000 });
    await expect(this.flash()).toContainText('You logged into a secure area!', { timeout: 20_000 });

    await expect(this.logoutButton()).toBeVisible({ timeout: 20_000 });
    await this.logoutButton().click();

    await expect(this.page).toHaveURL(/\/login$/, { timeout: 20_000 });
    await expect(this.flash()).toContainText('You logged out of the secure area!', { timeout: 20_000 });
    await expect(this.heading()).toHaveText('Login Page', { timeout: 20_000 });
  }
}
