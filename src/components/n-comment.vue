<!--suppress AnonymousFunctionJS, ConstantOnRightSideOfComparisonJS, HtmlUnknownAttribute, JSClassNamingConvention, NestedFunctionCallJS -->
<script
  setup
  lang = "ts">
  import type {_ZdComment, _ZdUser} from '~/@types'
  import {format, parseISO} from 'date-fns'
  import {useRoute} from 'vue-router'
  import NButton from '~/client/components/n-button.vue'
  import NTooltip from '~/client/components/n-tooltip.vue'
  const commentProps = withDefaults(defineProps<{
    comment : _ZdComment
    user : _ZdUser
  }>(), {
    comment: () => {
      return {
        attachments: [],
        author_id: 0,
        body : '',
        created_at : '',
        id: 0,
        public : false
      }
    },
    user: () => {
      return {
        email: '',
        external_id: '',
        id: 0,
        loading: false,
        name: '',
        organization_id: 0
      }
    }
  })
  const route = useRoute()
  let popperContent = $ref<'Copied!' | 'Copy link'>('Copy link')
  function copyLink() {
    popperContent = 'Copied!'
    setTimeout(() => {
      popperContent = 'Copy link'
    }, 1000)
    navigator.clipboard.writeText(`${location.origin}${route.fullPath}`)
  }
</script>
<template>
  <div
    w-bg = "cWhite dark:cBlack"
    w-border = "~ lGray300 rounded-lg solid dark:dGray700"
    w-m = "t-6"
    w-p = "6"
    w-shadow = "lShallow dark:dShallow"
    w-snap = "mt-6"
    v-bind:id = "`comment-${commentProps.comment.id}`">
    <div
      w-align = "items-center"
      w-flex = "~">
      <!--<img
        alt = "user icon"
        w-h = "8"
        w-w = "8"
        v-bind:src = "''"/>-->
      <div
        w-flex = "1">
        <h3
          w-m = "0">{{commentProps.user.name}}</h3>
        <span
          w-text = "lGray600 sm dark:dGray200">{{format(parseISO(commentProps.comment.created_at), 'iii, PPp')}}</span>
      </div>
      <NTooltip
        v-bind:content = "popperContent">
        <NButton
          level = "tertiary"
          icon = "link"
          v-bind:to = "{hash: `#comment-${commentProps.comment.id}`}"
          v-on:click = "copyLink"/>
      </NTooltip>
    </div>
    <hr
      w-border = "0 lGray100 t-1 dark:dGray300"
      w-m = "0 b-6 t-2"/>
    <p
      w-m = "0"
      w-text = "break-all">{{commentProps.comment.body}}</p>
    <template
      v-if = "commentProps.comment.attachments.length > 0">
      <hr
        w-border = "0 lGray100 t-1 dark:dGray300"
        w-m = "0 y-6"/>
      <h4
        w-m = "0">Attachments:</h4>
    </template>
  </div>
</template>