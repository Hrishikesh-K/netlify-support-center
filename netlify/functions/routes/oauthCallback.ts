// noinspection AnonymousFunctionJS, ChainedFunctionCallJS, ConstantOnRightSideOfComparisonJS, FunctionWithInconsistentReturnsJS, FunctionWithMultipleReturnPointsJS, MagicNumberJS, NestedFunctionCallJS

import type {AxiosError} from 'axios'
import type {NextFunction, Request, Response} from 'express'
import type {_NUser} from '~/@types'
import axios from 'axios'
import cryptoJs from 'crypto-js'
import {parse} from 'qs'
import sanitizeHtml from 'sanitize-html'
import {ApiError, axiosNetlify, invalidParamException} from '~/server/data/constants'
export default function (request : Request, response : Response, next : NextFunction) {
  const safeCode = sanitizeHtml(request.query['code'] as string)
  if (safeCode === '' || !request.query['state'] || Object.keys(request.query).length !== 2) {
    return next(invalidParamException)
  } else {
    const state = parse(request.query['state'] as string)
    const safeCsrf = sanitizeHtml(state['csrf'] as string)
    const safePath = sanitizeHtml(state['path'] as string)
    if (safeCsrf === '' || safePath === '' || Object.keys(state).length !== 2) {
      return next(invalidParamException)
    } else {
      axios({
        data: {
          client_id: process.env['NETLIFY_CLIENT_ID'],
          client_secret: process.env['NETLIFY_CLIENT_SECRET'],
          code: safeCode,
          grant_type: 'authorization_code',
          redirect_uri: `${request.origin}/api/oauth/callback`
        },
        method: 'post',
        url: 'https://api.netlify.com/oauth/token'
      }).then((tokenResponse : {
        data : {
          access_token : string
        }
      }) => {
        axiosNetlify({
          headers: {
            authorization: `Bearer ${tokenResponse.data.access_token}`
          },
          url: '/user'
        }).then((netlifyUser : {
          data: _NUser
        }) => {
          try {
            response.cookie('nf_token', cryptoJs.AES.encrypt(JSON.stringify({
              access_token: tokenResponse.data.access_token,
              email: netlifyUser.data.email,
              id: netlifyUser.data.id,
              full_name: netlifyUser.data.full_name,
              zd_id: 0,
              zd_org: 0
            }), process.env['COOKIE_SECRET'] || '').toString(), {
              httpOnly: true,
              maxAge: 86400000,
              path: '/api/',
              sameSite: 'strict',
              secure: true,
            }).redirect(`${request.origin}${safePath}?csrf=${safeCsrf}`)
          } catch {
            return next(new ApiError('Failed to redirect to application', 500))
          }
        }, (netlifyUserError : AxiosError) => {
          return next(new ApiError('Failed to fetch data from Netlify', netlifyUserError.response?.status))
        })
      }, (tokenResponseError : AxiosError) => {
        return next(new ApiError('Failed to fetch token from Netlify', tokenResponseError.response?.status))
      })
    }
  }
}