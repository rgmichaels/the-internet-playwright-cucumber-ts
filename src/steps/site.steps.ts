import { Given, When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { HomePage } from '../pages/HomePage';
import { ABTestingPage } from '../pages/ABTestingPage';
import { AddRemoveElementsPage } from '../pages/AddRemoveElementsPage';
import { BasicAuthPage } from '../pages/BasicAuthPage';
import { BrokenImagesPage } from '../pages/BrokenImagesPage';
import { ChallengingDomPage } from '../pages/ChallengingDomPage';
import { CheckboxesPage } from '../pages/CheckboxesPage';
import { ContextMenuPage } from '../pages/ContextMenuPage';
import { DigestAuthPage } from '../pages/DigestAuthPage';
import { DisappearingElementsPage } from '../pages/DisappearingElementsPage';
import { DragAndDropPage } from '../pages/DragAndDropPage';
import { DropdownPage } from '../pages/DropdownPage';
import { DynamicContentPage } from '../pages/DynamicContentPage';
import { DynamicControlsPage } from '../pages/DynamicControlsPage';
import { DynamicLoadingPage } from '../pages/DynamicLoadingPage';
import { EntryAdPage } from '../pages/EntryAdPage';
import { ExitIntentPage } from '../pages/ExitIntentPage';
import { FileDownloadPage } from '../pages/FileDownloadPage';
import { FileUploadPage } from '../pages/FileUploadPage';
import { FloatingMenuPage } from '../pages/FloatingMenuPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { FormAuthPage } from '../pages/FormAuthPage';
import { FramesPage } from '../pages/FramesPage';
import { GeolocationPage } from '../pages/GeolocationPage';
import { HorizontalSliderPage } from '../pages/HorizontalSliderPage';
import { HoversPage } from '../pages/HoversPage';
import { InfiniteScrollPage } from '../pages/InfiniteScrollPage';
import { InputsPage } from '../pages/InputsPage';
import { JqueryUiMenusPage } from '../pages/JqueryUiMenusPage';
import { JsAlertsPage } from '../pages/JsAlertsPage';
import { JsOnloadErrorPage } from '../pages/JsOnloadErrorPage';
import { KeyPressesPage } from '../pages/KeyPressesPage';
import { LargeDeepDomPage } from '../pages/LargeDeepDomPage';
import { MultipleWindowsPage } from '../pages/MultipleWindowsPage';
import { NestedFramesPage } from '../pages/NestedFramesPage';
import { NotificationMessagesPage } from '../pages/NotificationMessagesPage';
import { RedirectLinkPage } from '../pages/RedirectLinkPage';
import { SecureFileDownloadPage } from '../pages/SecureFileDownloadPage';
import { ShadowDomPage } from '../pages/ShadowDomPage';
import { ShiftingContentPage } from '../pages/ShiftingContentPage';
import { SlowResourcesPage } from '../pages/SlowResourcesPage';
import { SortableDataTablesPage } from '../pages/SortableDataTablesPage';
import { StatusCodesPage } from '../pages/StatusCodesPage';
import { TyposPage } from '../pages/TyposPage';
import { WysiwygEditorPage } from '../pages/WysiwygEditorPage';

function pageObject(this: CustomWorld, pageName: string): any {
  switch (pageName) {
    case "A/B Testing": return new ABTestingPage(this.page);
    case "Add/Remove Elements": return new AddRemoveElementsPage(this.page);
    case "Basic Auth": return new BasicAuthPage(this.page);
    case "Broken Images": return new BrokenImagesPage(this.page);
    case "Challenging DOM": return new ChallengingDomPage(this.page);
    case "Checkboxes": return new CheckboxesPage(this.page);
    case "Context Menu": return new ContextMenuPage(this.page);
    case "Digest Authentication": return new DigestAuthPage(this.page);
    case "Disappearing Elements": return new DisappearingElementsPage(this.page);
    case "Drag and Drop": return new DragAndDropPage(this.page);
    case "Dropdown": return new DropdownPage(this.page);
    case "Dynamic Content": return new DynamicContentPage(this.page);
    case "Dynamic Controls": return new DynamicControlsPage(this.page);
    case "Dynamic Loading": return new DynamicLoadingPage(this.page);
    case "Entry Ad": return new EntryAdPage(this.page);
    case "Exit Intent": return new ExitIntentPage(this.page);
    case "File Download": return new FileDownloadPage(this.page);
    case "File Upload": return new FileUploadPage(this.page);
    case "Floating Menu": return new FloatingMenuPage(this.page);
    case "Forgot Password": return new ForgotPasswordPage(this.page);
    case "Form Authentication": return new FormAuthPage(this.page);
    case "Frames": return new FramesPage(this.page);
    case "Geolocation": return new GeolocationPage(this.page);
    case "Horizontal Slider": return new HorizontalSliderPage(this.page);
    case "Hovers": return new HoversPage(this.page);
    case "Infinite Scroll": return new InfiniteScrollPage(this.page);
    case "Inputs": return new InputsPage(this.page);
    case "JQuery UI Menus": return new JqueryUiMenusPage(this.page);
    case "JavaScript Alerts": return new JsAlertsPage(this.page);
    case "JavaScript onload event error": return new JsOnloadErrorPage(this.page);
    case "Key Presses": return new KeyPressesPage(this.page);
    case "Large & Deep DOM": return new LargeDeepDomPage(this.page);
    case "Multiple Windows": return new MultipleWindowsPage(this.page);
    case "Nested Frames": return new NestedFramesPage(this.page);
    case "Notification Messages": return new NotificationMessagesPage(this.page);
    case "Redirect Link": return new RedirectLinkPage(this.page);
    case "Secure File Download": return new SecureFileDownloadPage(this.page);
    case "Shadow DOM": return new ShadowDomPage(this.page);
    case "Shifting Content": return new ShiftingContentPage(this.page);
    case "Slow Resources": return new SlowResourcesPage(this.page);
    case "Sortable Data Tables": return new SortableDataTablesPage(this.page);
    case "Status Codes": return new StatusCodesPage(this.page);
    case "Typos": return new TyposPage(this.page);
    case "WYSIWYG Editor": return new WysiwygEditorPage(this.page);
    default:
      throw new Error(`No page object registered for: ${pageName}`);
  }
}

function routeForPage(pageName: string): string {
  // Centralized direct-navigation map used by: Given I open the "<Page>" page
  // Keep paths aligned with https://the-internet.herokuapp.com/ endpoints.
  switch (pageName) {
    case 'A/B Testing': return '/abtest';
    case 'Add/Remove Elements': return '/add_remove_elements/';
    case 'Basic Auth': return '/basic_auth';
    case 'Broken Images': return '/broken_images';
    case 'Challenging DOM': return '/challenging_dom';
    case 'Checkboxes': return '/checkboxes';
    case 'Context Menu': return '/context_menu';
    case 'Digest Authentication': return '/digest_auth';
    case 'Disappearing Elements': return '/disappearing_elements';
    case 'Drag and Drop': return '/drag_and_drop';
    case 'Dropdown': return '/dropdown';
    case 'Dynamic Content': return '/dynamic_content';
    case 'Dynamic Controls': return '/dynamic_controls';
    case 'Dynamic Loading': return '/dynamic_loading';
    case 'Entry Ad': return '/entry_ad';
    case 'Exit Intent': return '/exit_intent';
    case 'File Download': return '/download';
    case 'File Upload': return '/upload';
    case 'Floating Menu': return '/floating_menu';
    case 'Forgot Password': return '/forgot_password';
    case 'Form Authentication': return '/login';
    case 'Frames': return '/frames';
    case 'Geolocation': return '/geolocation';
    case 'Horizontal Slider': return '/horizontal_slider';
    case 'Hovers': return '/hovers';
    case 'Infinite Scroll': return '/infinite_scroll';
    case 'Inputs': return '/inputs';
    case 'JQuery UI Menus': return '/jqueryui/menu';
    case 'JavaScript Alerts': return '/javascript_alerts';
    case 'JavaScript onload event error': return '/javascript_error';
    case 'Key Presses': return '/key_presses';
    case 'Large & Deep DOM': return '/large';
    case 'Multiple Windows': return '/windows';
    case 'Nested Frames': return '/nested_frames';
    case 'Notification Messages': return '/notification_message';
    case 'Redirect Link': return '/redirector';
    case 'Secure File Download': return '/download_secure';
    case 'Shadow DOM': return '/shadowdom';
    case 'Shifting Content': return '/shifting_content';
    case 'Slow Resources': return '/slow';
    case 'Sortable Data Tables': return '/tables';
    case 'Status Codes': return '/status_codes';
    case 'Typos': return '/typos';
    case 'WYSIWYG Editor': return '/tinymce';
    default:
      throw new Error(`No direct route registered for page: ${pageName}`);
  }
}

Given('I am on the home page', async function (this: CustomWorld) {
  const home = new HomePage(this.page);
  await home.goto(this.baseUrl);
});

When('I open the {string} example', async function (this: CustomWorld, name: string) {
  const home = new HomePage(this.page);
  await home.openExample(name);
});

Given('I open the {string} page', async function (this: CustomWorld, pageName: string) {
  const path = routeForPage(pageName);
  await this.page.goto(`${this.baseUrl}${path}`);

  // Guardrail: verify the page identity after direct navigation
  const po = pageObject.call(this, pageName);
  await po.assertLoaded();
});

Then('the {string} page should load', async function (this: CustomWorld, pageName: string) {
  const po = pageObject.call(this, pageName);
  await po.assertLoaded();
});

Then('I exercise the {string} page', async function (this: CustomWorld, pageName: string) {
  const po = pageObject.call(this, pageName);
  await po.exercise();
});

Then('the global footer should be valid', async function (this: CustomWorld) {
  const base = new HomePage(this.page); // any BasePage-derived page object works
  await base.assertGlobalFooterPoweredByElementalSelenium();
});
