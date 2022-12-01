// noinspection AnonymousFunctionJS, ConstantOnRightSideOfComparisonJS, FunctionWithMultipleReturnPointsJS, NestedFunctionCallJS, MagicNumberJS

import type {NextFunction, Request, Response} from 'express'
import {ApiError} from '~/server/data/constants'
export default function (request : Request, __ : Response, next : NextFunction) {
  if (request.nf_token!.priority < 9) {
    return next(new ApiError('Failed to process request as this endpoint is reserved only for Pro and above users', 402))
  } else {
    return next(new ApiError('Failed to process request as this endpoint is not yet implemented', 501))
  }
  //console.log(Buffer.from(request.body.files[0].base64, 'base64'))
}