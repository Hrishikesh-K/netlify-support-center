// noinspection AnonymousFunctionJS, ConstantOnRightSideOfComparisonJS, FunctionWithMultipleReturnPointsJS, NestedFunctionCallJS, MagicNumberJS

import type {AxiosError} from 'axios'
import type {NextFunction, Request, Response} from 'express'
import type {_UiFile, _ZdTicket} from '~/@types'
import {createReadStream, createWriteStream, readFileSync, writeFileSync} from 'fs'
import exifRemover from 'exif-be-gone'
import {getType} from 'mime'
import sanitizeHtml from 'sanitize-html'
import {ApiError, axiosZendesk} from '~/server/data/constants'
export default function (request : Request, response : Response, next : NextFunction) {
  if (request.nf_token!.priority < 9) {
    return next(new ApiError('Failed to process request as this endpoint is reserved only for Pro and above users', 402))
  } else {
    const subject = sanitizeHtml(request.body.subject)
    if (subject.length > 0) {
      const body = sanitizeHtml(request.body.message)
      if (body.length > 0) {
        function createTicket(uploads : Array<string>) {
          axiosZendesk({
            data: {
              ticket: {
                comment: {
                  html_body: sanitizeHtml(request.body.message),
                  uploads
                },
                requester_id: request.nf_token!.zd_id,
                subject
              }
            },
            method: 'post',
            url: '/tickets.json',
          }).then((ticketCreateResponse : {
            data : {
              ticket : _ZdTicket
            }
          }) => {
            response.status(200).json(ticketCreateResponse.data.ticket)
          }, (ticketCreateError : AxiosError) => {
            return next(new ApiError('Failed to create ticket on Zendesk', ticketCreateError.response?.status))
          })
        }
        if (request.body.files.length > 0) {
          Promise.all<Array<string>>(request.body.files.map((file : _UiFile) => {
            try {
              writeFileSync(`/tmp/${file.name}`, Buffer.from(file.base64, 'base64'))
              createReadStream(`/tmp/${file.name}`).pipe(new exifRemover()).pipe(createWriteStream(`/tmp/upload-${file.name}`))
            } catch {
              return next(new ApiError(`Failed to process ${file.name}`, 500))
            }
            return axiosZendesk({
              data: readFileSync(`/tmp/upload-${file.name}`),
              headers: {
                'content-type': getType(file.name) || 'application/octet-stream'
              },
              params: {
                filename: file.name
              },
              method: 'post',
              url: '/uploads.json'
            }).then((fileUploadResponse : {
              data : {
                upload : {
                  token : string
                }
              }
            }) => {
              return fileUploadResponse.data.upload.token
            }, (fileUploadError : AxiosError) => {
              return next(new ApiError(`Failed to upload ${file.name} to Zendesk`, fileUploadError.response?.status))
            })
          })).then(createTicket)
        } else {
          createTicket([])
        }
      } else {
        return next(new ApiError('Failed to process request as message body is empty', 400))
      }
    } else {
      return next(new ApiError('Failed to process request as subject is empty', 400))
    }
  }
}