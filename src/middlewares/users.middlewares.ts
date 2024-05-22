import { checkSchema } from 'express-validator'
import HTTP_STATUS from '~/constants/httpStatus'
import USER_MESSAGES from '~/constants/message'
import { DefaultError } from '~/models/Errors'
import usersService from '~/services/users.services'
import { validate } from '~/utils/validation'

export const loginValidator = validate(
  checkSchema({
    email: {
      isEmail: {
        errorMessage: USER_MESSAGES.EMAIL_INVALID_FORMAT
      },
      trim: true
    },
    password: {
      notEmpty: { errorMessage: USER_MESSAGES.PASSWORD_IS_REQUIRED },
      isString: true,
      isLength: {
        options: { min: 6, max: 50 },
        errorMessage: USER_MESSAGES.PASSWORD_FROM_6_TO_50
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
        options: async (value, { req }) => {
          const error = new DefaultError({
            message: USER_MESSAGES.EMAIL_PASSWORD_INCORRECT,
            status: HTTP_STATUS.UNAUTHORIZED
          })
          const user = await usersService.getUser(req.body.email, value)
          if (!user) {
            throw error
          }
          req.user = user
          return true
        }
      }
    }
  })
)

// validate the request body use "express-validator"
export const registerValidator = validate(
  checkSchema({
    name: {
      isLength: {
        options: { min: 1, max: 100 },
        errorMessage: USER_MESSAGES.NAME_FROM_1_TO_100
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
      errorMessage: USER_MESSAGES.EMAIL_INVALID_FORMAT
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
