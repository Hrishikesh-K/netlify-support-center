// noinspection AnonymousFunctionJS, ChainedFunctionCallJS, ConstantOnRightSideOfComparisonJS, FunctionWithInconsistentReturnsJS, FunctionWithMultipleReturnPointsJS, JSUnusedGlobalSymbols, MagicNumberJS, NestedFunctionCallJS, NestedFunctionJS, ParameterNamingConventionJS

import type {HandlerContext, HandlerEvent} from '@netlify/functions'
import type {NextFunction, Request, Response} from 'express'
import axios from 'axios'
import cookieParser from 'cookie-parser'
import cryptoJs from 'crypto-js'
import express, {json, Router} from 'express'
import serverless from 'serverless-http'
import {ApiError} from '~/server/data/constants'
import forumsPosts from '~/server/routes/forumsPosts'
import oauthAuthorize from '~/server/routes/oauthAuthorize'
import oauthCallback from '~/server/routes/oauthCallback'
import systemStatus from '~/server/routes/systemStatus'
import ticketList from '~/server/routes/ticketList'
import ticketNew from '~/server/routes/ticketNew'
import ticketUpdate from '~/server/routes/ticketUpdate'
import ticketView from '~/server/routes/ticketView'
import userLogout from '~/server/routes/userLogout'
import user from '~/server/routes/user'
export async function handler(event : HandlerEvent, context : HandlerContext) {
  const api = express()
  const router = Router()
  router.get('/forums/posts', forumsPosts)
  router.get('/oauth/authorize', oauthAuthorize)
  router.get('/oauth/callback', oauthCallback)
  router.get('/system/status', systemStatus)
  router.post('/ticket/new', ticketNew)
  router.get('/ticket/:id', ticketView)
  router.put('/ticket/:id', ticketUpdate)
  router.get('/tickets/organization/:id', ticketList)
  router.get('/tickets/user/:id/:type', ticketList)
  router.get('/user/logout', userLogout)
  router.get('/user', user)
  api.use(cookieParser(), json({
    limit: 5505024,
    type: '*/*'
  }), (error : Error & {
    type : 'charset.unsupported' | 'encoding.unsupported' | 'entity.parse.failed'| 'entity.too.large' | 'request.aborted' | 'request.size.invalid' | 'stream.encoding.set' | 'stream.not.readable' | string
  }, _ : Request, __ : Response, next : NextFunction) => {
    const baseFailure = 'Failed to parse request body'
    switch (error.type) {
      case 'charset.unsupported':
        return next(new ApiError(`${baseFailure} because its charset is not supported`, 415, false))
      case 'encoding.unsupported':
        return next(new ApiError(`${baseFailure} because its content-encoding is not supported`, 415, false))
      case 'entity.parse.failed':
        return next(new ApiError(baseFailure, 400, false))
      case 'entity.too.large':
        return next(new ApiError(`${baseFailure} because it's too large`, 413, false))
      case 'request.aborted':
        return next(new ApiError(`${baseFailure} because the request was aborted`, 400, false))
      case 'request.size.invalid':
        return next(new ApiError(`${baseFailure} because the reported content-length and actual length is different`, 400, false))
      case 'stream.encoding.set':
        return next(new ApiError(`${baseFailure} because the stream encoding is already set`, 500, false))
      case 'stream.not.readable':
        return next(new ApiError(`${baseFailure} because the stream is not readable`, 500, false))
      default:
        return next()
    }
  }, (request : Request, response : Response, next : NextFunction) => {
    request.origin = new URL(request.apiGateway.event.rawUrl).origin
    function logout() {
      response.clearCookie('nf_token', {
        path: '/api/'
      })
      return next(new ApiError('Failed to parse cookie', 403, false))
    }
    if (['/forums/posts', '/oauth/authorize', '/oauth/callback', '/system/status', '/user/logout'].includes(request.path.slice(4))) {
      next()
    } else {
      if (request.cookies['nf_token']) {
        new Promise<string>(resolve => {
          resolve(cryptoJs.AES.decrypt(request.cookies['nf_token'], process.env['COOKIE_SECRET'] || '').toString(cryptoJs.enc.Utf8))
        }).then((decryptedString : string) => {
          try {
            request.nf_token = JSON.parse(decryptedString)
            next()
          } catch {
            return next(new ApiError('Failed to parse decrypted cookie', 403, false))
          }
        }, () => {
          logout()
        })
      } else {
        logout()
      }
    }
    setTimeout(() => {
      if (!response.headersSent) {
         next(new ApiError('Failed to process request because the server timed out', 504))
      }
    }, 9250)
  })
  api.use('/api/', router, (error : ApiError, request : Request, response : Response, __ : NextFunction) => {
    if (error.webhook) {
      axios({
        data: {
          blocks: [{
            text: {
              text: `New error in Netlify Support Center API. CC: <@${process.env['SLACK_USER_ID']}>`,
              type: 'mrkdwn'
            },
            type: 'section'
          }, {
            text: {
              text: `\`\`\`\n{\n  message: \'${error.message}\',\n  status: ${error.status},\n  request_id: \'${request.apiGateway.context.awsRequestId}\'\n}\`\`\``,
              type: 'mrkdwn'
            },
            type: 'section'
          }]
        },
        method: 'post',
        url: process.env['SLACK_HOOK'] || ''
      }).then(() => {
        response.status(error.status).json({
          message: error.message,
          notification: 'posted',
          request_id: request.apiGateway.context.awsRequestId
        })
      }, () => {
        response.status(error.status).json({
          message: error.message,
          notification: 'failed',
          request_id: request.apiGateway.context.awsRequestId
        })
      })
    } else {
      response.status(error.status).json({
        message: error.message,
        notification: 'skipped',
        request_id: request.apiGateway.context.awsRequestId
      })
    }
  })
  return serverless(api)(event, context)
}

// todo: if Netlify user changes email, Zendesk email should update too