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
    this.contactsMenu = page.getByRole('button', { name: 'Contacts' });
    this.allContactsMenu = page.getByRole('button', { name: 'All Contacts' });

    // Actions
    this.addContactButton = page.getByRole('button', { name: 'Add Contact' });
    this.createContactButton = page.getByRole('button', { name: 'Create Contact' });

    // Form (STABLE)
    this.nameInput = page.getByRole('textbox', { name: 'Name' });
    this.primaryEmailInput = page.getByRole('textbox', { name: 'Primary Email' });
    this.primaryPhoneInput = page.getByRole('textbox', { name: 'Primary Phone *' });
    this.additionalPhoneInput = page.getByRole('textbox', { name: 'Add phone number' });
    this.additionalEmailInput = page.getByRole('textbox', { name: 'Add email address' });
    this.tagsInput = page.getByRole('textbox', { name: 'Add tags...' });

    // Indicator halaman
    this.contactsSubtitle = page.locator('p.text-foreground\\/60.mt-1', {
      hasText: 'Manage your customer contacts and segments',
    });
  }

  // =========================
  // Navigation Methods
  // =========================
  async goToAllContacts() {
    await this.contactsMenu.click();
    await this.allContactsMenu.click();
    await this.verifyContactsPageLoaded();
  }

  // =========================
  // Create Contact
  // =========================
  async openCreateContactForm() {
    await this.addContactButton.click();

    await expect(this.nameInput).toBeVisible({ timeout: 15000 });
    await expect(this.primaryEmailInput).toBeVisible({ timeout: 15000 });
  }

  async fillContactForm(data: ContactFormData) {
    await this.nameInput.fill(data.name);
    await this.primaryEmailInput.fill(data.primaryEmail);
    await this.primaryPhoneInput.fill(data.primaryPhone);
    await this.additionalPhoneInput.fill(data.additionalPhone);
    await this.additionalEmailInput.fill(data.additionalEmail);

    await this.tagsInput.fill(data.tags);
    await this.tagsInput.press('Enter');
  }

  async createContact() {
    await this.createContactButton.click();
    await this.verifyContactsPageLoaded();
  }

  // =========================
  // Helpers Table
  // =========================
  private firstRow() {
    return this.page.locator('tbody tr').first();
  }

  // =========================
  // EDIT FLOW (FIXED REAL UI)
  // =========================
  async editFirstContact(updatedName: string) {
    const row = this.firstRow();

    await expect(row).toBeVisible({ timeout: 15000 });

    // klik row action button
    const actionButton = this.page
      .getByRole('button')
      .filter({ hasText: /^$/ })
      .first();

    await expect(actionButton).toBeVisible({ timeout: 10000 });
    await actionButton.click();

    // masuk detail page
    await expect(this.page.getByText('Contact Details')).toBeVisible({
      timeout: 15000,
    });

    // masuk edit mode
    await this.page.getByRole('button', { name: 'Edit Contact' }).click();

    await expect(
      this.page.getByRole('heading', { name: 'Edit Contact' })
    ).toBeVisible({ timeout: 15000 });

    // edit field
    const nameField = this.page.getByRole('textbox', { name: 'Name' });

    await expect(nameField).toBeVisible({ timeout: 15000 });

    await nameField.fill('');
    await nameField.fill(updatedName);

    await this.page.getByRole('button', { name: 'Save Changes' }).click();

    await this.page.getByRole('button', { name: 'Back to Contacts' }).click();

    await this.verifyContactsPageLoaded();
  }

  // =========================
  // DELETE FLOW (FIXED REAL UI)
  // =========================
  async deleteFirstContact() {
    const row = this.firstRow();

    await expect(row).toBeVisible({ timeout: 15000 });

    // klik action button (ikon kosong)
    const actionButton = this.page
      .getByRole('button')
      .filter({ hasText: /^$/ })
      .first();

    await expect(actionButton).toBeVisible({ timeout: 10000 });
    await actionButton.click();

    // handle native dialog confirm
    this.page.once('dialog', async dialog => {
      await dialog.accept();
    });

    // klik delete
    await this.page.getByRole('button', { name: 'Delete' }).click();

    // kembali ke list
    await this.page.goto('/contacts');

    await this.verifyContactsPageLoaded();
  }

  // =========================
  // Assertions
  // =========================
  async verifyContactsPageLoaded() {
    await expect(this.contactsSubtitle).toBeVisible({ timeout: 15000 });
  }
}