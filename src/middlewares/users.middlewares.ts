import { checkSchema } from 'express-validator'
import HTTP_STATUS from '~/constants/httpStatus'
import USER_MESSAGES from '~/constants/message'
import { DefaultError } from '~/models/Errors'
import usersService from '~/services/users.services'
import { validate } from '~/utils/validation'

export const loginValidator = validate(
  checkSchema({
    email: {
      notEmpty: {
        errorMessage: 'Email is required'
      },
      isEmail: {
        errorMessage: 'Email must be a valid email address'
      },
      trim: true
    },
    password: {
      notEmpty: true,
      isString: true,
      isLength: {
        options: { min: 6, max: 50 },
        errorMessage: 'Password must be at least 6 characters long and at most 50 characters long'
      },
      isStrongPassword: {
        options: {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
        },
        errorMessage:
          'Password must be at least 6 characters long, and contain at least one lowercase letter, one uppercase letter, one number, and one special character'
      }
    }
  })
)

// validate the request body use "express-validator"
export const registerValidator = validate(
  checkSchema({
    name: {
      notEmpty: {
        errorMessage: USER_MESSAGES.NAME_IS_REQUIRED
      },
      isLength: {
        options: { min: 1, max: 100 }
      },
      trim: true,
      isString: true
    },
    email: {
      notEmpty: true,
      isEmail: true,
      trim: true,
      custom: {
        options: async (value) => {
          const isExist = await usersService.checkEmailExist(value)
          if (isExist) {
            throw new DefaultError({ message: USER_MESSAGES.ALREADY_EXISTS, status: HTTP_STATUS.UNAUTHORIZED })
          }
        }
      },
      errorMessage: USER_MESSAGES.EMAIL_INVALID
    },
    password: {
      notEmpty: true,
      isString: true,
      isLength: {
        options: { min: 6, max: 50 }
      },
      isStrongPassword: {
        options: {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
        },
        errorMessage: USER_MESSAGES.STRONG_PASSWORD
      }
    },
    confirm_password: {
      notEmpty: true,
      isString: true,
      isLength: {
        options: { min: 6, max: 50 }
      },
      isStrongPassword: {
        options: {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
        },
        errorMessage: USER_MESSAGES.STRONG_PASSWORD
      },
      custom: {
        options: (value, { req }) => value === req.body.password,
        errorMessage: USER_MESSAGES.PASSWORD_NOT_MATCH
      }
    },
    date_of_birth: {
      isISO8601: {
        options: { strict: true, strictSeparator: true },
        errorMessage: USER_MESSAGES.DATE_OF_BIRTH_INVALID
      }
    }
  })
)
