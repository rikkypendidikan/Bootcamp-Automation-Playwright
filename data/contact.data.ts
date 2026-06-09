import { faker } from '@faker-js/faker';

/**
 * Generate test data untuk Contact module
 * Semua data dibuat dynamic agar tidak duplicate saat test berjalan paralel
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
    primaryEmail: faker.internet.email(),
    primaryPhone: `08${faker.string.numeric(10)}`,
    additionalPhone: `08${faker.string.numeric(10)}`,
    additionalEmail: faker.internet.email(),
    tags: faker.word.sample(),
  };
}