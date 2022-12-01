<!--suppress ConditionalExpressionJS, HtmlUnknownAttribute, MagicNumberJS, NestedFunctionCallJS -->
<script
  setup
  lang = "ts">
  import NIcon from '~/client/components/n-icon.vue'
  const tagEmits = defineEmits<{
    (event : 'tagDelete') : void
    (event : 'tagEdit', value : string) : void
  }>()
  const tagProps = withDefaults(defineProps<{
    deleted : boolean
    regex? : RegExp,
    text : string
  }>(), {
    deleted: false,
    regex: () => {
      return /./
    },
    text: ''
  })
  let tagEdit = $ref<boolean>(false)
  let tagEl = $ref<null | HTMLInputElement>(null)
  let tagText = $computed<string>({
    get: () => {
      return tagProps.text
    },
    set: value => {
      tagEmits('tagEdit', value)
    }
  })
  let tagWidthEl = $ref<null | HTMLElement>(null)
</script>
<template>
  <li
    w-align = "items-center"
    w-border = "rounded"
    w-font = "bold"
    w-flex = "~"
    w-p = "x-2 y-1"
    w-space = "x-1"
    v-bind:w-bg = "tagProps.deleted || !tagProps.regex.test(tagText) ? 'lRed300 dark:dRed200 hover:lRed200 hover:dark:dRed100' : 'lGray200 dark:dGray400 hover:lGray300 hover:dark:dGray500'"
    v-bind:w-text = "`${tagProps.deleted || !tagProps.regex.test(tagText) ? 'line-through dark:dRed500' : 'dark:cWhite'} cBlack sm`">
    <form
      w-pos = "relative"
      v-bind:style = "`width:${tagWidthEl?.getBoundingClientRect().width || 50}px`"
      v-if = "tagEdit"
      v-on:submit.prevent = "tagEmits('tagEdit', tagEl?.value || '')">
      <input
        required
        placeholder = "New email"
        ref = "tagEl"
        w-bg = "wTransparent"
        w-border = "0"
        w-font = "bold"
        w-outline = "none"
        w-p = "0"
        w-w = "full"
        v-bind:value = "tagText"
        v-bind:w-text = "`${tagProps.deleted || !tagProps.regex.test(tagText) ? 'line-through dark:dRed500' : 'dark:cWhite'} cBlack sm`"
        v-on:input = "tagText = tagEl?.value || ''"/>
      <span
        ref = "tagWidthEl"
        w-display = "invisible"
        w-pos = "absolute left-0 top-0">{{tagText}}</span>
    </form>
    <span
      w-cursor = "pointer"
      v-else
      v-on:click = "tagEdit = true">{{tagText}}</span>
    <NIcon
      name = "xmark"
      v-bind:size = "2"
      v-on:click = "tagEmits('tagDelete')"/>
  </li>
</template>
<!--
  <safe
    w-bg = "lGray200 lRed300 dark:dGray400 dark:dRed200 hover:lGray300 hover:lRed200 hover:dark:dGray500 hover:dark:dRed100"
    w-text = "cBlack line-through sm dark:cWhite dark:dRed500"/>
-->