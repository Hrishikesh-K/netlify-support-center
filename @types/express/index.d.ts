// noinspection JSUnusedGlobalSymbols

import type {HandlerContext, HandlerEvent} from '@netlify/functions'
declare global {
  namespace Express {
    export interface Request {
      apiGateway : {
        context : HandlerContext
        event : HandlerEvent
      }
      body? : {
        email? : string
        files? : Array<{
          base64 : string
          name : string
        }>
        message? : string
        name? : string
      }
      cookies?: {
        nf_token? : string
      }
      nf_token? : {
        access_token : string
        email : string
        id : string
        full_name : string
        priority : number
        zd_id : number
        zd_org : number
      }
      origin : string
      params? : {
        id? : string
        type? : string
      }
      query? : {
        code? : string
        page? : string
        state? : string
      }
    }
  }
}