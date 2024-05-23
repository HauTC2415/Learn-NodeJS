import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import ResponseBase from '~/common/Response.base'
import RequestBase from '~/common/Request.base'
import HTTP_STATUS from '~/constants/httpStatus'
import USER_MESSAGES from '~/constants/message'
import {
  EmailVerifyTokenRequestBody,
  LogoutRequestBody,
  RefreshTokenRequestBody,
  RegisterRequestBody,
  TokenPayload
} from '~/models/requests/User.requests'
import {
  EmailVerifyTokenResponse,
  LoginResponse,
  LogoutResponse,
  RefreshTokenResponse,
  RegisterResponse,
  ResendEmailVerifyTokenResponse
} from '~/models/response/User.response'
import User from '~/models/schemas/User.schema'
import usersService from '~/services/users.services'
import databaseService from '~/services/database.services'
import { DefaultError } from '~/models/Errors'
import { UserVerifyStatus } from '~/constants/enum'

export const loginController = async (req: Request, res: Response) => {
  //req.user: req has user property, because of middleware loginValidator defined req.user = user
  //and user has type "User | undefined" because declare for Request of module 'express' in src/type.d.ts
  const user = req.user as User
  const user_id = user._id as ObjectId
  const rs = await usersService.login(user_id.toString())
  return res.status(HTTP_STATUS.OK).json(new ResponseBase<LoginResponse>(USER_MESSAGES.LOGGED_IN, rs))
}

export const registerController = async (req: RequestBase<RegisterRequestBody>, res: Response) => {
  const rs = await usersService.register(req.body)
  return res.status(HTTP_STATUS.OK).json(new ResponseBase<RegisterResponse>(USER_MESSAGES.REGISTERED, rs))
}

export const logoutController = async (req: RequestBase<LogoutRequestBody>, res: Response) => {
  const refresh_token = req.body.refresh_token
  const user_id = req.decoded_refresh_token?.user_id as string
  if (refresh_token) {
    await usersService.logout(refresh_token)
  }
  const rs: LogoutResponse = { user_id }
  return res.status(HTTP_STATUS.OK).json(new ResponseBase<LogoutResponse>(USER_MESSAGES.LOGGED_OUT, rs))
}

export const refreshTokenController = async (req: RequestBase<RefreshTokenRequestBody>, res: Response) => {
  const refresh_token = req.body.refresh_token
  const rs = await usersService.refreshToken(refresh_token)
  return res
    .status(HTTP_STATUS.OK)
    .json(new ResponseBase<RefreshTokenResponse>(USER_MESSAGES.REFRESH_TOKEN_SUCCESS, rs))
}

export const emailVerifyTokenController = async (req: RequestBase<EmailVerifyTokenRequestBody>, res: Response) => {
  const decoded_email_verify_token = req.decoded_email_verify_token
  const user_id = decoded_email_verify_token?.user_id as string
  console.log('decoded_email_verify_token', decoded_email_verify_token)
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  if (!user) {
    throw new DefaultError({ message: USER_MESSAGES.NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
  }
  //if email is verified
  if (user.email_verify_token === '') {
    return res.status(HTTP_STATUS.OK).json(new ResponseBase(USER_MESSAGES.EMAIL_VERIFIED_BEFORE, null))
  }
  const rs = await usersService.verifyEmail(user_id)
  return res
    .status(HTTP_STATUS.OK)
    .json(new ResponseBase<EmailVerifyTokenResponse>(USER_MESSAGES.EMAIL_VERIFIED_BEFORE, rs))
}

export const resendEmailVerifyTokenController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  if (!user) {
    throw new DefaultError({ message: USER_MESSAGES.NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
  }
  const isVerified = user.verify_status === UserVerifyStatus.VERIFIED
  if (isVerified) {
    return res.status(HTTP_STATUS.OK).json(new ResponseBase(USER_MESSAGES.EMAIL_VERIFIED_BEFORE, null))
  }
  const rs = await usersService.resendEmailVerifyToken(user_id)
  return res
    .status(HTTP_STATUS.OK)
    .json(new ResponseBase<ResendEmailVerifyTokenResponse>(USER_MESSAGES.RESEND_VERIFY_EMAIL_SUCCESS, rs))
}
