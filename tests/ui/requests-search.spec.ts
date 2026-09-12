import { expect, test } from '../../playwright/fixtures/test.ts';

test.describe('Demo application - searching and filtering requests', () => {
  test.beforeEach(async ({ requestsPage }) => {
    await requestsPage.goto();
    await expect(requestsPage.heading).toBeVisible();
  });

  test('the unfiltered list shows every request', async ({ requestsPage }) => {
    // Asserting the count from the page's own live region rather than a
    // hard-coded total keeps the test honest about what the user is told.
    await expect(requestsPage.resultCount).toHaveText(/\d+ requests found/);
    await expect(requestsPage.rows).not.toHaveCount(0);
  });

  test('searching by title narrows the list to matching requests', async ({ requestsPage }) => {
    await requestsPage.searchFor('reporting');

    await expect(requestsPage.rows).toHaveCount(2);
    await expect(requestsPage.rows.first()).toContainText('reporting workspace');
    await expect(requestsPage.emptyState).toBeHidden();
  });

  test('searching by request id finds a single request', async ({ requestsPage }) => {
    await requestsPage.searchFor('REQ-1004');

    await expect(requestsPage.rows).toHaveCount(1);
    await expect(requestsPage.rows.first()).toContainText('Scheduled maintenance window');
    await expect(requestsPage.resultCount).toHaveText('1 request found');
  });

  test('the category filter combines with the search term', async ({ requestsPage }) => {
    await requestsPage.filterByCategory('Access');

    const accessRows = requestsPage.rows;
    await expect(accessRows).toHaveCount(2);

    await requestsPage.searchFor('Revoke');

    await expect(requestsPage.rows).toHaveCount(1);
    await expect(requestsPage.rows.first()).toContainText('Revoke access');
  });

  test('a search with no matches shows an empty state instead of an empty table', async ({
    requestsPage,
  }) => {
    await requestsPage.searchFor('nothing matches this text');

    await expect(requestsPage.emptyState).toBeVisible();
    await expect(requestsPage.resultCount).toHaveText('0 requests found');
    await expect(requestsPage.rows).toHaveCount(0);
  });
});
