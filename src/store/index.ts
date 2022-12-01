// noinspection AnonymousFunctionJS, ChainedFunctionCallJS, NestedFunctionCallJS

import type {_NUser, _UiToast, _ZdTicket, _ZdUser} from '~/@types'
import axios from 'axios'
import {defineStore} from 'pinia'
import {stringify} from 'qs'
export const useStore = defineStore('main', {
  actions: {
    errorHandler(error : Error) {
      if (axios.isAxiosError(error)) {
        this.error = {
          message: error.response?.data.message || null,
          notification: error.response?.data.notification || null,
          request_id: error.response?.data['request_id'] || null,
          status: error.response?.status || 1001
        }
      } else {
        this.error = {
          message: null,
          notification: null,
          request_id: null,
          status: 1001
        }
      }
    },
    login(path : string) {
      this.loginLoading = true
      const csrf : number = parseInt((Math.random() * 100000).toFixed(0))
      localStorage.setItem('csrf', csrf.toString())
      location.href = `/api/oauth/authorize?${stringify({
        csrf,
        path
      })}`
    }
  },
  state: () => (<{
    compLoading : boolean
    error : {
      message : null | string
      notification : null | 'failed' | 'posted' | 'skipped'
      request_id : null | string
      status : number
    }
    loginLoading : boolean
    nUser : _NUser
    toasts : Array<_UiToast>
    ticketSel : _ZdTicket
    zUser: _ZdUser
  }>{
    compLoading: false,
    error: {
      message: null,
      notification: null,
      request_id: null,
      status: 0
    },
    loginLoading: false,
    nUser: {
      accounts: [],
      avatar_url: '',
      email: '',
      full_name: '',
      id: '',
      priority: 0,
      loading: true
    },
    toasts: [],
    ticketSel: {
      collaborator_ids: [],
      comments: [],
      created_at: '',
      fields: [],
      id: 0,
      loading: true,
      requester_id: 0,
      status: 'new',
      subject: '',
      updated_at: ''
    },
    zUser: {
      email: '',
      external_id: '',
      id: 0,
      loading: true,
      name: '',
      organization_id: 0
    }
  })
})