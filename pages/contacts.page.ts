import { expect, Locator, Page } from '@playwright/test';

/**
 * All Contacts Page Object Model
 * Stable + maintainable version
 */
export class ContactsPage {
  readonly page: Page;

  // Navigation
  readonly contactsMenu: Locator;
  readonly allContactsMenu: Locator;

  // Actions
  readonly addContactButton: Locator;
  readonly createContactButton: Locator;

  // Form fields
  readonly nameInput: Locator;
  readonly primaryEmailInput: Locator;
  readonly primaryPhoneInput: Locator;
  readonly additionalPhoneInput: Locator;
  readonly additionalEmailInput: Locator;
  readonly tagsInput: Locator;

  // Success UI
  readonly contactsSubtitle: Locator;

  constructor(page: Page) {
    this.page = page;

    // Navigation
    this.contactsMenu = page.getByRole('button', { name: 'Contacts' });
    this.allContactsMenu = page.getByRole('button', { name: 'All Contacts' });

    // Actions
    this.addContactButton = page.getByRole('button', { name: 'Add Contact' });
    this.createContactButton = page.getByRole('button', { name: 'Create Contact' });

    // Form fields
    this.nameInput = page.getByRole('textbox', { name: 'Name' });
    this.primaryEmailInput = page.getByRole('textbox', { name: 'Primary Email' });
    this.primaryPhoneInput = page.getByRole('textbox', { name: 'Primary Phone *' });
    this.additionalPhoneInput = page.getByRole('textbox', { name: 'Add phone number' });
    this.additionalEmailInput = page.getByRole('textbox', { name: 'Add email address' });
    this.tagsInput = page.getByRole('textbox', { name: 'Add tags...' });

    // Success indicator (Contacts page subtitle)
    this.contactsSubtitle = page.locator(
      'p.text-foreground\\/60.mt-1',
      {
        hasText: 'Manage your customer contacts and segments',
      }
    );
  }

  /**
   * Navigate to All Contacts
   */
  async goToAllContacts() {
    await this.contactsMenu.click();
    await this.allContactsMenu.click();
  }

  /**
   * Open create contact modal
   */
  async openCreateContactForm() {
    await this.addContactButton.click();

    // ensure form ready
    await expect(this.nameInput).toBeVisible({ timeout: 15000 });
    await expect(this.primaryEmailInput).toBeVisible({ timeout: 15000 });
  }

  /**
   * Fill contact form
   */
  async fillContactForm(data: {
    name: string;
    primaryEmail: string;
    primaryPhone: string;
    additionalPhone: string;
    additionalEmail: string;
    tags: string;
  }) {
    await this.nameInput.waitFor({ state: 'visible' });
    await this.primaryEmailInput.waitFor({ state: 'visible' });

    await this.nameInput.fill(data.name);
    await this.primaryEmailInput.fill(data.primaryEmail);
    await this.primaryPhoneInput.fill(data.primaryPhone);
    await this.additionalPhoneInput.fill(data.additionalPhone);
    await this.additionalEmailInput.fill(data.additionalEmail);

    await this.tagsInput.fill(data.tags);
    await this.tagsInput.press('Enter');
  }

  /**
   * Submit contact
   */
  async createContact() {
    await this.createContactButton.click();
  }

  /**
   * Verify success state
   */
  async verifyContactCreated() {
    await expect(this.contactsSubtitle).toBeVisible({ timeout: 15000 });
  }
}