<!--suppress AnonymousFunctionJS, ConditionalExpressionJS, ConstantOnRightSideOfComparisonJS, FunctionWithMultipleReturnPointsJS, HtmlUnknownAttribute, NestedFunctionCallJS -->
<script
  setup
  lang = "ts">
  import type {_RouterLinkI} from 'vue-router'
  import {RouterLink} from 'vue-router'
  import NIcon from '~/client/components/n-icon.vue'
  const dropItemProps = withDefaults(defineProps<{
    iconL : string
    iconR? : null | string
    saving? : boolean
    text : string
    to? : null | string
    variant? : 'danger' | 'standard'
  }>(), {
    iconL: '',
    iconR: null,
    saving: false,
    text: '',
    to: null,
    variant: 'standard'
  })
  let dropEl = $computed<{
    attrs : {
      [key : string] : string
    }
    el : 'a' | 'button' | _RouterLinkI
  }>(() => {
    if (dropItemProps.to) {
      if (dropItemProps.to.startsWith('http')) {
        return {
          attrs: {
            href: dropItemProps.to,
            target: '_blank',
            rel: 'nofollow noopener noreferrer',
            'w-bg': dropElStyles.bg
          },
          el : 'a'
        }
      } else {
        return {
          attrs: {
            to: dropItemProps.to,
            'w-bg': dropElStyles.bg
          },
          el: RouterLink
        }
      }
    } else {
      return {
        attrs: {
          'w-animate': `${dropItemProps.saving ? 'stripes' : ''} duration-1s ease-linear loop`,
          'w-bg': `${dropElStyles.bg} ${dropItemProps.saving ? 'lStripes dark:dStripes' : ''} wTransparent`,
          'w-pointer': dropItemProps.saving ? 'none' : 'auto'
        },
        el: 'button'
      }
    }
  })
  let dropElStyles = $computed<{
    bg : string
    text : string
  }>(() => {
    switch (dropItemProps.variant) {
      case 'danger':
        return {
          bg: 'hover:lRed100 hover:dark:dRed500',
          text: 'lRed500 dark:dRed200'
        }
      case 'standard':
      default:
        return {
          bg: 'hover:lGray300 hover:dark:dGray500',
          text: 'cBlack dark:cWhite'
        }
    }
  })
</script>
<template>
  <component
    w-align = "items-center"
    w-border = "0"
    w-box = "border"
    w-cursor = "pointer"
    w-flex = "~"
    w-font = "semibold sans"
    w-leading = "tight"
    w-p = "x-4 y-3"
    w-space = "x-2"
    w-w = "full"
    v-bind = "dropEl.attrs"
    v-bind:is = "dropEl.el"
    v-bind:w-text = "`${dropElStyles.text} base no-underline`">
    <NIcon
      v-bind:name = "dropItemProps.iconL"
      v-bind:size = "6"/>
    <span
      w-text = "space-nowrap">{{dropItemProps.text}}</span>
    <NIcon
      v-bind:name = "dropItemProps.iconR"
      v-bind:size = "4"
      v-if = "dropItemProps.iconR"/>
  </component>
</template>
<!--
  <safe
    w-animate = "duration-1s ease-linear stripes loop"
    w-bg = "lStripes wTransparent dark:dStripes hover:lGray300 hover:lRed100 hover:dark:dGray500 hover:dark:dRed500"
    w-pointer = "auto none"
    w-text = "base cBlack lRed500 no-underline dark:dRed200 dark:cWhite"/>
-->