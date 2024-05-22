import HTTP_STATUS from '~/constants/httpStatus'
import USER_MESSAGES from '~/constants/message'

type ErrorsType = Record<
  string,
  {
    msg: string
    [key: string]: any
  }
> // example: { email: { msg: 'Email is required', value: '', path: 'email', location: 'body' } }

export class ErrorWithStatus {
  message: string
  status: number
  constructor({ message, status }: { message: string; status: number }) {
    this.message = message
    this.status = status
  }
}

export class DefaultError extends ErrorWithStatus {
  error_info?: any
  constructor({ message, status, error_info = null }: { message: string; status: number; error_info?: any }) {
    super({ message, status })
    this.error_info = error_info
  }
}

export class EntityError extends ErrorWithStatus {
  errors: ErrorsType
  constructor({ message = USER_MESSAGES.USER_UNPROCESSABLE_ENTITY, errors }: { message?: string; errors: ErrorsType }) {
    super({ message, status: HTTP_STATUS.UNPROCESSABLE_ENTITY })
    this.errors = errors
  }
}
