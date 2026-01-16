import { Page, Frame } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class NestedFramesPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async assertLoaded() {
    await expect(this.page).toHaveURL(/\/nested_frames$/, { timeout: 20_000 });

    // The page is a frameset; there may not be a stable #content h3 here.
    await expect(this.page.locator('frameset')).toBeVisible({ timeout: 20_000 });
  }

  /**
   * Waits for a frame to exist (by name) and to have navigated off about:blank.
   * This is more CI-stable than matching by frame URL, which can be about:blank
   * during attach/navigation timing on slower runners.
   */
  private async waitForFrameByName(
    name: string,
    timeoutMs = 20_000,
    notBlank = true
  ): Promise<Frame> {
    await expect
      .poll(
        async () => {
          const f = this.page.frame({ name });
          if (!f) return '';
          const url = f.url() ?? '';
          if (!notBlank) return url;
          return url && url !== 'about:blank' ? url : '';
        },
        { timeout: timeoutMs }
      )
      .not.toBe('');

    const frame = this.page.frame({ name });
    if (!frame) throw new Error(`Frame not found by name: ${name}`);
    return frame;
  }

  /**
   * Waits for a child frame under a given parent frame by name, and ensures it has a real URL.
   */
  private async waitForChildFrameByName(
    parent: Frame,
    name: string,
    timeoutMs = 20_000
  ): Promise<Frame> {
    await expect
      .poll(
        async () => {
          const f = parent.childFrames().find((cf) => cf.name() === name);
          if (!f) return '';
          const url = f.url() ?? '';
          return url && url !== 'about:blank' ? url : '';
        },
        { timeout: timeoutMs }
      )
      .not.toBe('');

    const frame = parent.childFrames().find((cf) => cf.name() === name);
    if (!frame) {
      const found = parent.childFrames().map((f) => `${f.name()}:${f.url()}`).join(', ');
      throw new Error(`Child frame "${name}" not found. Found: ${found}`);
    }
    return frame;
  }

  async exercise() {
    // Ensure the frameset DOM is ready before we start chasing frames
    await this.page.waitForLoadState('domcontentloaded');

    // The Internet nested frames have stable frame names:
    // frame-top, frame-left, frame-middle, frame-right, frame-bottom
    const top = await this.waitForFrameByName('frame-top');
    const bottom = await this.waitForFrameByName('frame-bottom');

    // Inside top frame, wait for the three child frames by name (CI-stable)
    const left = await this.waitForChildFrameByName(top, 'frame-left');
    const middle = await this.waitForChildFrameByName(top, 'frame-middle');
    const right = await this.waitForChildFrameByName(top, 'frame-right');

    // Assert expected text inside each frame
    await expect(left.locator('body')).toContainText('LEFT', { timeout: 20_000 });
    await expect(middle.locator('body')).toContainText('MIDDLE', { timeout: 20_000 });
    await expect(right.locator('body')).toContainText('RIGHT', { timeout: 20_000 });

    await expect(bottom.locator('body')).toContainText('BOTTOM', { timeout: 20_000 });
  }
}
