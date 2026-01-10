import { Page, Frame } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class NestedFramesPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async assertLoaded() {
    await expect(this.page).toHaveURL(/\/nested_frames$/, { timeout: 20_000 });

    // Frameset page: no reliable #content/h3. Instead assert expected frames exist.
    await expect
      .poll(async () => {
        const names = this.page.frames().map((f) => f.name()).filter(Boolean);
        return names;
      }, { timeout: 20_000 })
      .toEqual(expect.arrayContaining(['frame-top', 'frame-bottom']));
  }

  private getFrameByName(name: string): Frame {
    const frame = this.page.frames().find((f) => f.name() === name);
    if (!frame) throw new Error(`Frame "${name}" not found`);
    return frame;
  }

  private async frameBodyText(frame: Frame): Promise<string> {
    // Some frames have plain body text
    const body = frame.locator('body');
    await expect(body).toBeVisible({ timeout: 20_000 });
    return ((await body.innerText().catch(() => '')) ?? '').trim();
  }

  async exercise() {
    const top = this.getFrameByName('frame-top');
    const bottom = this.getFrameByName('frame-bottom');

    // The top frame contains three child frames.
    const left = top.childFrames().find((f) => f.name() === 'frame-left');
    const middle = top.childFrames().find((f) => f.name() === 'frame-middle');
    const right = top.childFrames().find((f) => f.name() === 'frame-right');

    if (!left || !middle || !right) {
      throw new Error(
        `Expected child frames not found. Found: ${top.childFrames().map((f) => f.name()).join(', ')}`
      );
    }

    const leftText = await this.frameBodyText(left);
    const middleText = await this.frameBodyText(middle);
    const rightText = await this.frameBodyText(right);
    const bottomText = await this.frameBodyText(bottom);

    // Assert the "point" of the page: you can reach and read each nested frame.
    await expect(leftText).toContain('LEFT');
    await expect(middleText).toContain('MIDDLE');
    await expect(rightText).toContain('RIGHT');
    await expect(bottomText).toContain('BOTTOM');
  }
}
