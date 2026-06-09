import { faker } from '@faker-js/faker';

const PASSWORD_POLICY = {
  length: 12,
};

export interface RegisterUser {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phoneNumber: string;
  companyName: string;
}

export function generateStrongPassword(
  length = PASSWORD_POLICY.length
): string {
  const uppercase =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const lowercase =
    'abcdefghijklmnopqrstuvwxyz';

  const numbers = '0123456789';

  const symbols = '!@#$%^&*';

  const required = [
    faker.helpers.arrayElement(
      uppercase.split('')
    ),
    faker.helpers.arrayElement(
      lowercase.split('')
    ),
    faker.helpers.arrayElement(
      numbers.split('')
    ),
    faker.helpers.arrayElement(
      symbols.split('')
    ),
  ];

  const remaining =
    faker.string.alphanumeric(length - 4);

  return faker.helpers
    .shuffle([
      ...required,
      ...remaining.split(''),
    ])
    .join('');
}

export function createUser(): RegisterUser {
  const password =
    generateStrongPassword();

  return {
    email: `automation_${Date.now()}@mailinator.com`,
    password,
    confirmPassword: password,
    fullName: faker.person.fullName(),
    phoneNumber: `8${faker.string.numeric(10)}`,
    companyName: faker.company.name(),
  };
}