import { Request, Response } from 'express'
import RequestBase from '~/common/Request.base'
import HTTP_STATUS from '~/constants/httpStatus'
import USER_MESSAGES from '~/constants/message'
import { RegisterRequestBody } from '~/models/requests/User.requests'
import usersService from '~/services/users.services'

export const loginController = async (req: Request, res: Response) => {
  throw new Error('Not implemented')
  const { user } = req as any
  const rs = await usersService.login(user._id.toString())
  return res.status(HTTP_STATUS.OK).json({
    message: USER_MESSAGES.LOGGED_IN,
    data: rs
  })
}

export const registerController = async (req: RequestBase<RegisterRequestBody>, res: Response) => {
  const rs = await usersService.register(req.body)
  return res.status(HTTP_STATUS.CREATED).json({
    message: USER_MESSAGES.REGISTERED,
    data: rs
  })
}
