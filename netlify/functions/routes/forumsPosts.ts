// noinspection AnonymousFunctionJS, ChainedFunctionCallJS, FunctionWithInconsistentReturnsJS, FunctionWithMultipleReturnPointsJS, MagicNumberJS, NestedFunctionCallJS

import type {AxiosError} from 'axios'
import type {NextFunction, Request, Response} from 'express'
import type {_DPost} from '~/@types'
import {ApiError, axiosDiscourse} from '~/server/data/constants'
export default function (_ : Request, response : Response, next : NextFunction) {
  axiosDiscourse({
    params: {
      period: 'weekly',
    },
    url: '/top.json'
  }).then((topPosts : {
    data : {
      topic_list : {
        topics : Array<_DPost>
      }
    }
  }) => {
    try {
      response.status(200).json(topPosts.data.topic_list.topics.map(post => {
        return {
          created_at: post.created_at,
          has_accepted_answer: post.has_accepted_answer,
          id: post.id,
          reply_count: post.reply_count,
          tags: post.tags,
          title: post.title,
          views: post.views
        }
      }))
    } catch {
      return next(new ApiError('Failed to parse data from Discourse', 500))
    }
  }, (topPostsError : AxiosError) => {
    return next(new ApiError('Failed to fetch data from Discourse', topPostsError.response?.status))
  })
}