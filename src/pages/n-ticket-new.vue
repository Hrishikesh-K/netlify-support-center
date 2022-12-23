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
  const selectedTicketCategory = $computed(() => {
    return ticketCategory.find(availableCategory => {
      return availableCategory.selected
    }) || {
      id: '',
      name: ''
    }
  })
  const selectedTicketSites = $computed(() => {
    return ticketSites.filter(availableSite => {
      return availableSite.selected
    })
  })
  const usedSize = $computed(() => {
    return sum(selectedTicketCategory.name.length, selectedTicketSites.reduce((previousTotal, selectedSite) => {
      return previousTotal + selectedSite.id.length
    }, 0), ticketSubject.length) as number
  })
  const store = useStore()
  let ticketCategory = $ref<Array<_UiSupportCategory>>([{
    id: v4(),
    name: 'Billing',
    selected: false
  }, {
    id: v4(),
    name: 'Edge Functions',
    selected: false
  }, {
    id: v4(),
    name: 'Functions',
    selected: false
  }, {
    id: v4(),
    name: 'Site building',
    selected: false
  }])
  let ticketFiles = $ref<Array<_UiFile>>([])
  let ticketSites = $ref<Array<_UiSupportCategory>>([{
    id: v4(),
    name: 'Site 1',
    selected: false
  }, {
    id: v4(),
    name: 'Site 2',
    selected: false
  }, {
    id: v4(),
    name: 'Site 3',
    selected: false
  }, {
    id: v4(),
    name: 'Site 4',
    selected: false
  }])
  let ticketLink = $ref<string>('')
  let ticketMessage = $ref<string>('')
  let ticketSubject = $ref<string>('')
  function ticketSubmit() {
    axios({
      data: {
        category: selectedTicketCategory!.name,
        files: ticketFiles.map(file => {
          return {
            base64: file.base64,
            name: file.name
          }
        }),
        link: ticketLink,
        sites: selectedTicketSites.map(site => {
          return site.id
        }),
        subject: ticketSubject,
        message: ticketMessage,
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
      v-else
      v-on:submit.prevent = "ticketSubmit">
      <NTextInput
        required
        label = "Subject"
        w-w = "full xs:2/3 sm:1/2"
        v-model = "ticketSubject"/>
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
        v-bind:options = "ticketCategory"
        v-on:update-choice = "ticketCategory = $event"/>
      <NSelectInput
        multiple
        label = "Site(s)"
        w-m = "t-6"
        w-w = "full xs:2/3 sm:1/2"
        v-bind:options = "ticketSites"
        v-on:update-choice = "ticketSites = $event"/>
      <NEditor
        w-m = "y-6"
        v-bind:used-size = "usedSize"
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