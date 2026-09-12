import { expect, test } from '../../playwright/fixtures/test.ts';

test.describe('Demo application - registration form validation', () => {
  test.beforeEach(async ({ registerPage }) => {
    await registerPage.goto();
  });

  test('an empty submission reports every required field', async ({ registerPage }) => {
    await registerPage.submitButton.click();

    await expect(registerPage.fieldError('fullName')).toHaveText('Full name is required.');
    await expect(registerPage.fieldError('email')).toHaveText('Email address is required.');
    await expect(registerPage.fieldError('department')).toHaveText('Select a department.');
    await expect(registerPage.fieldError('confirmed')).toHaveText(
      'Confirm that this is demo data.',
    );
    await expect(registerPage.successMessage).toBeHidden();
  });

  test('a malformed email address is rejected while the other fields pass', async ({
    registerPage,
  }) => {
    await registerPage.fill({
      fullName: 'Alex Beispiel',
      email: 'alex.beispiel.example.org',
      department: 'Engineering',
      confirm: true,
    });
    await registerPage.submitButton.click();

    await expect(registerPage.fieldError('email')).toHaveText(
      'Enter a valid email address, for example name@example.org.',
    );
    await expect(registerPage.fieldError('fullName')).toBeHidden();
    await expect(registerPage.successMessage).toBeHidden();
  });

  test('an unchecked confirmation blocks an otherwise valid submission', async ({
    registerPage,
  }) => {
    await registerPage.fill({
      fullName: 'Alex Beispiel',
      email: 'alex.beispiel@example.org',
      department: 'Engineering',
      confirm: false,
    });
    await registerPage.submitButton.click();

    await expect(registerPage.fieldError('confirmed')).toHaveText(
      'Confirm that this is demo data.',
    );
    await expect(registerPage.successMessage).toBeHidden();
  });

  test('a complete submission is accepted and confirmed to the user', async ({ registerPage }) => {
    await registerPage.fill({
      fullName: 'Alex Beispiel',
      email: 'alex.beispiel@example.org',
      department: 'Engineering',
      confirm: true,
    });
    await registerPage.submitButton.click();

    await expect(registerPage.successMessage).toHaveText(
      'Registration submitted for Alex Beispiel.',
    );
    // The form resets, so the next entry does not start from stale values.
    await expect(registerPage.fullName).toHaveValue('');
  });
});
