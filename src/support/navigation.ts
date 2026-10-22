import { Frame, Page, Response } from 'playwright';

const TRANSIENT_NETWORK_ERROR =
  /net::ERR_(?:TIMED_OUT|CONNECTION_RESET|CONNECTION_CLOSED|EMPTY_RESPONSE|INTERNET_DISCONNECTED)|NS_ERROR_NET_(?:TIMEOUT|RESET)/;
const FAILED_NAVIGATION_SETTLE_TIMEOUT_MS = 1_000;
const originalGotoByPage = new WeakMap<Page, Page['goto']>();

export function enablePageNavigationRetry(page: Page) {
  const goto = page.goto.bind(page);
  originalGotoByPage.set(page, goto);

  page.goto = async (url, options): Promise<Response | null> => {
    const navigationErrors: Error[] = [];

    for (let attempt = 1; attempt <= 2; attempt += 1) {
      let requestedDocumentCommitted = false;
      let committedResponse: Response | null = null;
      const recordMainFrameCommit = (frame: Frame) => {
        if (frame === page.mainFrame()) requestedDocumentCommitted = true;
      };
      const recordNavigationResponse = (response: Response) => {
        const request = response.request();

        if (request.isNavigationRequest() && request.frame() === page.mainFrame()) {
          committedResponse = response;
        }
      };

      page.on('framenavigated', recordMainFrameCommit);
      page.on('response', recordNavigationResponse);

      try {
        return await goto(url, options);
      } catch (error) {
        const navigationError = asError(error);
        navigationErrors.push(navigationError);

        if (
          requestedDocumentCommitted &&
          navigationError.name === 'TimeoutError' &&
          (await isRequestedDocumentReady(page, url))
        ) {
          return committedResponse;
        }

        if (attempt === 1 && isRetryableNavigationError(navigationError)) {
          await waitForFailedNetworkNavigationToSettle(page, navigationError);
          continue;
        }

        if (navigationErrors.length === 2) {
          throw new Error(
            `Navigation to "${url}" failed twice. First attempt: ${navigationErrors[0].message}. ` +
              `Second attempt: ${navigationErrors[1].message}`
          );
        }

        throw navigationError;
      } finally {
        page.off('framenavigated', recordMainFrameCommit);
        page.off('response', recordNavigationResponse);
      }
    }

    throw new Error(`Navigation to "${url}" exhausted its retry attempts`);
  };
}

export function gotoOnce(
  page: Page,
  url: string,
  options?: Parameters<Page['goto']>[1]
) {
  const goto = originalGotoByPage.get(page) ?? page.goto.bind(page);
  return goto(url, options);
}

export function isRetryableNavigationError(error: Error) {
  return error.name === 'TimeoutError' || TRANSIENT_NETWORK_ERROR.test(error.message);
}

async function waitForFailedNetworkNavigationToSettle(page: Page, error: Error) {
  if (!TRANSIENT_NETWORK_ERROR.test(error.message)) return;

  // Chromium can commit chrome-error:// after goto rejects; let that commit happen
  // before retrying. Other engines may not emit a follow-up navigation at all.
  try {
    await page.waitForEvent('framenavigated', {
      predicate: (frame) => frame === page.mainFrame(),
      timeout: FAILED_NAVIGATION_SETTLE_TIMEOUT_MS,
    });
  } catch (settleError) {
    if (asError(settleError).name !== 'TimeoutError') throw settleError;
  }
}

function asError(error: unknown) {
  return error instanceof Error ? error : new Error(String(error));
}

async function isRequestedDocumentReady(page: Page, requestedUrl: string) {
  if (!isSameDocumentUrl(page.url(), requestedUrl)) return false;

  try {
    const readyState = await page.evaluate(() => document.readyState);
    return readyState === 'interactive' || readyState === 'complete';
  } catch {
    return false;
  }
}

function isSameDocumentUrl(actualUrl: string, requestedUrl: string) {
  try {
    const actual = new URL(actualUrl);
    const requested = new URL(requestedUrl);
    actual.hash = '';
    requested.hash = '';
    return actual.href === requested.href;
  } catch {
    return false;
  }
}
