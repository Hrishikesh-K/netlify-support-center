<!--suppress AnonymousFunctionJS, ConditionalExpressionJS, ConstantOnRightSideOfComparisonJS, HtmlUnknownAttribute -->
<script
  setup
  lang = "ts">
  import type {_UiFile, _UiSupportCategory} from '~/@types'
  import axios from 'axios'
  import {sum} from 'mathjs'
  import {v4} from 'uuid'
  import {useStore} from '~/client/store'
  import NButton from '~/client/components/n-button.vue'
  import NEditor from '~/client/components/n-editor.vue'
  import NIcon from '~/client/components/n-icon.vue'
  import NLogin from '~/client/components/n-login.vue'
  import NSelectInput from '~/client/components/n-select-input.vue'
  import NTextInput from '~/client/components/n-text-input.vue'
  const store = useStore()
  const supportCategories : Array<_UiSupportCategory> = [{
    id: v4(),
    name: 'Billing'
  }, {
    id: v4(),
    name: 'Edge Functions'
  }, {
    id: v4(),
    name: 'Functions'
  }, {
    id: v4(),
    name: 'Site building'
  }]
  let ticketCategory = $ref<_UiSupportCategory>({
    id: '',
    name: ''
  })
  let ticketFiles = $ref<Array<_UiFile>>([])
  let ticketLink = $ref<string>('')
  let ticketMessage = $ref<string>('')
  function ticketSubmit() {
    axios({
      data: {
        category: ticketCategory,
        email: store.nUser.email,
        files: ticketFiles.map(file => {
          return {
            base64: file.base64,
            name: file.name
          }
        }),
        link: ticketLink,
        message: ticketMessage,
        name: store.nUser.full_name
      },
      method: 'post',
      url: '/api/ticket/new'
    })
  }
</script>
<template>
  <template
    v-if = "!store.zUser.loading">
    <div
      w-align = "items-center"
      w-bg = "lGold200 dark:dGold500"
      w-border = "rounded-md"
      w-flex = "~"
      w-m = "b-6"
      w-p = "4"
      w-text = "lGold500 dark:dGold200"
      v-if = "store.nUser.priority < 9">
      <NIcon
        name = "triangle-exclamation"/>
      <p
        w-m = "0 l-2">As a starter user, you are eligible for support only in the&nbsp;<span>
        <a
          href = "https://answers.netlify.com/"
          target = "_blank"
          rel = "nofollow noopener noreferrer"
          w-text = "lGold500 underline dark:dGold200">forums</a>
      </span>.</p>
    </div>
    <form
      v-on:submit.prevent = "ticketSubmit"
      v-else>
      <NTextInput
        readonly
        required
        label = "Name"
        w-w = "full xs:2/3 sm:1/2"
        v-model = "store.nUser.full_name"/>
      <NTextInput
        readonly
        required
        label = "Email"
        type = "email"
        w-m = "t-6"
        w-w = "full xs:2/3 sm:1/2"
        v-model = "store.nUser.email"/>
      <NTextInput
        required
        label = "Link"
        type = "url"
        w-m = "t-6"
        w-w = "full xs:2/3 sm:1/2"
        v-model = "ticketLink"/>
      <NSelectInput
        label = "Category"
        w-m = "t-6"
        w-w = "full xs:2/3 sm:1/2"
        v-bind:options = "supportCategories"
        v-on:update-choice = "ticketCategory = $event"/>
      <NEditor
        w-m = "y-6"
        v-bind:used-size = "sum(store.nUser.email.length, store.nUser.full_name.length, ticketCategory.name.length)"
        v-model = "ticketMessage"
        v-on:update-files = "ticketFiles = $event"/>
      <NButton
        level = "primary"
        text = "Submit"
        type = "submit"/>
    </form>
  </template>
  <NLogin
    v-else/>
</template>
<!--
  <safe
    w-cursor = "auto not-allowed"
    w-pointer = "auto none"/>
-->