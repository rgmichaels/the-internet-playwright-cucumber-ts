import { Page } from 'playwright';
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

  private async waitForFrameByUrl(regex: RegExp, timeoutMs = 20_000) {
    await expect
      .poll(
        async () => this.page.frames().find((f) => regex.test(f.url()))?.url() ?? '',
        { timeout: timeoutMs }
      )
      .toMatch(regex);

    const frame = this.page.frames().find((f) => regex.test(f.url()));
    if (!frame) throw new Error(`Frame not found for url pattern: ${regex}`);
    return frame;
  }

  async exercise() {
    // Wait for top + bottom frames by URL (more reliable than names in CI)
    const top = await this.waitForFrameByUrl(/\/frame_top$/);
    const bottom = await this.waitForFrameByUrl(/\/frame_bottom$/);

    // Inside top frame, wait for its child frames by URL
    // Note: sometimes child frames show up a beat later in CI, so poll.
    await expect
      .poll(
        async () => {
          const urls = top.childFrames().map((f) => f.url());
          return urls.join('|');
        },
        { timeout: 20_000 }
      )
      .toMatch(/\/frame_left$|\/frame_middle$|\/frame_right$/);

    const left = top.childFrames().find((f) => /\/frame_left$/.test(f.url()));
    const middle = top.childFrames().find((f) => /\/frame_middle$/.test(f.url()));
    const right = top.childFrames().find((f) => /\/frame_right$/.test(f.url()));

    if (!left || !middle || !right) {
      const found = top.childFrames().map((f) => f.url()).join(', ');
      throw new Error(`Expected child frames not found. Found URLs: ${found}`);
    }

    // Assert expected text inside each frame
    await expect(left.locator('body')).toContainText('LEFT', { timeout: 20_000 });
    await expect(middle.locator('body')).toContainText('MIDDLE', { timeout: 20_000 });
    await expect(right.locator('body')).toContainText('RIGHT', { timeout: 20_000 });

    await expect(bottom.locator('body')).toContainText('BOTTOM', { timeout: 20_000 });
  }
}
