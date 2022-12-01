<!--suppress AnonymousFunctionJS, ConditionalExpressionJS, ConstantOnRightSideOfComparisonJS, FallThroughInSwitchStatementJS, FunctionWithMultipleReturnPointsJS, FunctionWithInconsistentReturnsJS, HtmlUnknownAttribute, NestedConditionalExpressionJS, NestedFunctionCallJS, NestedSwitchStatementJS, OverlyComplexFunctionJS -->
<script
  setup
  lang = "ts">
  import type {_RouterLinkI} from 'vue-router'
  import {RouterLink} from 'vue-router'
  import NIcon from '~/client/components/n-icon.vue'
  const btnProps = withDefaults(defineProps<{
    disabled? : boolean
    fontWeight? : string
    icon? : null | string
    iconSize? : number
    iconX? : 'left' | 'right'
    level? : 'primary' | 'secondary' | 'tertiary'
    saving? : boolean
    text? : null | string
    textSize? : string
    to? : null | Object | string
    type? : 'button' | 'reset' | 'submit'
    variant? : 'danger' | 'pop' | 'pop-alt' | 'standard'
  }>(), {
    disabled: false,
    fontWeight: 'medium',
    icon: null,
    iconSize: 4,
    iconX: 'left',
    level: 'secondary',
    saving: false,
    text: null,
    textSize: 'base',
    to: null,
    type: 'button',
    variant: 'standard'
  })
  let btnEl = $computed<{
    attrs : {
      [key : string] : boolean | Object | string
    }
    el : 'a' | 'button' | _RouterLinkI
  }>(() => {
    if (btnProps.to) {
      if (typeof btnProps.to === 'string' && btnProps.to.startsWith('http')) {
        return {
          attrs: {
            href: btnProps.to,
            target: '_blank',
            rel: 'nofollow noopener noreferrer',
            'w-bg': btnStyle.bg
          },
          el: 'a'
        }
      } else {
        return {
          attrs: {
            to: btnProps.to,
            'w-bg': btnStyle.bg
          },
          el: RouterLink
        }
      }
    } else {
      return {
        attrs: {
          disabled: btnProps.disabled || btnProps.saving,
          type: btnProps.type,
          'w-animate': `${btnProps.saving ? 'stripes' : ''} duration-1s ease-linear loop`,
          'w-bg': `${btnStyle.bg} ${btnProps.saving ? 'lStripes dark:dStripes' : ''} 300% left-top repeat-x`,
          'w-pointer': btnProps.disabled || btnProps.saving ? 'none' : 'auto'
        },
        el: 'button'
      }
    }
  })
  let btnStyle = $computed<{
    bg : string,
    text : string
  }>(() => {
    switch (btnProps.level) {
      case 'primary':
        switch (btnProps.variant) {
          case 'danger':
            return {
              bg: 'lRed300 dark:dRed200 hover:lRed200 hover:dark:dRed100',
              text: 'cBlack dark:dRed500'
            }
          case 'pop':
            return {
              bg: 'lBlue300 dark:dBlue100 hover:lBlue400 hover:dark:dBlue200',
              text: 'cWhite dark:dBlue500'
            }
          case 'pop-alt':
            return {
              bg: 'lGold200 dark:dGold200 hover:lGold300 hover:dark:dGold100',
              text: 'cBlack dark:dGold500'
            }
          case 'standard':
            return {
              bg: 'lTeal300 dark:dTeal300 hover:lTeal200 hover:dark:dTeal200',
              text: 'lTeal500 dark:dTeal500'
            }
        }
      case 'tertiary':
        switch (btnProps.variant) {
          case 'danger':
            return {
              bg: 'wTransparent dark:wTransparent hover:lRed100 hover:dark:dGray500',
              text: 'lRed500 dark:dRed200'
            }
          case 'pop':
            return {
              bg: 'wTransparent dark:wTransparent hover:lBlue100 hover:dark:dBlue500',
              text: 'lBlue300 dark:dBlue200 hover:lBlue400 hover:dark:dBlue100'
            }
          case 'pop-alt':
            return {
              bg: 'wTransparent dark:wTransparent hover:lGold100 hover:dark:dGray500',
              text: 'lGold300 dark:dGold200'
            }
          case 'standard':
            return {
              bg: 'wTransparent dark:wTransparent hover:lTeal100 hover:dark:dGray500',
              text: 'cBlack dark:cWhite hover:lTeal500 hover:dark:cWhite'
            }
        }
      case 'secondary':
      default:
        switch (btnProps.variant) {
          case 'danger':
            return {
              bg: 'lGray300 dark:dGray400 hover:lRed100 hover:dark:dRed500',
              text: 'lRed500 dark:dRed200'
            }
          case 'pop':
            return {
              bg: 'lGray300 dark:dGray400 hover:lBlue100 hover:dark:dBlue500',
              text: 'lBlue300 dark:dBlue100'
            }
          case 'pop-alt':
            return {
              bg: 'lGray300 dark:dGray400 hover:lGold100 hover:dark:dTeal500',
              text: 'lGold300 dark:dGold200'
            }
          case 'standard':
            return {
              bg: 'lGray300 dark:dGray400 hover:lTeal100 hover:dark:dTeal500',
              text: 'cBlack dark:cWhite hover:lTeal500 hover:dark:cWhite'
            }
        }
    }
  })
</script>
<template>
  <div
    w-display = "inline-block"
    v-bind:w-cursor = "btnProps.disabled || btnProps.saving ? 'not-allowed' : 'auto'"
    v-bind:w-opacity = "btnProps.disabled || btnProps.saving ? '50' : '100'">
    <component
      w-align = "items-center"
      w-border = "0 rounded-md"
      w-box = "border"
      w-cursor = "pointer"
      w-flex = "~"
      w-justify = "center"
      w-leading = "tight"
      w-min-h = "9"
      v-bind = "btnEl.attrs"
      v-bind:is = "btnEl.el"
      v-bind:w-font = "btnProps.fontWeight"
      v-bind:w-p = "btnProps.text ? 'x-4 y-2' : '0'"
      v-bind:w-ring = "`${btnProps.level === 'primary' ? 'focus:offset-2 focus:offset-cWhite focus:dark:offset-cBlack' : ''} focus:2 focus:lTeal300 focus:dark:dTeal300`"
      v-bind:w-text = "`${btnStyle.text} ${btnProps.textSize} center no-underline`"
      v-bind:w-w = "btnProps.text ? 'auto' : '9'">
      <NIcon
        w-flex = "shrink-0"
        v-bind:name = "btnProps.icon"
        v-bind:size = "btnProps.iconSize"
        v-bind:w-m = "btnProps.text ? btnProps.iconX === 'left' ? 'xs:r-2' : 'xs:l-2' : null"
        v-bind:w-order = "btnProps.iconX === 'left' ? '1' : '2'"
        v-if = "btnProps.icon"/>
      <span
        v-bind:w-display = "btnProps.icon ? 'hidden xs:block' : null"
        v-bind:w-order = "btnProps.iconX === 'left' ? '2' : '1'"
        v-if = "btnProps.text">{{btnProps.text}}<template
        v-if = "btnProps.saving">...</template></span>
    </component>
  </div>
</template>
<!--
  <safe
    w-animate = "duration-1s ease-linear stripes loop none"
    w-bg = "300% lBlue300 left-top lGold200 lGray300 lRed300 lStripes lTeal300 repeat-x wTransparent dark:dBlue100 dark:dGold200 dark:dGray400 dark:dRed200 dark:dStripes dark:dTeal300 dark:wTransparent hover:lBlue100 hover:lBlue400 hover:lGold100 hover:lGold300 hover:lRed100 hover:lRed200 hover:lTeal100 hover:lTeal200 hover:dark:dBlue200 hover:dark:dBlue500 hover:dark:dGold100 hover:dark:dGray500 hover:dark:dRed100 hover:dark:dRed500 hover:dark:dTeal200 hover:dark:dTeal500"
    w-cursor = "auto not-allowed"
    w-font = "medium semibold"
    w-display = "hidden xs:block
    w-m = "xs:l-2 xs:r-2"
    w-opacity = "50 100"
    w-order = "1 2"
    w-p = "0 x-4 y-2"
    w-pointer = "auto none"
    w-ring = "focus:2 focus:offset-2 focus:offset-cWhite focus:lTeal300 focus:dark:dTeal300 focus:dark:offset-cBlack"
    w-text = "cBlack center cWhite lBlue300 lGold300 lRed500 lTeal500 no-underline xl dark:cWhite dark:dBlue100 dark:dBlue200 dark:dBlue500 dark:dGold200 dark:dGold500 dark:dRed200 dark:dRed500 dark:dTeal500 hover:lBlue400 hover:lTeal500 hover:dark:cWhite hover:dark:dBlue100"
    w-w = "9 auto"/>
-->