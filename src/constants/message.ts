const USER_MESSAGES = {
  USER_NOT_FOUND: 'User not found',
  USER_ALREADY_EXISTS: 'User already exists',
  USER_REGISTERED: 'registered successfully',
  USER_REGISTERED_FAILED: 'User registration failed',
  USER_LOGGED_IN: 'User logged in',
  USER_LOGGED_IN_FAILED: 'User login failed',
  USER_LOGGED_OUT: 'User logged out',
  USER_LOGGED_OUT_FAILED: 'User logout failed',
  USER_UNPROCESSABLE_ENTITY: 'Unprocessable entity',
  USER_DATE_OF_BIRTH_INVALID: 'Date of birth is invalid, please must be in ISO8601 format',
  USER_PASSWORD_NOT_MATCH: 'Passwords do not match',
  USER_STRONG_PASSWORD:
    'Password must be at least 6 characters long, and contain at least one lowercase letter, one uppercase letter, one number, and one special character',
  USER_EMAIL_INVALID: 'Email is invalid',
  USER_NAME_IS_REQUIRED: 'Name is required'
} as const

export default USER_MESSAGES
