import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class NestedFramesPage extends BasePage {
  constructor(page: Page) { super(page); }
  async assertLoaded() { await this.expectH3ToBe('Nested Frames'); }

  async readLeftFrameText() {
    const top = this.page.frame({ name: 'frame-top' });
    expect(top).toBeTruthy();
    const left = top!.childFrames().find((f) => f.name() === 'frame-left');
    expect(left).toBeTruthy();
    const txt = await left!.locator('body').textContent();
    expect((txt ?? '').trim().length).toBeGreaterThan(0);
  }

  async exercise() {
    await this.readLeftFrameText();
  }
}
