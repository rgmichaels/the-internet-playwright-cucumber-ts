import { Page, Response } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

const CONGRATS_MESSAGE = 'Congratulations! You must have the proper credentials.';

type DigestChallenge = {
  nonce?: string;
  opaque?: string;
  qop?: string;
  realm?: string;
};

export class DigestAuthPage extends BasePage {
  constructor(page: Page) { super(page); }

  async assertLoaded() {
    await expect(this.page.locator('#content')).toContainText(CONGRATS_MESSAGE);
  }

  async open(baseUrl: string): Promise<Response | null> {
    return this.page.goto(`${baseUrl}/digest_auth`);
  }

  assertUnauthorizedResponse(response: Response | null) {
    expect(response, 'Expected navigation to return an HTTP response').not.toBeNull();
    expect(response!.status()).toBe(401);
  }

  private readDigestChallenge(response: Response | null): DigestChallenge {
    expect(response, 'Expected navigation to return an HTTP response').not.toBeNull();

    const challenge = response!.headers()['www-authenticate'];
    expect(challenge, 'Expected a WWW-Authenticate challenge').toBeTruthy();
    const digestMatch = /^Digest\s+(.+)$/i.exec(challenge ?? '');
    expect(Boolean(digestMatch), 'Expected WWW-Authenticate to use the Digest scheme').toBe(true);

    if (!digestMatch) {
      throw new Error('WWW-Authenticate did not contain a Digest challenge');
    }

    const parameters: DigestChallenge = {};
    const parameterPattern = /(?:^|,)\s*([a-z][a-z0-9_-]*)\s*=\s*(?:"([^"]*)"|([^,\s]+))/gi;

    for (const match of digestMatch[1].matchAll(parameterPattern)) {
      const name = match[1].toLowerCase() as keyof DigestChallenge;
      if (name === 'nonce' || name === 'opaque' || name === 'qop' || name === 'realm') {
        parameters[name] = match[2] ?? match[3];
      }
    }

    return parameters;
  }

  assertDigestChallenge(response: Response | null) {
    const challenge = this.readDigestChallenge(response);
    expect(challenge.realm).toBe('Protected Area');
  }

  assertDigestRequestIntegrity(response: Response | null) {
    const challenge = this.readDigestChallenge(response);

    expect(challenge.nonce?.length ?? 0, 'Digest challenge should include a non-empty nonce')
      .toBeGreaterThan(0);
    expect(challenge.opaque?.length ?? 0, 'Digest challenge should include non-empty server state')
      .toBeGreaterThan(0);

    const qopValues = (challenge.qop ?? '')
      .split(',')
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean);
    expect(qopValues, 'Digest challenge should support auth quality of protection').toContain('auth');
  }

  async assertProtectedContentNotDisplayed() {
    await expect(this.page.locator('body')).not.toContainText(CONGRATS_MESSAGE);
  }

  async exercise() {
    // Auth page "exercise" is the content assertion above
    await this.assertLoaded();
  }
}
