export const registerNegativeData = {
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

  invalidFullName: {
    fullName: 'A',
    phoneNumber: '81234567890',
  },

  invalidPhoneNumber: {
    fullName: 'Testing User',
    phoneNumber: '123',
  },
};