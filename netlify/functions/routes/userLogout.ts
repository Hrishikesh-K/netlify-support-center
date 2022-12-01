// noinspection AnonymousFunctionJS, ChainedFunctionCallJS, FunctionWithInconsistentReturnsJS, FunctionWithMultipleReturnPointsJS,MagicNumberJS,NestedFunctionCallJS

import type {NextFunction, Request, Response} from 'express'
import {ApiError} from '~/server/data/constants'
export default function (_ : Request, response : Response, next : NextFunction) {
  try {
    response.clearCookie('nf_token', {
      path: '/api/'
    }).sendStatus(204)
  } catch {
    return next(new ApiError('Failed to log user out', 500))
  }
}