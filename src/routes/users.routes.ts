import { Router } from 'express'
import { loginController, registerController } from '~/controllers/users.controllers'
import { loginValidator } from '~/middlewares/users.middlewares'

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

usersRouter.post('/login', loginValidator, loginController)

usersRouter.post('/register', registerController)

export default usersRouter
