import { APIResponse, Download, Locator, Page, Response, Route } from 'playwright';

type ObservedDownload = {
  download: Download;
  downloadResponse: Response;
  responseBody: Buffer;
};

export async function downloadWithObservedResponse(
  page: Page,
  locator: Locator,
  url: string
): Promise<ObservedDownload> {
  let responseBody: Buffer | undefined;
  let captureError: Error | undefined;

  const captureResponse = async (route: Route) => {
    let upstreamResponse: APIResponse | undefined;

    try {
      upstreamResponse = await route.fetch();
      responseBody = await upstreamResponse.body();
      await route.fulfill({ response: upstreamResponse, body: responseBody });
    } catch (error) {
      captureError = error instanceof Error ? error : new Error(String(error));
      await route.abort().catch(() => {});
    } finally {
      await upstreamResponse?.dispose();
    }
  };

  await page.route(url, captureResponse);

  try {
    let download: Download;
    let downloadResponse: Response;

    try {
      [download, downloadResponse] = await Promise.all([
        page.waitForEvent('download', { timeout: 20_000 }),
        page.waitForResponse(
          (response) => response.request().method() === 'GET' && response.url() === url,
          { timeout: 20_000 }
        ),
        locator.click(),
      ]);
    } catch (error) {
      if (captureError) {
        throw captureError;
      }
      throw error;
    }

    if (captureError) {
      throw captureError;
    }
    if (!responseBody) {
      throw new Error(`Browser download response body was not captured for ${url}`);
    }

    return { download, downloadResponse, responseBody };
  } finally {
    await page.unroute(url, captureResponse);
  }
}
