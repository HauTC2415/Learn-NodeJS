import { Request, Response } from 'express'
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

export const registerController = async (req: Request, res: Response) => {
  const { email, password } = req.body

  if (!email || !password)
    return res.status(400).json({
      message: 'email or password is required'
    })

  try {
    const rs = await usersService.register({ email, password })
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
