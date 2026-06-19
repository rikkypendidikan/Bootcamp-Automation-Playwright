import { test, expect } from '../fixtures/agentq.fixture';
import { Page } from '@playwright/test';
import { createContact } from '../data/contact.data';
import { users } from '../utils/users';
import { ContactsPage } from '../pages/contacts.page';
import { LoginPage } from '../pages/login.page';

test.describe('Contacts Module', () => {

  test.setTimeout(60000);

  /**
   * Helper login reusable
   */
  async function loginAndGo(page: Page): Promise<ContactsPage> {
    const loginPage = new LoginPage(page);
    const contactsPage = new ContactsPage(page);

    await loginPage.goto();
    await loginPage.login(users.valid.email, users.valid.password);

    await contactsPage.goToAllContacts();

    return contactsPage;
  }

  test(
    'TC_CONTACT_001 - Positive - Create Contact Successfully @Contacts @Positive @Smoke @Regression',
    async ({ page }) => {

      const contactsPage = await loginAndGo(page);
      const contact = createContact();

      await contactsPage.openCreateContactForm();
      await contactsPage.fillContactForm(contact);
      await contactsPage.createContact();

      await expect(contactsPage.contactsSubtitle).toBeVisible();
    }
  );

  test(
    'TC_CONTACT_002 - Positive - Edit Contact Successfully @Contacts @Positive @Regression',
    async ({ page }) => {

      const contactsPage = await loginAndGo(page);
      const contact = createContact();

      await contactsPage.openCreateContactForm();
      await contactsPage.fillContactForm(contact);
      await contactsPage.createContact();

      await contactsPage.editFirstContact(`${contact.name} EDIT`);

      await expect(contactsPage.contactsSubtitle).toBeVisible();
    }
  );

  test(
    'TC_CONTACT_003 - Positive - Delete Contact Successfully @Contacts @Positive @Regression',
    async ({ page }) => {

      const contactsPage = await loginAndGo(page);
      const contact = createContact();

      await contactsPage.openCreateContactForm();
      await contactsPage.fillContactForm(contact);
      await contactsPage.createContact();

      await contactsPage.deleteFirstContact();

      await expect(contactsPage.contactsSubtitle).toBeVisible();
    }
  );

});