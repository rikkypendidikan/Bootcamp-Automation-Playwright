import { expect, Locator, Page } from '@playwright/test';

export interface ContactFormData {
  name: string;
  primaryEmail: string;
  primaryPhone: string;
  additionalPhone: string;
  additionalEmail: string;
  tags: string;
}

/**
 * Contacts Page Object Model
 *
 * Coverage:
 * - Navigate to Contacts
 * - Create Contact
 * - Edit Contact
 * - Delete Contact
 */
export class ContactsPage {
  readonly page: Page;

  // =========================
  // Navigation
  // =========================

  readonly contactsMenu: Locator;
  readonly allContactsMenu: Locator;

  // =========================
  // Actions
  // =========================

  readonly addContactButton: Locator;
  readonly createContactButton: Locator;

  // =========================
  // Contact Form
  // =========================

  readonly nameInput: Locator;
  readonly primaryEmailInput: Locator;
  readonly primaryPhoneInput: Locator;
  readonly additionalPhoneInput: Locator;
  readonly additionalEmailInput: Locator;
  readonly tagsInput: Locator;

  // =========================
  // Page Indicators
  // =========================

  readonly contactsSubtitle: Locator;

  constructor(page: Page) {
    this.page = page;

    // Navigation
    this.contactsMenu = page.getByRole('button', {
      name: 'Contacts',
    });

    this.allContactsMenu = page.getByRole('button', {
      name: 'All Contacts',
    });

    // Actions
    this.addContactButton = page.getByRole('button', {
      name: 'Add Contact',
    });

    this.createContactButton = page.getByRole('button', {
      name: 'Create Contact',
    });

    // Contact Form
    this.nameInput = page.getByRole('textbox', {
      name: 'Name',
    });

    this.primaryEmailInput = page.getByRole('textbox', {
      name: 'Primary Email',
    });

    this.primaryPhoneInput = page.getByRole('textbox', {
      name: 'Primary Phone *',
    });

    this.additionalPhoneInput = page.getByRole('textbox', {
      name: 'Add phone number',
    });

    this.additionalEmailInput = page.getByRole('textbox', {
      name: 'Add email address',
    });

    this.tagsInput = page.getByRole('textbox', {
      name: 'Add tags...',
    });

    // Success Indicator
    this.contactsSubtitle = page.locator(
      'p.text-foreground\\/60.mt-1',
      {
        hasText:
          'Manage your customer contacts and segments',
      }
    );
  }

  // =========================
  // Navigation Methods
  // =========================

  /**
   * Navigate to All Contacts page
   */
  async goToAllContacts() {
    await this.contactsMenu.click();
    await this.allContactsMenu.click();

    await this.verifyContactsPageLoaded();
  }

  // =========================
  // Create Contact
  // =========================

  /**
   * Open Create Contact modal
   */
  async openCreateContactForm() {
    await this.addContactButton.click();

    await this.nameInput.waitFor({
      state: 'visible',
      timeout: 15000,
    });

    await this.primaryEmailInput.waitFor({
      state: 'visible',
      timeout: 15000,
    });
  }

  /**
   * Populate Contact form
   */
  async fillContactForm(
    data: ContactFormData
  ) {
    await expect(this.nameInput).toBeVisible();

    await this.nameInput.fill(data.name);
    await this.primaryEmailInput.fill(
      data.primaryEmail
    );

    await this.primaryPhoneInput.fill(
      data.primaryPhone
    );

    await this.additionalPhoneInput.fill(
      data.additionalPhone
    );

    await this.additionalEmailInput.fill(
      data.additionalEmail
    );

    await this.tagsInput.fill(data.tags);
    await this.tagsInput.press('Enter');
  }

  /**
   * Submit Create Contact form
   */
  async createContact() {
    await this.createContactButton.click();

    await this.verifyContactsPageLoaded();
  }

  // =========================
  // Edit Contact
  // =========================

  /**
   * Edit first contact displayed in table
   */
  async editFirstContact(
    updatedName: string
  ) {
    const editButton = this.page
      .getByRole('button')
      .filter({ hasText: /^$/ })
      .nth(1);

    await editButton.click();

    await this.nameInput.waitFor({
      state: 'visible',
    });

    await this.nameInput.fill(updatedName);

    await this.page
      .getByRole('button', {
        name: 'Save Changes',
      })
      .click();

    await this.page
      .getByRole('button', {
        name: 'Back to Contacts',
      })
      .click();

    await this.verifyContactsPageLoaded();
  }

  // =========================
  // Delete Contact
  // =========================

  /**
   * Delete first contact displayed in table
   */
  async deleteFirstContact() {
    const deleteButton = this.page
      .getByRole('button')
      .filter({ hasText: /^$/ })
      .first();

    this.page.once(
      'dialog',
      async dialog => {
        await dialog.accept();
      }
    );

    await deleteButton.click();

    await this.page
      .getByRole('button', {
        name: 'Delete',
      })
      .click();

    await this.page.goto(
      'https://www.emra.chat/contacts'
    );

    await this.verifyContactsPageLoaded();
  }

  // =========================
  // Assertions
  // =========================

  /**
   * Verify Contacts page loaded successfully
   */
  async verifyContactsPageLoaded() {
    await expect(
      this.contactsSubtitle
    ).toBeVisible({
      timeout: 15000,
    });
  }
}