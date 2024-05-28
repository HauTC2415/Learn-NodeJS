import { Router } from 'express'
import {
  changePasswordController,
  emailVerifyTokenController,
  followUserController,
  forgotPasswordController,
  getMeController,
  getProfileController,
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
  resendEmailVerifyTokenController,
  resetPasswordController,
  unFollowUserController,
  updateMeController,
  verifyForgotPasswordTokenController
} from '~/controllers/users.controllers'
import { filterFieldsAllowed } from '~/middlewares/common/middlewares'
import {
  accessTokenValidator,
  changePasswordValidator,
  emailVerifyTokenValidator,
  followUserValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  unFollowUserValidator,
  updateMeValidator,
  verifiedUserValidator,
  verifyForgotPasswordTokenValidator
} from '~/middlewares/users.middlewares'
import { UpdateMeRequestBody } from '~/models/requests/User.requests'
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

/**
 * Description: forgot password
 * Path: /users/forgot-password
 * Method: POST
 * Body: { email: string }
 */
usersRouter.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))

/**
 * Description:  link in email to reset password
 * Path: /users/verify-forgot-password-token
 * Method: POST
 * Body: { forgot_password_token: string }
 */
usersRouter.post(
  '/verify-forgot-password-token',
  verifyForgotPasswordTokenValidator,
  wrapRequestHandler(verifyForgotPasswordTokenController)
)

/**
 * Description:  link in email to reset password
 * Path: /users/reset-password
 * Method: POST
 * Body: { forgot_password_token: string, password: string, confirm_password: string}
 */
usersRouter.post('/reset-password', resetPasswordValidator, wrapRequestHandler(resetPasswordController))

/**
 * Description: Get my profile
 * Path: /users/me
 * Method: GET
 * Header: { Authentication: Bearer <AccessToken> }
 */
usersRouter.get('/me', accessTokenValidator, wrapRequestHandler(getMeController))

/**
 * Description: update user profile
 * Path: /users/me
 * Method: GET
 * Header: { Authentication: Bearer <AccessToken> }
 */
usersRouter.patch(
  '/me',
  accessTokenValidator,
  verifiedUserValidator,
  updateMeValidator,
  //only pick fields that are allowed to update
  filterFieldsAllowed<UpdateMeRequestBody>([
    'name',
    'date_of_birth',
    'bio',
    'location',
    'website',
    'username',
    'avatar',
    'cover_photo'
  ]),
  wrapRequestHandler(updateMeController)
)

/**
 * Description: Get user profile
 * Path: /:username
 * Method: GET
 */
usersRouter.get('/:username', wrapRequestHandler(getProfileController))

/**
 * Description: Follow someone
 * Path: /users/follow
 * Method: POST
 * Header: { Authentication: Bearer <AccessToken> }
 * Body: { followed_user_id: string }
 */
usersRouter.post(
  '/follow',
  accessTokenValidator,
  verifiedUserValidator,
  followUserValidator,
  wrapRequestHandler(followUserController)
)

/**
 * Description: Unfollow someone
 * Path: /users/follow/:followed_user_id
 * Method: DELETE
 * Header: { Authentication: Bearer <AccessToken> }
 * Params: { followed_user_id: string }
 */
usersRouter.delete(
  '/follow/:followed_user_id',
  accessTokenValidator,
  verifiedUserValidator,
  unFollowUserValidator,
  wrapRequestHandler(unFollowUserController)
)

/**
 * Description: Change password
 * Path: /users/change-password
 * Method: PUT
 * Header: { Authentication: Bearer <AccessToken> }
 * Body: { old_password: string, new_password: string, confirm_password: string }
 */
usersRouter.put(
  '/change-password',
  accessTokenValidator,
  verifiedUserValidator,
  changePasswordValidator,
  wrapRequestHandler(changePasswordController)
)

export default usersRouter
