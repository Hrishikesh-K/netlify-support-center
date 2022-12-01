// noinspection AnonymousFunctionJS, ChainedFunctionCallJS, ConstantOnRightSideOfComparisonJS, ExceptionCaughtLocallyJS, FunctionWithInconsistentReturnsJS, FunctionWithMultipleReturnPointsJS, MagicNumberJS, NestedFunctionCallJS

import type {AxiosError, AxiosRequestConfig} from 'axios'
import type {NextFunction, Request, Response} from 'express'
import type {_ZdTicketList} from '~/@types'
import sanitizeHtml from 'sanitize-html'
import {ApiError, axiosZendesk, invalidParamException} from '~/server/data/constants'
export default function (request : Request, response : Response, next : NextFunction) {
  const safePage = sanitizeHtml(request.query['page'] as string)
  if (safePage === '' || Object.keys(request.query).length > 1) {
    return next(invalidParamException)
  } else {
    new Promise<_ZdTicketList>(resolve => {
      const params = <AxiosRequestConfig['params']>{
        page: safePage,
        per_page: 10,
        sort: 'id',
        sort_order: 'desc'
      }
      const safeId = sanitizeHtml(request.params['id'] || '')
      if (safeId === '') {
        return next(invalidParamException)
      } else {
        if (request.route['path'].slice(1).split('/')[1] === 'user') {
          const safeType = sanitizeHtml(request.params['type'] || '')
          if (safeType !== '' && Object.keys(request.params).length === 2) {
            axiosZendesk({
              url: `/users/${safeId}/identities.json`
            }).then((zendeskUser : {
              data : {
                identities : Array<{
                  type : 'email'
                  value : string
                }>
              }
            }) => {
              let isValidUser : boolean
              try {
                isValidUser = zendeskUser.data.identities.filter(zendeskUserIdentity => {
                  return zendeskUserIdentity.type === 'email'
                }).some(zendeskUserIdentityFiltered => {
                  return zendeskUserIdentityFiltered.value === request.nf_token!.email
                })
              } catch {
                return next(new ApiError('Failed to parse user identities from Zendesk', 500))
              }
              if (isValidUser) {
                axiosZendesk({
                  params,
                  url: `/users/${safeId}/tickets/${safeType}.json`
                }).then((ticketListUser : {
                  data : _ZdTicketList
                }) => {
                  resolve(ticketListUser.data)
                }, (ticketListUserError : AxiosError) => {
                  return next(new ApiError('Failed to fetch tickets for current user from Zendesk', ticketListUserError.response?.status))
                })
              } else {
                return next(new ApiError('Failed to authenticate current user against ticket\'s users', 403))
              }
            }, (zendeskUserError : AxiosError) => {
              return next(new ApiError('Failed to fetch user data from Zendesk', zendeskUserError.response?.status))
            })
          } else {
            return next(invalidParamException)
          }
        } else {
          if (Object.keys(request.params).length === 1) {
            axiosZendesk({
              url: `/organizations/${safeId}.json`
            }).then((zendeskOrg : {
              data : {
                organization : {
                  domain_names : Array<string>
                }
              }
            }) => {
              if (zendeskOrg.data.organization.domain_names.includes(request.nf_token!.email.split('@')[1] as string)) {
                axiosZendesk({
                  params,
                  url: `/organizations/${safeId}/tickets.json`
                }).then((ticketListOrg : {
                  data : _ZdTicketList
                }) => {
                  resolve(ticketListOrg.data)
                }, (ticketListOrgError : AxiosError) => {
                  return next(new ApiError('Failed to fetch tickets for current organization from Zendesk', ticketListOrgError.response?.status))
                })
              } else {
                return next(new ApiError('Failed to authenticate current user against the organization', 403))
              }
            }, (zendeskOrgError : AxiosError) => {
              return next(new ApiError('Failed to fetch organization data from Zendesk', zendeskOrgError.response?.status))
            })
          } else {
            return next(invalidParamException)
          }
        }
      }
    }).then(ticketList => {
      try {
        response.status(200).json(<_ZdTicketList>{
          next_page: ticketList.next_page,
          tickets: ticketList.tickets.map(ticket => {
            return {
              collaborator_ids: ticket.collaborator_ids,
              comments: [],
              created_at: ticket.created_at,
              id: ticket.id,
              loading: false,
              requester_id: ticket.requester_id,
              status: ticket.status,
              subject : ticket.subject,
              updated_at: ticket.updated_at
            }
          })
        })
      } catch {
        return next(new ApiError('Failed to parse data from Zendesk', 500))
      }
    })
  }
}