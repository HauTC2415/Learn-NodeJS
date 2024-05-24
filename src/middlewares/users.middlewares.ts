import { checkSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import HTTP_STATUS from '~/constants/httpStatus'
import USER_MESSAGES from '~/constants/message'
import { DefaultError } from '~/models/Errors'
import databaseService from '~/services/database.services'
import usersService from '~/services/users.services'
import { validate } from '~/utils/validation'
import { capitalize } from 'lodash'
import { Request } from 'express'
import { verifyJwtToken } from '~/utils/jwt'
import { TokenType } from '~/constants/enum'
import { ObjectId } from 'mongodb'
import { confirmPasswordSchema, forgotPassworTokenSchema, passwordSchema } from './common/param.schema.validator'

export const loginValidator = validate(
  checkSchema(
    {
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
    },
    ['body']
  )
)

// validate the request body use "express-validator"
export const registerValidator = validate(
  checkSchema(
    {
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
      password: passwordSchema,
      confirm_password: confirmPasswordSchema,
      date_of_birth: {
        isISO8601: {
          options: { strict: true, strictSeparator: true },
          errorMessage: USER_MESSAGES.DATE_OF_BIRTH_INVALID
        }
      }
    },
    ['body']
  )
)

export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        custom: {
          options: async (value, { req }) => {
            try {
              const access_token = (value || '').split(' ')[1]
              if (!access_token) {
                throw new DefaultError({
                  message: USER_MESSAGES.ACCESS_TOKEN_REQUIRED,
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              const decoded_authorization = await verifyJwtToken(access_token, TokenType.ACCESS_TOKEN)
              ;(req as Request).decoded_authorization = decoded_authorization
              req.decoded_authorization = decoded_authorization
            } catch (err) {
              if (err instanceof JsonWebTokenError) {
                throw new DefaultError({
                  message: capitalize((err as JsonWebTokenError).message),
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              throw err
            }
            return true
          }
        }
      }
    },
    ['headers']
  )
)

export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: {
        notEmpty: { errorMessage: USER_MESSAGES.REFRESH_TOKEN_REQUIRED },
        custom: {
          options: async (value, { req }) => {
            try {
              if (!value) {
                throw new DefaultError({
                  message: USER_MESSAGES.REFRESH_TOKEN_REQUIRED,
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              const [decoded_refresh_token, refresh_token] = await Promise.all([
                verifyJwtToken(value, TokenType.REFRESH_TOKEN),
                databaseService.refreshTokens.findOne({ token: value })
              ])
              if (refresh_token === null) {
                throw new DefaultError({
                  message: USER_MESSAGES.USED_REFRESH_TOKEN_OR_NOT_FOUND,
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              ;(req as Request).decoded_refresh_token = decoded_refresh_token
            } catch (err) {
              if (err instanceof JsonWebTokenError) {
                throw new DefaultError({
                  message: capitalize((err as JsonWebTokenError).message),
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              throw err
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const emailVerifyTokenValidator = validate(
  checkSchema(
    {
      email_verify_token: {
        notEmpty: { errorMessage: USER_MESSAGES.EMAIL_VERIFY_TOKEN_REQUIRED },
        custom: {
          options: async (value, { req }) => {
            try {
              if (!value) {
                throw new DefaultError({
                  message: USER_MESSAGES.EMAIL_VERIFY_TOKEN_REQUIRED,
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              const decoded_email_verify_token = await verifyJwtToken(value, TokenType.VERIFY_EMAIL_TOKEN)
              ;(req as Request).decoded_email_verify_token = decoded_email_verify_token
            } catch (err) {
              if (err instanceof JsonWebTokenError) {
                throw new DefaultError({
                  message: capitalize((err as JsonWebTokenError).message),
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              throw err
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const forgotPasswordValidator = validate(
  checkSchema(
    {
      email: {
        isEmail: { errorMessage: USER_MESSAGES.EMAIL_INVALID_FORMAT },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const user = await databaseService.users.findOne({ email: value })
            if (!user) {
              throw new DefaultError({ message: USER_MESSAGES.NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
            }
            req.user = user
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const verifyForgotPasswordTokenValidator = validate(
  checkSchema(
    {
      forgot_password_token: forgotPassworTokenSchema
    },
    ['body']
  )
)

export const resetPasswordValidator = validate(
  checkSchema(
    {
      forgot_password_token: forgotPassworTokenSchema,
      password: passwordSchema,
      confirm_password: confirmPasswordSchema
    },
    ['body']
  )
)
