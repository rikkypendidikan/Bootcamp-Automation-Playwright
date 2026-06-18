import { faker } from '@faker-js/faker';

/**
 * =========================
 * CONTACT DATA GENERATOR
 * =========================
 * Semua data dibuat dynamic agar:
 * - Tidak duplicate saat parallel test
 * - Lebih realistis seperti data production
 * - Tidak bergantung pada static value
 */

export interface ContactData {
  name: string;
  primaryEmail: string;
  primaryPhone: string;
  additionalPhone: string;
  additionalEmail: string;
  tags: string;
}

export function createContact(): ContactData {
  const name = faker.person.fullName();

  return {
    name,

    // Email utama contact
    primaryEmail: faker.internet.email(),

    // Format nomor Indonesia (08xxxxxxxxxx)
    primaryPhone: `08${faker.string.numeric(10)}`,

    // Data tambahan contact
    additionalPhone: `08${faker.string.numeric(10)}`,
    additionalEmail: faker.internet.email(),

    // Tags digunakan untuk segmentasi contact
    tags: faker.word.sample(),
  };
}