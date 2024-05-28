import { Request } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

export type RequestBodyBase<T> = Request<ParamsDictionary, any, T>

export type RequestParamsBase<T> = Request<T, any, any>
