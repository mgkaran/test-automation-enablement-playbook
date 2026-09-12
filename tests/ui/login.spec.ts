import { expect, test } from '../../playwright/fixtures/test.ts';
import { getInvalidCredentials } from '../../playwright/utils/config.ts';

test.describe('Demo application - sign in', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('a user with valid credentials reaches the dashboard', async ({
    page,
    loginPage,
    dashboardPage,
    credentials,
  }) => {
    await loginPage.login(credentials.username, credentials.password);

    // Synchronise on the state that means "signed in", not on a timeout.
    await expect(dashboardPage.heading).toBeVisible();
    await expect(dashboardPage.signedInUser).not.toBeEmpty();
    await expect(page).toHaveURL(/\/demo\/dashboard$/);
  });

  test('invalid credentials are rejected with a visible error', async ({
    page,
    loginPage,
    dashboardPage,
  }) => {
    const invalid = getInvalidCredentials();

    await loginPage.login(invalid.username, invalid.password);

    await expect(loginPage.errorMessage).toHaveText('Invalid username or password.');
    // The negative assertion matters as much as the positive one: a wrong
    // password must not result in a session.
    await expect(dashboardPage.heading).toBeHidden();
    await expect(page).toHaveURL(/\/demo\/login$/);
  });

  test('submitting an empty form reports both required fields', async ({ loginPage }) => {
    await loginPage.loginButton.click();

    await expect(loginPage.fieldError('username')).toHaveText('Username is required.');
    await expect(loginPage.fieldError('password')).toHaveText('Password is required.');
    await expect(loginPage.errorMessage).toBeHidden();
  });
});
