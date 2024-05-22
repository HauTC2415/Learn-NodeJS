import { Request, Response } from 'express'
import { RegisterRequestBody } from '~/models/requests/User.requests'
import RequestBase from '~/models/requests/common/request.base'
import usersService from '~/services/users.services'

export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body
  //query database
  if (email === 'admin' && password === 'admin') {
    return res.status(200).json({
      message: 'User logged in'
    })
  }
  return res.status(400).json({
    message: 'email or password is incorrect'
  })
}

export const registerController = async (req: RequestBase<RegisterRequestBody>, res: Response) => {
  try {
    const rs = await usersService.register(req.body)
    return res.status(201).json({
      message: 'register successfully!',
      data: rs
    })
  } catch (error) {
    return res.status(400).json({
      message: 'register failed!'
    })
  }
}
