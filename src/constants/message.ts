const USER_MESSAGES = {
  NOT_FOUND: 'User not found',
  ALREADY_EXISTS: 'User already exists',
  REGISTERED: 'registered successfully',
  REGISTERED_FAILED: 'User registration failed',
  LOGGED_IN: 'User logged in, successfully!',
  LOGGED_IN_FAILED: 'User login failed',
  LOGGED_OUT: 'User logged out, logged out successfully!',
  LOGGED_OUT_FAILED: 'User logout failed',
  UNPROCESSABLE_ENTITY: 'Unprocessable entity',
  DATE_OF_BIRTH_INVALID: 'Date of birth is invalid, please must be in ISO8601 format',
  PASSWORD_NOT_MATCH: 'Passwords do not match',
  STRONG_PASSWORD:
    'Password must be at least 6 characters long, and contain at least one lowercase letter, one uppercase letter, one number, and one special character',
  PASSWORD_FROM_6_TO_50: 'Password must be at least 6 characters long and at most 50 characters long',
  EMAIL_INVALID_FORMAT: 'Email must be a valid email address',
  NAME_IS_REQUIRED: 'Name is required',
  EMAIL_IS_REQUIRED: 'Email is required',
  TRIM_NAME: 'Name must not have leading or trailing whitespace',
  TRIM_EMAIL: 'Email must not have leading or trailing whitespace',
  PASSWORD_IS_REQUIRED: 'Password is required',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  NAME_FROM_1_TO_100: 'Name must be at least 1 character long and at most 100 characters long',
  EMAIL_PASSWORD_INCORRECT: 'Email or password is incorrect',
  INVALID_ACCESS_TOKEN: 'Invalid access token, is not jwt token or expired',
  ACCESS_TOKEN_REQUIRED: 'Access token is required',
  REFRESH_TOKEN_REQUIRED: 'Refresh token is required',
  USED_REFRESH_TOKEN_OR_NOT_FOUND: 'Used refresh token or not found',
  REFRESH_TOKEN_INVALID: 'Refresh token is invalid, is not jwt token or expired',
  REFRESH_TOKEN_SUCCESS: 'Refresh token successfully',
  EMAIL_VERIFY_TOKEN_REQUIRED: 'Email verify token is required',
  EMAIL_VERIFY_TOKEN_SUCCESS: 'Email verify token successfully',
  EMAIL_VERIFIED_BEFORE: 'Email has been verified before',
  RESEND_VERIFY_EMAIL_SUCCESS: 'Resend verify email successfully',
  EMAIL_NOT_FOUND: 'Email not found',
  CHECK_EMAIL_TO_RESET_PASSWORD: 'Check your email to reset password',
  FORGOT_PASSWORD_TOKEN_REQUIRED: 'Forgot password token is required',
  INVALID_FORGOT_PASSWORD_TOKEN: 'Invalid forgot password token, is not jwt token or expired',
  VERIFY_FORGOT_PASSWORD_TOKEN_SUCCESS: 'Verify forgot password token successfully',
  RESET_PASSWORD_SUCCESS: 'Reset password successfully',
  USER_NOT_VERIFIED: 'User is not verified',
  SUCCESS: 'Success',
  MUST_BE_STRING: 'Must be a string',
  LENGTH_FROM_1_TO_200: 'Length must be at least 1 character long and at most 200 characters long',
  LENGTH_FROM_1_TO_400: 'Length must be at least 1 character long and at most 400 characters long',
  LENGTH_FROM_1_TO_50: 'Length must be at least 1 character long and at most 50 characters long',
  FOLLOWED_USER_ID_REQUIRED: 'Followed user id is required',
  USER_IS_FOLLOWED_BEFORE: 'User is followed before',
  USER_FOLLOW_NOT_FOUND: 'User follow not found',
  INVALID_FOLLOW_USER_ID: 'Invalid follow user id',
  USER_IS_NOT_FOLLOWED_BEFORE: 'User is not followed before',
  UNFOLLOW_SUCCESS: 'Unfollow successfully',
  INVALID_USERNAME: 'Invalid username',
  INVALID_REQUEST: 'Invalid request, Can 1 field or more is invalid',
  OLD_PASSWORD_INCORRECT: 'Old password is incorrect',
  OLD_PASSWORD_NOT_MATCH: 'Old password does not match',
  GMAIL_NOT_VERIFIED: 'Gmail is not verified'
} as const

export default USER_MESSAGES
