/**
 * Negative test data for Register Module
 */
export const registerNegativeData = {
  // Step 1 - Account Information

  invalidEmail: {
    email: 'invalid-email',
    password: 'Testing123!',
    confirmPassword: 'Testing123!',
  },

  invalidPassword: {
    email: 'test@mail.com',
    password: '123',
    confirmPassword: '123',
  },

  passwordMismatch: {
    email: 'test@mail.com',
    password: 'Testing123!',
    confirmPassword: 'Testing456!',
  },

  multipleValidation: {
    email: 'invalid-email',
    password: '123',
    confirmPassword: '456',
  },

  // Step 2 - User Information

  invalidFullName: {
    fullName: 'A',
    phoneNumber: '81234567890',
  },

  invalidPhoneNumber: {
    fullName: 'Testing User',
    phoneNumber: '123',
  },
} as const;