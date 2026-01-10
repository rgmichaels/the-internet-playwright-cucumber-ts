import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class ShadowDomPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async assertLoaded() {
    await expect(this.page).toHaveURL(/\/shadowdom$/, { timeout: 20_000 });

    // Stable anchors on this page
    await expect(this.page.locator('h1')).toContainText('Simple template', { timeout: 20_000 });
    await expect(this.page.locator('my-paragraph')).toHaveCount(2, { timeout: 20_000 });
  }

  async exercise() {
    // 1) Assert light DOM content (outside shadow roots)
    await expect(this.page.locator('body')).toContainText("Let's have some different text!", { timeout: 20_000 });

    // 2) Assert shadow DOM content (inside the shadow roots)
    const shadowTexts = await this.page.evaluate(() => {
      const hosts = Array.from(document.querySelectorAll('my-paragraph'));
      return hosts.map((h) => {
        const root = (h as any).shadowRoot as ShadowRoot | null;
        if (!root) return '';
        return (root.textContent ?? '').replace(/\s+/g, ' ').trim();
      });
    });

    expect(shadowTexts.length).toBe(2);

    // The demo's point: shadow DOM provides "default" content even when light DOM changes.
    const combinedShadow = shadowTexts.join(' ').trim();
    expect(combinedShadow.length).toBeGreaterThan(0);
    expect(combinedShadow).toMatch(/my default text/i);

    // Bonus: ensure at least one shadow root includes styling (proves we're actually reading shadow DOM)
    expect(combinedShadow).toMatch(/background-color/i);
  }
}
