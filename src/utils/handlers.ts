import { Request, Response, NextFunction, RequestHandler } from 'express'
import { omit } from 'lodash'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus as BaseError } from '~/models/Errors'

/**
 * Description: Error handler for the application. Maybe call is `default error handler`
 */
export const appErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof BaseError) {
    //current error handler in app returns: DefaultError, EntityError
    const rsError = omit(err, 'status') //remove status in response, because it's already in the response status
    return res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json(rsError)
  }

  //Error runtime of logic: undefined.toString(), null.toString(),...
  //Default `enumerable: false` => can't see in JSON.stringify
  Object.getOwnPropertyNames(err).forEach((key) => {
    Object.defineProperty(err, key, { enumerable: true })
  })
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: err.message,
    error_info: omit(err, 'stack')
  })
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
      next(error)
    }
  }
}
