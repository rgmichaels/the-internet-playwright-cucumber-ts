import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

const SESSION_COOKIE_NAME = 'rack.session';
const TAMPERED_SESSION_VALUE = 'tampered-session-token';
const VALID_USERNAME = 'tomsmith';
const VALID_PASSWORD = 'SuperSecretPassword!';

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

  async openSecureAreaWithTamperedSession(baseUrl: string) {
    await this.page.context().addCookies([
      {
        name: SESSION_COOKIE_NAME,
        value: TAMPERED_SESSION_VALUE,
        url: baseUrl,
      },
    ]);

    const seededSessionCookies = (await this.page.context().cookies(baseUrl)).filter(
      (cookie) => cookie.name === SESSION_COOKIE_NAME
    );
    expect(seededSessionCookies).toHaveLength(1);
    expect(seededSessionCookies[0].value).toBe(TAMPERED_SESSION_VALUE);

    await this.openSecureAreaDirectly(baseUrl);
  }

  async assertUnauthenticatedAccessRejected() {
    await this.assertLoaded();
    await expect(this.flash()).toBeVisible({ timeout: 20_000 });
    await expect(this.flash()).toContainText(
      'You must login to view the secure area!',
      { timeout: 20_000 }
    );
  }

  async assertTamperedSessionAccessRejectedAndReset(baseUrl: string) {
    await this.assertUnauthenticatedAccessRejected();
    await expect(this.page.getByRole('heading', { name: 'Secure Area', level: 2 })).toHaveCount(0);
    await expect(this.logoutButton()).toHaveCount(0);
    await expect(this.page.locator('#content')).not.toContainText('Welcome to the Secure Area.');

    const currentSessionCookies = (await this.page.context().cookies(baseUrl)).filter(
      (cookie) => cookie.name === SESSION_COOKIE_NAME
    );
    expect(currentSessionCookies).toHaveLength(1);
    expect(currentSessionCookies[0].value).not.toBe(TAMPERED_SESSION_VALUE);
  }

  private async sessionCookie(baseUrl: string) {
    const sessionCookies = (await this.page.context().cookies(baseUrl)).filter(
      (cookie) => cookie.name === SESSION_COOKIE_NAME
    );

    expect(
      sessionCookies,
      'Browser context should contain exactly one application session'
    ).toHaveLength(1);
    return sessionCookies[0];
  }

  private async sessionCookieValue(baseUrl: string) {
    return (await this.sessionCookie(baseUrl)).value;
  }

  async assertSuccessfulLoginRotatesSession(baseUrl: string) {
    const preAuthenticationSession = await this.sessionCookieValue(baseUrl);

    await this.loginSuccessfully();

    const authenticatedSession = await this.sessionCookieValue(baseUrl);
    expect(authenticatedSession).not.toBe(preAuthenticationSession);
  }

  async assertAuthenticatedSessionIsHttpOnly(baseUrl: string) {
    await this.loginSuccessfully();

    const authenticatedSession = await this.sessionCookie(baseUrl);
    expect(authenticatedSession.httpOnly).toBe(true);

    const sessionIsVisibleToPageScript = await this.page.evaluate((cookieName) => {
      return document.cookie
        .split(';')
        .some((cookie) => cookie.trim().startsWith(`${cookieName}=`));
    }, SESSION_COOKIE_NAME);

    expect(sessionIsVisibleToPageScript).toBe(false);
  }

  async assertCredentialsStayOutOfNavigationUrls() {
    await this.username().fill(VALID_USERNAME);
    await this.password().fill(VALID_PASSWORD);

    const authenticationRequestPromise = this.page.waitForRequest((request) => {
      const requestUrl = new URL(request.url());
      return (
        request.isNavigationRequest() &&
        request.frame() === this.page.mainFrame() &&
        requestUrl.pathname === '/authenticate'
      );
    });

    await this.loginButton().click();
    const authenticationRequest = await authenticationRequestPromise;
    const authenticationUrl = new URL(authenticationRequest.url());

    expect(authenticationRequest.method()).toBe('POST');
    expect(authenticationUrl.protocol).toBe('https:');
    expect(authenticationUrl.pathname).toBe('/authenticate');
    expect(authenticationUrl.search).toBe('');
    expect(authenticationUrl.hash).toBe('');
    expect(authenticationRequest.headers()['content-type']).toContain(
      'application/x-www-form-urlencoded'
    );

    const decodedAuthenticationUrl = decodeURIComponent(authenticationRequest.url());
    expect(decodedAuthenticationUrl).not.toContain(VALID_USERNAME);
    expect(decodedAuthenticationUrl).not.toContain(VALID_PASSWORD);

    const postData = authenticationRequest.postData();
    expect(postData, 'Authentication request should have a form-encoded body').not.toBeNull();

    const submittedForm = new URLSearchParams(postData ?? '');
    expect([...submittedForm.keys()].sort()).toEqual(['password', 'username']);
    expect(submittedForm.get('username')).toBe(VALID_USERNAME);
    expect(submittedForm.get('password')).toBe(VALID_PASSWORD);

    await this.assertSecureAreaLoaded(this.page);
    await expect(this.flash()).toContainText('You logged into a secure area!', { timeout: 20_000 });

    const secureAreaUrl = new URL(this.page.url());
    expect(secureAreaUrl.protocol).toBe('https:');
    expect(secureAreaUrl.search).toBe('');
    expect(secureAreaUrl.hash).toBe('');

    const decodedSecureAreaUrl = decodeURIComponent(this.page.url());
    expect(decodedSecureAreaUrl).not.toContain(VALID_USERNAME);
    expect(decodedSecureAreaUrl).not.toContain(VALID_PASSWORD);
    await expect(this.username()).toHaveCount(0);
    await expect(this.password()).toHaveCount(0);
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
    await this.login(VALID_USERNAME, VALID_PASSWORD);
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
