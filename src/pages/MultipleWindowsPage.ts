import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class MultipleWindowsPage extends BasePage {
  constructor(page: Page) { super(page); }
  async assertLoaded() { await this.expectH3ToBe('Opening a new window'); }

  private async openPopup() {
    const [popup] = await Promise.all([
      this.page.waitForEvent('popup'),
      this.page.getByRole('link', { name: 'Click Here' }).click()
    ]);

    await popup.waitForLoadState('domcontentloaded');
    return popup;
  }

  private async assertPopupLoaded(popup: Page) {
    expect(await popup.opener()).toBe(this.page);
    await expect(popup).toHaveURL(/\/windows\/new$/);
    await expect(popup.getByRole('heading', { name: 'New Window', level: 3 })).toBeVisible();
  }

  private async assertOriginalWindow() {
    expect(this.page.isClosed()).toBe(false);
    await expect(this.page).toHaveURL(/\/windows$/);
    await this.assertLoaded();
    await expect(this.page.getByRole('link', { name: 'Click Here' })).toBeVisible();
  }

  async assertPopupLifecycle() {
    const context = this.page.context();
    const link = this.page.getByRole('link', { name: 'Click Here' });

    expect(context.pages()).toHaveLength(1);
    expect(context.pages()[0]).toBe(this.page);
    await expect(link).toBeVisible();

    const newPage = await this.openPopup();

    try {
      expect(context.pages()).toHaveLength(2);
      await this.assertPopupLoaded(newPage);
    } finally {
      await newPage.close();
    }

    expect(newPage.isClosed()).toBe(true);
    await expect.poll(() => context.pages().length).toBe(1);
    expect(context.pages()[0]).toBe(this.page);

    await this.page.bringToFront();
    await this.assertOriginalWindow();
  }

  async assertRepeatedPopupIndependence() {
    const context = this.page.context();
    const popups: Page[] = [];

    expect(context.pages()).toHaveLength(1);
    expect(context.pages()[0]).toBe(this.page);

    try {
      popups.push(await this.openPopup());
      popups.push(await this.openPopup());

      const [firstPopup, secondPopup] = popups;
      expect(firstPopup).not.toBe(secondPopup);
      expect(context.pages()).toHaveLength(3);
      expect(context.pages()).toEqual(expect.arrayContaining([this.page, firstPopup, secondPopup]));

      await this.assertPopupLoaded(firstPopup);
      await this.assertPopupLoaded(secondPopup);

      await firstPopup.close();
      expect(firstPopup.isClosed()).toBe(true);
      await expect.poll(() => context.pages().length).toBe(2);
      expect(context.pages()).toEqual(expect.arrayContaining([this.page, secondPopup]));

      expect(secondPopup.isClosed()).toBe(false);
      await this.assertPopupLoaded(secondPopup);
      await this.assertOriginalWindow();

      await secondPopup.close();
      expect(secondPopup.isClosed()).toBe(true);
      await expect.poll(() => context.pages().length).toBe(1);
      expect(context.pages()[0]).toBe(this.page);
    } finally {
      await Promise.all(
        popups.filter((popup) => !popup.isClosed()).map((popup) => popup.close())
      );
    }

    await this.page.bringToFront();
    await this.assertOriginalWindow();
  }
}
