import { Router } from 'express'
import { loginController, registerController } from '~/controllers/users.controllers'
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares'
import { RegisterRequestBody } from '~/models/requests/User.requests'
import { wrapRequestHandler } from '~/utils/handlers'

const usersRouter = Router()

// common middleware for usersRouter
// usersRouter.use(
//   (req, res, next) => {
//     console.log('this is a middleware1 for user routes')
//     next()
//   },
//   (req, res, next) => {
//     console.log('this is a middleware2 for user routes')
//     next()
//   }
//  // more middleware can be added here
// )

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

export default usersRouter
