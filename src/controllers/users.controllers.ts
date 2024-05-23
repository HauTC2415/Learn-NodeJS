import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import ResponseBase from '~/common/Response.base'
import RequestBase from '~/common/Request.base'
import HTTP_STATUS from '~/constants/httpStatus'
import USER_MESSAGES from '~/constants/message'
import { LogoutRequestBody, RegisterRequestBody } from '~/models/requests/User.requests'
import { LogoutResponse, RegisterResponse } from '~/models/response/User.response'
import User from '~/models/schemas/User.schema'
import usersService from '~/services/users.services'

export const loginController = async (req: Request, res: Response) => {
  //req.user: req has user property, because of middleware loginValidator defined req.user = user
  //and user has type "User | undefined" because declare for Request of module 'express' in src/type.d.ts
  const user = req.user as User
  const user_id = user._id as ObjectId
  const rs = await usersService.login(user_id.toString())
  return res.status(HTTP_STATUS.OK).json(new ResponseBase<RegisterResponse>(USER_MESSAGES.LOGGED_IN, rs))
}

export const registerController = async (req: RequestBase<RegisterRequestBody>, res: Response) => {
  const rs = await usersService.register(req.body)
  return res.status(HTTP_STATUS.OK).json(new ResponseBase<RegisterResponse>(USER_MESSAGES.LOGGED_IN, rs))
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
