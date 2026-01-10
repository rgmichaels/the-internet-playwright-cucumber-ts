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

Given('I am on the home page', async function (this: CustomWorld) {
  const home = new HomePage(this.page);
  await home.goto(this.baseUrl);
});

When('I open the {string} example', async function (this: CustomWorld, name: string) {
  const home = new HomePage(this.page);
  await home.openExample(name);
});

Then('the {string} page should load', async function (this: CustomWorld, pageName: string) {
  const po = pageObject.call(this, pageName);
  await po.assertLoaded();
});

Then('I exercise the {string} page', async function (this: CustomWorld, pageName: string) {
  const po = pageObject.call(this, pageName);
  await po.exercise();
});
