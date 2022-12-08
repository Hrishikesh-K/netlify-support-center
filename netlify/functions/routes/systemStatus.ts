// noinspection AnonymousFunctionJS, ChainedFunctionCallJS, FunctionWithInconsistentReturnsJS, FunctionWithMultipleReturnPointsJS, MagicNumberJS,NestedFunctionCallJS

import type {AxiosError} from 'axios'
import type {NextFunction, Request, Response} from 'express'
import type {_SpStatus} from '~/@types'
import axios from 'axios'
import {ApiError} from '~/server/data/constants'
export default function (_ : Request, response : Response, next : NextFunction) {
  axios({
    url: 'https://netlifystatus.com/api/v2/summary.json'
  }).then((statusDetails: {
    data: _SpStatus
  }) => {
    try {
      response.status(200).json(<_SpStatus>{
        page: {
          url: statusDetails.data.page.url
        },
        status: {
          description: statusDetails.data.status.description,
          indicator: statusDetails.data.status.indicator
        }
      })
    } catch {
      return next(new ApiError('Failed to parse data from Statuspage', 500))
    }
  }, (statusDetailsError : AxiosError) => {
    return next(new ApiError('Failed to fetch data from Statuspage', statusDetailsError.response?.status))
  })
}