import { Request } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

type RequestBase<T> = Request<ParamsDictionary, any, T>

export default RequestBase
