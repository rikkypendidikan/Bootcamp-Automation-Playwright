import { test } from '@playwright/test';
import dotenv from 'dotenv';

import { LoginPage } from '../pages/login.page';
import { ContactsPage } from '../pages/contacts.page';
import { users } from '../data/users';
import { createContact } from '../data/contact.data';

dotenv.config();

test.describe('All Contacts Module', () => {
  test.setTimeout(60000);

  test('TC_CONTACT_001 - Create Contact Successfully @Contacts @Positive @Smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const contactsPage = new ContactsPage(page);

    // generate dynamic test data
    const contactData = createContact();

    // 1. Login
    await loginPage.goto();
    await loginPage.login(users.valid.email, users.valid.password);

    // 2. Go to All Contacts page
    await contactsPage.goToAllContacts();

    // 3. Open create contact form
    await contactsPage.openCreateContactForm();

    // 4. Fill form with faker data
    await contactsPage.fillContactForm(contactData);

    // 5. Submit contact
    await contactsPage.createContact();

    // 6. Verify success state
    await contactsPage.verifyContactCreated();
  });
});