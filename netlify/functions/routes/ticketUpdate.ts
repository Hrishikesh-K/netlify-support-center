// noinspection AnonymousFunctionJS, NestedFunctionCallJS, MagicNumberJS

import type {NextFunction, Request, Response} from 'express'
import {ApiError} from '~/server/data/constants'
export default function (_ : Request, __ : Response, next : NextFunction) {
  return next(new ApiError('Failed to process request as this endpoint is not yet implemented', 501))
}