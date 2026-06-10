import { Page, test } from '@playwright/test';
import dotenv from 'dotenv';

import { createContact } from '../data/contact.data';
import { users } from '../data/users';

import { ContactsPage } from '../pages/contacts.page';
import { LoginPage } from '../pages/login.page';

dotenv.config();

test.describe('All Contacts Module', () => {
  test.setTimeout(60000);

  /**
   * Shared login helper
   *
   * Login dan navigate ke Contacts page.
   */
  async function loginAndGo(
    page: Page
  ): Promise<ContactsPage> {
    const loginPage = new LoginPage(page);
    const contactsPage = new ContactsPage(page);

    await loginPage.goto();

    await loginPage.login(
      users.valid.email,
      users.valid.password
    );

    await contactsPage.goToAllContacts();

    return contactsPage;
  }

  /**
   * TC_CONTACT_001
   *
   * Verify user can create contact successfully.
   */
  test(
    'TC_CONTACT_001 - Positive - Create Contact Successfully @Contacts @Positive @Smoke @Regression',
    async ({ page }) => {
      const contactsPage =
        await loginAndGo(page);

      const contactData =
        createContact();

      await contactsPage.openCreateContactForm();

      await contactsPage.fillContactForm(
        contactData
      );

      await contactsPage.createContact();
    }
  );

  /**
   * TC_CONTACT_002
   *
   * Verify user can edit contact successfully.
   */
  test(
    'TC_CONTACT_002 - Positive - Edit Contact Successfully @Contacts @Positive @Regression',
    async ({ page }) => {
      const contactsPage =
        await loginAndGo(page);

      const contactData =
        createContact();

      await contactsPage.openCreateContactForm();

      await contactsPage.fillContactForm(
        contactData
      );

      await contactsPage.createContact();

      await contactsPage.editFirstContact(
        `${contactData.name} EDIT`
      );
    }
  );

  /**
   * TC_CONTACT_003
   *
   * Verify user can delete contact successfully.
   */
  test(
    'TC_CONTACT_003 - Positive - Delete Contact Successfully @Contacts @Positive @Regression',
    async ({ page }) => {
      const contactsPage =
        await loginAndGo(page);

      const contactData =
        createContact();

      await contactsPage.openCreateContactForm();

      await contactsPage.fillContactForm(
        contactData
      );

      await contactsPage.createContact();

      await contactsPage.deleteFirstContact();
    }
  );
});