<!--suppress AnonymousFunctionJS, ChainedFunctionCallJS, ConditionalExpressionJS, ConstantOnRightSideOfComparisonJS, HtmlUnknownAttribute, NestedFunctionCallJS -->
<script
  setup
  lang = "ts">
  import type {WatchStopHandle} from 'vue'
  import type {_ZdTicket, _ZdUser} from '~/@types'
  import axios from 'axios'
  import {format, parseISO} from 'date-fns'
  import {onMounted, watch} from 'vue'
  import {useRoute} from 'vue-router'
  import {useStore} from '~/client/store'
  import NButton from '~/client/components/n-button.vue'
  import NComment from '~/client/components/n-comment.vue'
  import NLogin from '~/client/components/n-login.vue'
  import NTagParent from '~/client/components/n-tag-parent.vue'
  import NTextInput from '~/client/components/n-text-input.vue'
  import NTooltip from '~/client/components/n-tooltip.vue'
  const route = useRoute()
  const store = useStore()
  let ccTags = $computed<Array<{
    deleted : boolean
    id : number | string
    text : string
  }>>({
    get: () => {
      return pendingChanges.cc.map(cc => {
        return {
          deleted: cc.deleted || false,
          id: cc.id,
          text: cc.email
        }
      })
    },
    set: value => {
      pendingChanges.cc = value.map(tag => {
        return {
          deleted: tag.deleted,
          email: tag.text,
          id: tag.id
        }
      })
    }
  })
  let pendingChanges = $ref<{
    cc : Array<{
      deleted : boolean
      email : string
      id : number | string
    }>
    subject : string
  }>({
    cc: [],
    subject: ''
  })
  let ticketUsers = $ref<Array<_ZdUser>>([])
  let ticketEditing = $ref<boolean>(false)
  let watchUser : null | WatchStopHandle = null
  function changesDiscard() {
    ticketEditing = false
    pendingChanges.cc = []
    pendingChanges.subject = ''
  }
  function changesStart() {
    ticketEditing = true
    if (pendingChanges.subject === '') {
      pendingChanges.subject = store.ticketSel.subject
    }
    if (pendingChanges.cc.length === 0) {
      store.ticketSel.collaborator_ids.forEach(collaboratorId => {
        const user = ticketUsers[ticketUsers.findIndex(ticketUser => {
          return ticketUser.id === collaboratorId
        })] as _ZdUser
        pendingChanges.cc.push({
          deleted: false,
          email: user.email,
          id: user.id
        })
      })
    }
  }
  function changesSave() {
    ticketEditing = false
    if (!pendingChanges.cc.every(pendingCc => {
      return ticketUsers.some(ticketUser => {
        return ticketUser.id === pendingCc.id
      })
    }) && pendingChanges.subject !== store.ticketSel.subject) {
      store.ticketSel.loading = true
      axios({
        data: {
          collaborator_ids: pendingChanges.cc,
          subject: pendingChanges.subject
        },
        method: 'put',
        url: `/api/ticket/${route.params['ticketId']}`
      })
    }
  }
  function fetchTicket() {
    axios({
      url: `/api/ticket/${route.params['ticketId']}`
    }).then((ticketData : {
      data : {
        ticket : _ZdTicket,
        users : Array<_ZdUser>
      }
    }) => {
      ticketUsers = ticketData.data.users
      store.ticketSel = ticketData.data.ticket
    }, store.errorHandler)
  }
  function findUser(id : number) : _ZdUser {
    return ticketUsers[ticketUsers.findIndex(ticketUser => {
      return ticketUser.id === id
    })] as _ZdUser
  }
  onMounted(() => {
    store.ticketSel.loading = true
    if (store.zUser.loading) {
      watchUser = watch(() => {
        return store.zUser.loading
      }, () => {
        if (!store.zUser.loading) {
          (watchUser as WatchStopHandle)()
          fetchTicket()
        }
      })
    } else {
      fetchTicket()
    }
  })
</script>
<template>
  <div
    w-align = "items-start"
    w-flex = "~ <xs:wrap"
    w-gap = "3"
    w-pos = "relative">
    <div
      w-order = "2 xs:1"
      w-w = "full xs:1/2 sm:3/5">
      <div
        w-bg = "cWhite dark:cBlack"
        w-border = "~ lGray300 rounded-lg solid dark:dGray700"
        w-p = "6"
        w-shadow = "lShallow dark:dShallow">
        <div
          w-align = "items-center"
          w-flex = "~">
          <h2
            w-flex = "1"
            w-m = "0">Comments</h2>
          <NTooltip
            content = "New comment">
            <NButton
              icon = "message-plus"
              level = "primary"/>
          </NTooltip>
        </div>
      </div>
      <template
        v-if = "!store.zUser.loading">
        <template
          v-if = "store.ticketSel.comments.length > 0">
          <NComment
            v-bind:comment = "comment"
            v-bind:user = "findUser(comment.author_id)"
            v-for = "comment in store.ticketSel.comments"/>
        </template>
        <template
          v-else>
          <div
            w-bg = "cWhite dark:cBlack"
            w-border = "~ lGray300 rounded-lg solid dark:dGray700"
            w-m = "t-6"
            w-p = "6"
            w-shadow = "lShallow dark:dShallow"
            w-snap = "mt-6"
            v-bind:key = "key"
            v-for = "key in Array.from(Array(3).keys())">
            <div
              w-flex = "~ col"
              w-gap = "y-1">
              <div
                w-animate = "pulse"
                w-bg = "lGray300 dark:dGray500"
                w-border = "rounded-md"
                w-h = "5"
                w-max-w = "75"
                w-w = "full">
              </div>
              <div
                w-animate = "pulse"
                w-bg = "lGray300 dark:dGray500"
                w-border = "rounded-md"
                w-h = "5"
                w-max-w = "50"
                w-w = "full">
              </div>
            </div>
            <hr
              w-border = "0 lGray100 t-1 dark:dGray300"
              w-m = "0 b-6 t-2"/>
            <div
              w-animate = "pulse"
              w-bg = "lGray300 dark:dGray500"
              w-border = "rounded-md"
              w-h = "25"
              w-w = "full">
            </div>
          </div>
        </template>
      </template>
    </div>
    <div
      w-bg = "cWhite dark:cBlack"
      w-border = "~ lGray300 rounded-lg solid dark:dGray700"
      w-box = "border"
      w-flex = "xs:1"
      w-p = "6"
      w-pos = "xs:sticky xs:top-6"
      w-order = "1 xs:2"
      w-shadow = "lShallow dark:dShallow"
      w-w = "<xs:full">
      <div
        w-align = "items-center"
        w-flex = "~">
        <h2
          w-flex = "1"
          w-m = "0">Info</h2>
        <template
          v-if = "ticketEditing">
          <div
            w-align = "items-center"
            w-flex = "~"
            w-gap = "3">
            <NTooltip
              content = "Save changes">
              <NButton
                icon = "floppy-disk"
                level = "primary"
                v-on:click = "changesSave"/>
            </NTooltip>
            <NTooltip
              content = "Discard changes">
              <NButton
                icon = "trash-can"
                level = "primary"
                variant = "danger"
                v-on:click = "changesDiscard"/>
            </NTooltip>
          </div>
        </template>
        <NTooltip
          content = "Edit"
          v-else-if = "store.ticketSel.status !== 'closed'">
          <NButton
            icon = "pen-to-square"
            level = "primary"
            v-on:click = "changesStart"/>
        </NTooltip>
      </div>
      <template
        v-if = "!store.zUser.loading">
        <hr
          w-border = "0 lGray100 t-1 dark:dGray300"
          w-m = "0 b-6 t-2"/>
        <p
          w-m = "0"
          v-if = "store.ticketSel.loading">Loading ticket info...</p>
        <template
          v-else>
          <template
            v-if = "ticketEditing">
            <NTextInput
              label = "Subject"
              v-model = "pendingChanges.subject"/>
            <NTagParent
              label = "CC"
              v-bind:regex = "/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/"
              v-bind:tags = "ccTags"
              v-on:tagsUpdate = "ccTags = $event"/>
          </template>
          <template
            v-else>
            <p
              w-m = "0">Subject: {{store.ticketSel.subject}}</p>
            <p
              w-m = "0">Created: {{format(parseISO(store.ticketSel.created_at), 'iii, PPp')}}</p>
            <p
              w-m = "0">Updated: {{format(parseISO(store.ticketSel.updated_at), 'iii, PPp')}}</p>
            <p
              w-m = "0">CC:</p>
            <ul
              w-m = "0"
              w-p = "0"
              w-list = "none"
              v-if = "store.ticketSel.collaborator_ids.length > 0 && ticketUsers.length > 0">
              <li
                v-bind:key = "userId"
                v-for = "userId in store.ticketSel.collaborator_ids">{{findUser(userId).email}}</li>
            </ul>
          </template>
        </template>
      </template>
    </div>
  </div>
  <NLogin
    v-if = "store.zUser.loading"/>
</template>
<!--
  <safe
    w-m = "0 l-7.5"
    w-transform = "~ scale-75 scale-100 -translate-x-4.25 translate-x-0 -translate-y-8 translate-y-0"/>
-->