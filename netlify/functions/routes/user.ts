// noinspection AnonymousFunctionJS, AssignmentResultUsedJS, ChainedFunctionCallJS, ConstantOnRightSideOfComparisonJS, FunctionWithInconsistentReturnsJS, FunctionWithMultipleReturnPointsJS, MagicNumberJS, NestedFunctionCallJS, NestedFunctionJS

import type {AxiosError} from 'axios'
import type {NextFunction, Request, Response} from 'express'
import type {_NAccount, _NUser, _ZdUser} from '~/@types'
import cryptoJs from 'crypto-js'
import {ApiError, axiosNetlify, axiosZendesk} from '~/server/data/constants'
export default function (request : Request, response : Response, next : NextFunction) {
  axiosNetlify({
    headers: {
      authorization: `Bearer ${request.nf_token!.access_token}`
    },
    url: '/user'
  }).then((netlifyUser : {
    data : _NUser
  }) => {
    const accounts : Array<_NAccount> = []
    function allAccounts(page = 1) {
      return new Promise<void>(resolve => {
        axiosNetlify({
          headers: {
            authorization: `Bearer ${request.nf_token!.access_token}`
          },
          params: {
            page
          },
          url: '/accounts'
        }).then((accountResponse : {
          data : Array<{
            id : string
            name : string
            support_priority? : number
            type_name : string
            type_slug : string
          }>
        }) => {
          try {
            accountResponse.data.forEach(account => {
              accounts.push({
                id: account.id,
                name: account.name,
                priority: (() => {
                  if (account.support_priority) {
                    return account.support_priority
                  } else {
                    switch (account.type_slug) {
                      case 'edge-handlers-beta':
                      case 'netlify-testing':
                        return  100000
                      case 'enterprise':
                      case 'enterprise-v2':
                        return 1000
                      case 'netlifriend':
                        return 102
                      case 'business-v1':
                      case 'business-v2':
                      case 'business-v3':
                      case 'business-v4':
                        return 100
                      case 'covid19':
                      case 'opensource':
                      case 'opensource-unlimited':
                      case 'public-good':
                        return 12
                      case 'pro-v1':
                      case 'pro-v2':
                      case 'pro-v3':
                      case 'pro-v4':
                        return 10
                      case 'free-personal':
                      case 'free-test':
                      case 'personal':
                      case 'starter':
                      case 'starter-plus':
                        return 5
                      default:
                        return 0
                    }
                  }
                })(),
                type: account.type_name
              })
            })
          } catch {
            return next(new ApiError('Failed to parse user accounts from Netlify', 500))
          }
          if (accountResponse.data.length < 100) {
            return resolve()
          } else {
            return allAccounts(page + 1)
          }
        }, (accountResponseError : AxiosError) => {
          return next(new ApiError('Failed to fetch user accounts from Netlify', accountResponseError.response?.status))
        })
      })
    }
    allAccounts().then(() => {
      let zendeskUser : _ZdUser
      const priority = accounts.reduce((previousPriority, currentAccount) => {
        if (previousPriority < currentAccount.priority) {
          return currentAccount.priority
        } else {
          return previousPriority
        }
      }, 0)
      function userData() {
        try {
          response.cookie('nf_token', cryptoJs.AES.encrypt(JSON.stringify({
            access_token: request.nf_token!.access_token,
            email: netlifyUser.data.email,
            id: netlifyUser.data.id,
            full_name: netlifyUser.data.full_name,
            priority,
            zd_id: zendeskUser.id,
            zd_org: zendeskUser.organization_id
          }), process.env['COOKIE_SECRET'] || '').toString(), {
            httpOnly: true,
            maxAge: 86400000,
            path: '/api/',
            sameSite: 'strict',
            secure: true
          })
          response.status(200).json(<{
            ntl : _NUser
            zd : _ZdUser
          }>{
            ntl: {
              accounts,
              avatar_url: netlifyUser.data.avatar_url,
              email: netlifyUser.data.email,
              full_name: netlifyUser.data.full_name,
              id: netlifyUser.data.id,
              priority,
              loading: false
            },
            zd: {
              email: netlifyUser.data.email,
              external_id: netlifyUser.data.id,
              id: zendeskUser.id,
              loading: false,
              name: netlifyUser.data.full_name,
              organization_id: zendeskUser.organization_id
            }
          })
        } catch {
          return next(new ApiError('Failed to prepare response from Netlify and Zendesk', 500))
        }
      }
      axiosZendesk({
        params: {
          query: `type:user external_id:"${netlifyUser.data.id}"`
        },
        url: '/users/search.json'
      }).then((zendeskIdUsers : {
        data : {
          users : Array<_ZdUser>
        }
      }) => {
        if (zendeskIdUsers.data.users.length > 0) {
          zendeskUser = zendeskIdUsers.data.users[0] as _ZdUser
          userData()
        } else {
          axiosZendesk({
            params: {
              query: `type:user email:"${netlifyUser.data.email}"`
            },
            url: '/users/search.json'
          }).then((zendeskEmailUsers : {
            data : {
              users:  Array<_ZdUser>
            }
          }) => {
            function setUser(type : 'create' | 'update') {
              let method : 'post' | 'put'
              let url : string
              try {
                if (type === 'create') {
                  method = 'post'
                  url = '/users.json'
                } else {
                  method = 'put'
                  url = `/users/${zendeskUser.id}.json`
                }
              } catch {
                return next(new ApiError('Failed to prepare creation or updation of user in Zendesk', 500))
              }
              axiosZendesk({
                data: {
                  user: {
                    email: netlifyUser.data.email,
                    external_id: netlifyUser.data.id,
                    name: netlifyUser.data.full_name,
                    verified: true
                  }
                },
                method,
                url
              }).then((zendeskUserUpdated : {
                data : {
                  user : _ZdUser
                }
              }) => {
                zendeskUser = zendeskUserUpdated.data.user
                userData()
              }, (zendeskUserUpdateError : AxiosError) => {
                return next(new ApiError('Failed to create or update user in Zendesk', zendeskUserUpdateError.response?.status))
              })
            }
            if (zendeskEmailUsers.data.users.length > 0) {
              zendeskUser = zendeskEmailUsers.data.users[0] as _ZdUser
              setUser('update')
            } else {
              setUser('create')
            }
          }, (zendeskEmailUsersError : AxiosError) => {
            return next(new ApiError('Failed to find users by Netlify e-mail address in Zendesk', zendeskEmailUsersError.response!.status))
          })
        }
      }, (zendeskIdUsersError : AxiosError) => {
        return next(new ApiError('Failed to find users by Netlify ID in Zendesk', zendeskIdUsersError.response?.status))
      })
    })
  }, (netlifyUserError : AxiosError) => {
    return next(new ApiError('Failed to fetch user details from Netlify', netlifyUserError.response?.status))
  })
}