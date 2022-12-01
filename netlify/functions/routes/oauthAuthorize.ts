// noinspection AnonymousFunctionJS, ConstantOnRightSideOfComparisonJS, FunctionWithInconsistentReturnsJS, FunctionWithMultipleReturnPointsJS, MagicNumberJS, NestedFunctionCallJS

import type {NextFunction, Request, Response} from 'express'
import sanitizeHtml from 'sanitize-html'
import {stringify} from 'qs'
import {ApiError, invalidParamException} from '~/server/data/constants'
export default function (request : Request, response : Response, next : NextFunction) {
  const safeCsrf = sanitizeHtml(request.query['csrf'] as string)
  const safePath = sanitizeHtml(request.query['path'] as string)
  if (safeCsrf === '' || safePath === '' || Object.keys(request.query).length !== 2) {
    return next(invalidParamException)
  } else {
    try {
      response.redirect(`https://app.netlify.com/authorize?${stringify({
        client_id: process.env['NETLIFY_CLIENT_ID'],
        redirect_uri: `${request.origin}/api/oauth/callback`,
        response_type: 'code',
        state: `csrf=${safeCsrf}&path=${safePath}`
      })}`)
    } catch {
      return next(new ApiError('Failed to redirect to destination', 500))
    }
  }
}