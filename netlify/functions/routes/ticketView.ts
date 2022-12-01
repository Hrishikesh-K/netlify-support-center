// noinspection AnonymousFunctionJS, ChainedFunctionCallJS, ConstantOnRightSideOfComparisonJS, FunctionWithInconsistentReturnsJS,FunctionWithMultipleReturnPointsJS, MagicNumberJS, NestedFunctionCallJS, NestedFunctionJS

import type {AxiosError} from 'axios'
import type {NextFunction, Request, Response} from 'express'
import type {_ZdComment, _ZdTicket, _ZdUser} from '~/@types'
import sanitizeHtml from 'sanitize-html'
import {ApiError, axiosZendesk, invalidParamException} from '~/server/data/constants'
export default function (request : Request, response : Response, next : NextFunction) {
  const knownAccounts : {
    [key : number] : _ZdUser
  } = {}
  const safeId = sanitizeHtml(request.params['id'] || '')
  if (safeId === '') {
    return next(invalidParamException)
  } else {
    axiosZendesk({
      url: `/tickets/${sanitizeHtml(request.params['id'] as string)}.json`
    }).then((ticketData : {
      data : {
        ticket : _ZdTicket
      }
    }) => {
      async function findUsers(userIds : Array<number>) {
        return Promise.all(userIds.map(userId => {
          if (knownAccounts.hasOwnProperty(userId)) {
            return knownAccounts[userId]
          } else {
            return axiosZendesk({
              url: `/users/${userId}.json`
            }).then((userData : {
              data : {
                user : _ZdUser
              }
            }) => {
              try {
                knownAccounts[userData.data.user.id] = {
                  email: userData.data.user.email,
                  external_id: userData.data.user.external_id,
                  id: userData.data.user.id,
                  loading: false,
                  name: userData.data.user.name,
                  organization_id: userData.data.user.organization_id
                }
                return knownAccounts[userData.data.user.id]
              } catch {
                return next(new ApiError('Failed to parse user data from Zendesk', 500))
              }
            }, (userDataError : AxiosError) => {
              return next(new ApiError('Failed to fetch ticket users from Zendesk', userDataError.response?.status))
            })
          }
        }))
      }
      findUsers(ticketData.data.ticket.collaborator_ids).then(() => {
        axiosZendesk({
          params: {
            sort: 'created_at',
            sort_order: 'desc'
          },
          url: `/tickets/${request.params['id']}/comments.json`
        }).then((ticketComments : {
          data : {
            comments : Array<_ZdComment>
          }
        }) => {
          let filteredComments : Array<_ZdComment>
          let uniqueAuthors : Array<number> = []
          try {
            filteredComments = ticketComments.data.comments.filter(comment => {
              return comment.public
            })
            filteredComments.forEach(filteredComment => {
              if (!uniqueAuthors.some(authorId => {
                return authorId === filteredComment.author_id
              })) {
                uniqueAuthors.push(filteredComment.author_id)
              }
            })
          } catch {
            return next(new ApiError('Failed to filter unique authors from Zendesk data', 500))
          }
          findUsers(uniqueAuthors).then(() => {
            let authUser : boolean
            try {
              authUser = request.nf_token!.email.endsWith('@netlify.com') || Object.values(knownAccounts).some(knownAccountArrayItem => {
                return knownAccountArrayItem.id === request.nf_token!.zd_id || knownAccountArrayItem.organization_id === request.nf_token!.zd_org
              })
            } catch {
              return next(new ApiError('Failed to verify if user exists in the list of authenticated users for this ticket', 500))
            }
            if (authUser) {
              try {
                const collaborators = ticketData.data.ticket.collaborator_ids.filter(collaboratorId => {
                  return !knownAccounts[collaboratorId]!.email.endsWith('@netlify.com')
                })
                response.status(200).json(<{
                  ticket : _ZdTicket
                  users : Array<_ZdUser>
                }>{
                  ticket: {
                    collaborator_ids: collaborators,
                    comments: filteredComments.map(filteredComment => {
                      return {
                        attachments : filteredComment.attachments,
                        author_id : filteredComment.author_id,
                        body : filteredComment.body,
                        created_at : filteredComment.created_at,
                        id : filteredComment.id,
                        public : filteredComment.public
                      }
                    }),
                    created_at: ticketData.data.ticket.created_at,
                    id: ticketData.data.ticket.id,
                    loading: false,
                    requester_id: ticketData.data.ticket.requester_id,
                    status: ticketData.data.ticket.status,
                    subject: ticketData.data.ticket.subject,
                    updated_at: ticketData.data.ticket.updated_at
                  },
                  users: uniqueAuthors.map(author => {
                    return knownAccounts[author]
                  }).concat(collaborators.map(collaborator => {
                    return knownAccounts[collaborator]
                  }))
                })
              } catch {
                return next(new ApiError('Failed to prepare response for list of comments', 500))
              }
            } else {
              return next(new ApiError('Failed to verify your access rights against this ticket', 403))
            }
          })
        }, (ticketCommentsError : AxiosError) => {
          return next(new ApiError('Failed to fetch ticket comments from Zendesk', ticketCommentsError.response?.status))
        })
      })
    }, (ticketDataError : AxiosError) => {
      return next(new ApiError('Failed to fetch ticket details from Zendesk', ticketDataError.response?.status))
    })
  }
}