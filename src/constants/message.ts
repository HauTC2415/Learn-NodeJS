const USER_MESSAGES = {
  NOT_FOUND: 'User not found',
  ALREADY_EXISTS: 'User already exists',
  REGISTERED: 'registered successfully',
  REGISTERED_FAILED: 'User registration failed',
  LOGGED_IN: 'User logged in',
  LOGGED_IN_FAILED: 'User login failed',
  LOGGED_OUT: 'User logged out',
  LOGGED_OUT_FAILED: 'User logout failed',
  UNPROCESSABLE_ENTITY: 'Unprocessable entity',
  DATE_OF_BIRTH_INVALID: 'Date of birth is invalid, please must be in ISO8601 format',
  PASSWORD_NOT_MATCH: 'Passwords do not match',
  STRONG_PASSWORD:
    'Password must be at least 6 characters long, and contain at least one lowercase letter, one uppercase letter, one number, and one special character',
  EMAIL_INVALID: 'Email is invalid',
  NAME_IS_REQUIRED: 'Name is required'
} as const

export default USER_MESSAGES
