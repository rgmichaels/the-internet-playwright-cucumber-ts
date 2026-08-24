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

  async assertHostComposition() {
    const hosts = this.page.locator('my-paragraph');
    await expect(hosts).toHaveCount(2);

    const compositions = await hosts.evaluateAll((elements) => {
      const normalize = (value: string | null | undefined) =>
        (value ?? '').replace(/\s+/g, ' ').trim();

      return elements.map((host) => {
        const root = host.shadowRoot;
        const paragraph = root?.querySelector('p') ?? null;
        const slot = root?.querySelector<HTMLSlotElement>('slot[name="my-text"]') ?? null;
        const assignedElements = slot?.assignedElements({ flatten: true }) ?? [];
        const styles = paragraph ? getComputedStyle(paragraph) : null;

        return {
          assignedTags: assignedElements.map((element) => element.tagName),
          assignedTexts: assignedElements.map((element) => normalize(element.textContent)),
          backgroundColor: styles?.backgroundColor ?? null,
          color: styles?.color ?? null,
          fallbackText: normalize(slot?.textContent),
          listItemTexts: Array.from(host.querySelectorAll('li')).map((item) =>
            normalize(item.textContent)
          ),
          padding: styles?.padding ?? null,
          paragraphCount: root?.querySelectorAll('p').length ?? 0,
          renderedText: normalize((host as HTMLElement).innerText),
          shadowMode: root?.mode ?? null,
          slotCount: root?.querySelectorAll('slot[name="my-text"]').length ?? 0,
        };
      });
    });

    const sharedComposition = {
      backgroundColor: 'rgb(102, 102, 102)',
      color: 'rgb(255, 255, 255)',
      fallbackText: 'My default text',
      padding: '5px',
      paragraphCount: 1,
      shadowMode: 'open',
      slotCount: 1,
    };

    expect(compositions).toEqual([
      {
        ...sharedComposition,
        assignedTags: ['SPAN'],
        assignedTexts: ["Let's have some different text!"],
        listItemTexts: [],
        renderedText: "Let's have some different text!",
      },
      {
        ...sharedComposition,
        assignedTags: ['UL'],
        assignedTexts: ["Let's have some different text! In a list!"],
        listItemTexts: ["Let's have some different text!", 'In a list!'],
        renderedText: "Let's have some different text! In a list!",
      },
    ]);
  }
}
