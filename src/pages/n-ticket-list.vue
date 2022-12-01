<!--suppress AnonymousFunctionJS, AssignmentResultUsedJS, ConditionalExpressionJS, ConstantOnRightSideOfComparisonJS, ChainedFunctionCallJS, FunctionWithMultipleReturnPointsJS, HtmlUnknownAttribute, JSClassNamingConvention, NestedAssignmentJS, NestedFunctionCallJS -->
<script
  setup
  lang = "ts">
  import type {WatchStopHandle} from 'vue'
  import type {_ZdTicketList} from '~/@types'
  import axios from 'axios'
  import {onMounted, reactive, watch, onUnmounted} from 'vue'
  import {format, parseISO} from 'date-fns'
  import {useRoute} from 'vue-router'
  import {useStore} from '~/client/store'
  import NBadge from '~/client/components/n-badge.vue'
  import NButton from '~/client/components/n-button.vue'
  import NIcon from '~/client/components/n-icon.vue'
  import NLogin from '~/client/components/n-login.vue'
  interface _StyleAttrs {
    'w-bg' : string
    'w-text' : string
  }
  type _TicketTypes = 'ccd' | 'organization' | 'requested'
  const btnOther : _StyleAttrs = {
    'w-bg': 'lGray300 dark:dGray400 hover:lTeal100 hover:dark:dTeal500',
    'w-text': 'cBlack no-underline dark:cWhite hover:lTeal500 hover:dark:cWhite'
  }
  const btnSelected :_StyleAttrs = {
    'w-bg': 'lTeal300 dark:dTeal300 hover:lTeal200 hover:dark:dTeal200',
    'w-text': 'lTeal500 no-underline dark:dTeal500'
  }
  const route = useRoute()
  const store = useStore()
  const page = $computed<number>(() => {
    return parseInt((route.query['page'] as string) || '1')
  })
  const tickets = reactive<{
    [key in 'ccd' | 'organization' | 'requested'] : _ZdTicketList
  }>({
    ccd: {
      next_page: null,
      tickets: []
    },
    organization: {
      next_page: null,
      tickets: []
    },
    requested: {
      next_page: null,
      tickets: []
    }
  })
  const ticketList = $computed<_ZdTicketList>(() => {
    return tickets[(route.query['tab'] as _TicketTypes) || 'requested']
  })
  let btnCC = $ref<_StyleAttrs>(btnOther)
  let btnOrg = $ref<_StyleAttrs>(btnOther)
  let btnReq = $ref<_StyleAttrs>(btnOther)
  let noOrg = $ref<boolean>(false)
  let ticketLoading = $ref<boolean>(false)
  let watchTab : null | WatchStopHandle = null
  let watchUser : null | WatchStopHandle = null
  function badge(status : string) : 'error' | 'info' | 'success' | 'warn' {
    switch (status) {
      case 'closed':
        return 'error'
      case 'open':
        return 'info'
      case 'pending':
        return 'warn'
      case 'solved':
        return 'success'
      case 'new':
      default:
        return 'info'
    }
  }
  function fetchTickets(type : _TicketTypes) {
    ticketLoading = true
    let url : string
    if (type === 'organization') {
      url = `/api/tickets/organization/${store.zUser.organization_id}`
    } else {
      url = `/api/tickets/user/${store.zUser.id}/${type}`
    }
    axios({
      params: {
        page: route.query['page'] || 1
      },
      url
    }).then((ticketsResponse : {
      data : _ZdTicketList
    }) => {
      tickets[type] = ticketsResponse.data
    }, store.errorHandler).finally(() => {
      ticketLoading = false
    })
  }
  function startTabWatcher() {
    watchTab = watch(() => {
      return route.query
    }, () => {
      switch (route.query['tab']) {
        case 'ccd':
          btnCC = btnSelected
          btnOrg = btnReq = btnOther
          fetchTickets(route.query['tab'])
          break
        case 'organization':
          if (!store.zUser.organization_id) {
            noOrg = true
          }
          btnCC = btnReq = btnOther
          btnOrg = btnSelected
          fetchTickets(route.query['tab'])
          break
        case 'requested':
        default:
          btnCC = btnOrg = btnOther
          btnReq = btnSelected
          fetchTickets('requested')
      }
    }, {
      deep: true,
      immediate: true
    })
  }
  onMounted(() => {
    store.ticketSel = {
      collaborator_ids: [],
      comments: [],
      created_at: '',
      id: 0,
      loading: true,
      requester_id: 0,
      status: 'new',
      subject: '',
      updated_at: ''
    }
    if (store.zUser.loading) {
      watchUser = watch(() => {
        return store.zUser.loading
      }, () => {
        if (!store.zUser.loading) {
          (watchUser as WatchStopHandle)()
          startTabWatcher()
        }
      })
    } else {
      startTabWatcher()
    }
  })
  onUnmounted(() => {
    if (watchTab) {
      watchTab()
    }
  })
</script>
<template>
  <div
    w-bg = "cWhite dark:cBlack"
    w-border = "~ lGray300 rounded-lg solid dark:dGray700"
    w-p = "y-6"
    w-shadow = "lShallow dark:dShallow">
    <div
      w-flex = "~"
      w-gap = "x-3"
      w-justify = "between"
      w-m = "x-6">
      <h2
        w-m = "0 b-2">Tickets</h2>
      <div
        w-border = "rounded-t-md"
        w-divide = "lGray400 solid x dark:dGray500"
        w-flex = "~"
        w-scrollbar = "thin thumb-lTeal400 track-lTeal500 dark:thumb-dTeal400 dark:track-dTeal500"
        w-overflow = "x-auto">
        <RouterLink
          w-border = "0 none"
          w-font = "medium"
          w-p = "x-4 y-2"
          v-bind = "btnReq"
          v-bind:to = "{query: {...route.query, tab: 'requested'}}">Requested</RouterLink>
        <RouterLink
          w-border = "0 none"
          w-font = "medium"
          w-p = "x-4 y-2"
          v-bind = "btnCC"
          v-bind:to = "{query: {...route.query, tab: 'ccd'}}">
          <span>CC'd</span>
        </RouterLink>
        <RouterLink
          w-border = "0 none"
          w-font = "medium"
          v-bind = "btnOrg"
          w-p = "x-4 y-2"
          v-if = "store.zUser.organization_id"
          v-bind:to = "{query: {...route.query, tab: 'organization'}}">Organization</RouterLink>
      </div>
    </div>
    <hr
      w-border = "0 lGray100 t-1 dark:dGray300"
      w-m = "0 b-6 x-6"/>
    <NLogin
      v-if = "store.zUser.loading"/>
    <p
      w-m = "0 x-6"
      v-else-if = "noOrg">You're not a part of an organization</p>
    <template
      v-else-if = "ticketLoading">
      <div
        w-flex = "~ col">
        <div
          w-align = "items-center"
          w-bg = "even:lSeparator/2 even:dark:cWhite/3 hover:lSeparator/3 hover:dark:cWhite/4"
          w-flex = "~"
          w-gap = "x-3"
          w-p = "x-6 y-3"
          v-bind:key = "key"
          v-for = "key in Array.from(Array(5).keys())">
          <div
            w-animate = "pulse"
            w-bg = "lGray300 dark:dGray500"
            w-border = "rounded-md"
            w-h = "5"
            w-w = "17.5">
          </div>
          <div
            w-animate = "pulse"
            w-bg = "lGray300 dark:dGray500"
            w-border = "rounded-md"
            w-h = "5"
            w-w = "15">
          </div>
          <div
            w-flex = "~ 1 col"
            w-gap = "y-1">
            <div
              w-animate = "pulse"
              w-bg = "lGray300 dark:dGray500"
              w-border = "rounded-md"
              w-h = "5"
              w-max-w = "120"
              w-w = "full md:1/2">
            </div>
            <div
              w-animate = "pulse"
              w-bg = "lGray300 dark:dGray500"
              w-border = "rounded-md"
              w-h = "5"
              w-max-w = "90"
              w-w = "2/3 md:1/3">
            </div>
          </div>
        </div>
      </div>
    </template>
    <template
      v-else>
      <template
        v-if = "ticketList.tickets.length > 0">
        <ul
          w-list = "none"
          w-m = "0"
          w-p = "0">
          <li
            w-bg = "even:lSeparator/2 even:dark:cWhite/3 hover:lSeparator/3 hover:dark:cWhite/4"
            w-p = "x-6 y-3"
            v-bind:key = "ticket.id"
            v-for = "ticket in ticketList.tickets">
            <RouterLink
              w-align = "items-center"
              w-flex = "~"
              w-gap = "x-3"
              w-text = "lGray600 no-underline dark:dGray200 hover:cBlack hover:dark:cWhite"
              v-bind:to = "`/ticket/${ticket.id}`"
              v-on:click = "store.ticketSel = ticket">
              <p
                w-m = "0"
                w-w = "17.5">#{{ticket.id}}</p>
              <NBadge
                v-bind:text = "ticket.status"
                v-bind:variant = "badge(ticket.status)"/>
              <div
                w-flex = "1"
                w-text = "truncate">
                <p
                  w-font = "semibold"
                  w-m = "0"
                  w-text = "cBlack truncate dark:cWhite"
                  w-w = "full">{{ticket.subject}}</p>
                <p
                  w-m = "0"
                  w-text = "sm truncate">Updated: {{format(parseISO(ticket.updated_at), 'iii, PPp')}}</p>
              </div>
              <NIcon
                name = "angle-right"
                w-justify = "self-end"
                w-m = "l-auto"
                v-bind:size = "3"/>
            </RouterLink>
          </li>
        </ul>
      </template>
      <p
        w-m = "0 x-6"
        v-else>No tickets found</p>
    </template>
  </div>
  <div
    w-align = "items-center"
    w-flex = "~"
    w-gap = "6"
    w-justify = "center"
    w-m = "t-6">
    <NButton
      icon = "arrow-left"
      text = "Prev"
      v-bind:disabled = "!route.query['page'] || route.query['page'] === '1'"
      v-bind:to = "!route.query['page'] || route.query['page'] === '1' ? null : {query: {...route.query, page: page - 1}}"/>
    <p>Page {{route.query['page'] || 1}}</p>
    <NButton
      icon = "arrow-right"
      icon-x = "right"
      text = "Next"
      v-bind:disabled = "!ticketList.next_page"
      v-bind:to = "ticketList.next_page ? {query: {...route.query, page: page + 1}} : null"/>
  </div>
</template>
<!--
  <safe
    w-bg = "lGray300 lTeal300 dark:dGray400 dark:dTeal300 hover:lTeal100 hover:lTeal200 hover:dark:dTeal200 hover:dark:dTeal500"
    w-text = "cBlack lTeal500 dark:cWhite dark:dTeal500 hover:lTeal500 hover:dark:cWhite"/>
-->