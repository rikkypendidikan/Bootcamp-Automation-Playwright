import { faker } from '@faker-js/faker';

function generateStrongPassword(length = 12): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*';

  const required = [
    faker.helpers.arrayElement(uppercase.split('')),
    faker.helpers.arrayElement(lowercase.split('')),
    faker.helpers.arrayElement(numbers.split('')),
    faker.helpers.arrayElement(symbols.split('')),
  ];

  const remaining = faker.string.alphanumeric(length - 4);

  return faker.helpers
    .shuffle([...required, ...remaining.split('')])
    .join('');
}

export function createUser() {
  const password = generateStrongPassword();

  return {
    email: faker.internet.email(),
    password,
    confirmPassword: password,
    fullName: faker.person.fullName(),
    phoneNumber: `8${faker.string.numeric(10)}`,
    companyName: faker.company.name(),
  };
}