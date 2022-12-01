<!--suppress ConditionalExpressionJS, HtmlUnknownAttribute -->
<script
  setup
  lang = "ts">
  import {useRoute} from 'vue-router'
  import {useStore} from '~/client/store'
  import NAuthNeeded from '~/client/assets/auth-needed.svg?component'
  import NButton from '~/client/components/n-button.vue'
  const route = useRoute()
  const store = useStore()
</script>
<template>
  <div
    w-align = "items-center"
    w-flex = "~ wrap"
    w-gap = "6"
    w-p = "x-6">
    <NAuthNeeded
      w-max-h = "100"
      w-max-w = "100"
      w-w = "full"/>
    <div
      w-flex = "xs:1"
      w-w = "<xs:full">
      <p
        w-font = "bold"
        w-m = "0"
        w-text = "center xl sm:2xl">You need to be logged in to view this page</p>
      <div
        w-m = "t-6 x-auto"
        w-w = "fit">
        <NButton
          level = "primary"
          icon = "arrow-right-to-bracket"
          text = "Login"
          v-bind:saving = "store.loginLoading"
          v-on:click = "store.loginLoading ? null : store.login(route.path)"/>
      </div>
    </div>
  </div>
</template>