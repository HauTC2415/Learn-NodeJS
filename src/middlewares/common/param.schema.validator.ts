import { ParamSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import { TokenType } from '~/constants/enum'
import HTTP_STATUS from '~/constants/httpStatus'
import USER_MESSAGES from '~/constants/message'
import { DefaultError } from '~/models/Errors'
import databaseService from '~/services/database.services'
import { verifyJwtToken } from '~/utils/jwt'
import { Request } from 'express'
import { JsonWebTokenError } from 'jsonwebtoken'
import { capitalize } from 'lodash'

export const passwordSchema: ParamSchema = {
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
}

export const confirmPasswordSchema: ParamSchema = {
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
}

export const forgotPassworTokenSchema: ParamSchema = {
  trim: true,
  custom: {
    options: async (value, { req }) => {
      try {
        if (!value) {
          throw new DefaultError({
            message: USER_MESSAGES.FORGOT_PASSWORD_TOKEN_REQUIRED,
            status: HTTP_STATUS.UNAUTHORIZED
          })
        }
        const decoded_forgot_password_token = await verifyJwtToken(value, TokenType.FORGOT_PASSWORD_TOKEN)
        const user_id = decoded_forgot_password_token.user_id
        const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
        if (!user) {
          throw new DefaultError({ message: USER_MESSAGES.NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
        }
        if (user.forgot_password_token !== value) {
          throw new DefaultError({
            message: USER_MESSAGES.INVALID_FORGOT_PASSWORD_TOKEN,
            status: HTTP_STATUS.UNAUTHORIZED
          })
        }
        ;(req as Request).decoded_forgot_password_token = decoded_forgot_password_token
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
