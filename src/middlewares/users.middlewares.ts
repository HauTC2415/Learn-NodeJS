import { Request, Response, NextFunction } from 'express'

export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  //check if email and password are provided, format is correct
  if (!email || !password) {
    return res.status(400).json({
      message: 'Username and password are required'
    })
  }
  next()
}
