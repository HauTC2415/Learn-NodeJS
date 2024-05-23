import express from 'express'
import { ValidationChain, validationResult } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'
import HTTP_STATUS from '~/constants/httpStatus'
import { EntityError, ErrorWithStatus as BaseError } from '~/models/Errors'

/**
 * Description: Request handler to validate the request body
 * Can be reused by many routes
 * All errors always handled by the error handler: appErrorHandler
 */
export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await validation.run(req)
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }
    //has error
    const entityError = new EntityError({ errors: {} })
    const errorsObj = errors.mapped()
    for (const errorKey in errorsObj) {
      const { msg } = errorsObj[errorKey]
      //DefaultError, EntityError are the error classes inherited from BaseError
      if (msg instanceof BaseError && msg.status !== HTTP_STATUS.UNPROCESSABLE_ENTITY) {
        // pass it to the error handler: call appErrorHandler
        return next(msg)
      }
      //error 422: entity error
      entityError.errors[errorKey] = errorsObj[errorKey]
    }
    //pass it to the error handler: call appErrorHandler
    return next(entityError)
  }
}
