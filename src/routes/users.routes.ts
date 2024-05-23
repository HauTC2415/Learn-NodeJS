import { Router } from 'express'
import {
  emailVerifyTokenController,
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
  resendEmailVerifyTokenController
} from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/users.middlewares'
import { RegisterRequestBody } from '~/models/requests/User.requests'
import { wrapRequestHandler } from '~/utils/handlers'

const usersRouter = Router()

usersRouter.get('/', (req, res) => {
  res.status(200)
  res.send('User')
})

/**
 * Description: Login a user
 * Path: /users/login
 * Method: POST
 * Request: body: { email: string, password: string }
 */
usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

/**
 * Description: Register a new user
 * Path: /users/register
 * Method: POST
 * Request: body: { name: string, email: string, password: string, confirm_password:string,  date_of_birth: ISOString }
 */
usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

/**
 * Description: logout a user
 * Path: /users/logout
 * Method: POST
 * Header: { Authentication: Bearer <AccessToken> }
 * Body: { refresh_token: string}
 */
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))

/**
 * Description: Refresh token
 * Path: /users/refresh-token
 * Method: POST
 * Body: { refresh_token: string}
 */
usersRouter.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshTokenController))

/**
 * Description: verify email
 * Path: /users/verify-email
 * Method: POST
 * Body: { email_verify_token: string}
 */
usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapRequestHandler(emailVerifyTokenController))

/**
 * Description: resend verify email
 * Path: /users/resend-verify-email
 * Method: POST
 * Header: { Authentication: Bearer <AccessToken> }
 * Body: { }
 */
usersRouter.post('/resend-verify-email', accessTokenValidator, wrapRequestHandler(resendEmailVerifyTokenController))

export default usersRouter
