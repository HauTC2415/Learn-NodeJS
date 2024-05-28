import { NextFunction, Request, Response } from 'express'
import { pick } from 'lodash'
import USER_MESSAGES from '~/constants/message'
import { DefaultError } from '~/models/Errors'

type FilterKeys<T> = Array<keyof T>

export const filterFieldsAllowed =
  <T>(filterKeys: FilterKeys<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    req.body = pick(req.body, filterKeys)
    if (!Object.keys(req.body).length) {
      throw new DefaultError({
        message: USER_MESSAGES.INVALID_REQUEST,
        status: 400,
        error_info: { ...filterKeys, ...req.body }
      })
    }
    next()
  }
