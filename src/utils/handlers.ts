import { Request, Response, NextFunction, RequestHandler } from 'express'
import { omit } from 'lodash'
import HTTP_STATUS from '~/constants/httpStatus'
import USER_MESSAGES from '~/constants/message'
import { ErrorWithStatus as BaseError } from '~/models/Errors'

/**
 * Description: Error handler for the application. Maybe call is `default error handler`
 */
export const appErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  //current error handler in app returns: DefaultError, EntityError
  const rsError = omit(err, 'status') //remove status in response, because it's already in the response status
  res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json(rsError)
}

/**
 * Description: Wrap the request handler to catch any error, and pass it to the error handler.
 * You doesn't try catch block in the request handler
 */
export const wrapRequestHandler = (handler: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next)
    } catch (error) {
      //call next to pass the error to the `error handler`
      //in this case, the error handler is appErrorHandler calling next(error)
      if (error instanceof BaseError) {
        return next(error)
      }
      next(new BaseError({ message: USER_MESSAGES.INTERNAL_SERVER_ERROR, status: HTTP_STATUS.INTERNAL_SERVER_ERROR }))
    }
  }
}
