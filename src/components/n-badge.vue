<!--suppress AnonymousFunctionJS, FunctionWithMultipleReturnPointsJS, HtmlUnknownAttribute, NestedFunctionCallJS -->
<script
  setup
  lang = "ts">
  const badgeProps = withDefaults(defineProps<{
    text : string
    variant? : 'error' | 'info' | 'success' | 'warn'
  }>(), {
    text: 'badge',
    variant: 'warn'
  })
  let badgeStyles = $computed<{
    bg : string
    text : string
  }>(() => {
    switch (badgeProps.variant) {
      case 'error':
        return {
          bg: 'lRed100 dark:dRed500',
          text: 'lRed500 dark:dRed200'
        }
      case 'success':
        return {
          bg: 'lTeal100 dark:dTeal500',
          text: 'lTeal500 dark:dTeal200'
        }
      case 'warn':
        return {
          bg: 'lGold100 dark:dGold500',
          text: 'lGold500 dark:dGold200'
        }
      case 'info':
      default:
        return {
          bg: 'lGray300 dark:dGray400',
          text: 'cBlack dark:cWhite'
        }
    }
  })
</script>
<template>
  <span
    w-align = "self-center"
    w-border = "rounded-md"
    w-font = "bold"
    w-p = "x-1 y-0.5"
    v-bind:w-bg = "badgeStyles.bg"
    v-bind:w-text = "`${badgeStyles.text} capitalize sm`">{{badgeProps.text}}</span>
</template>
<!--
  <safe
    w-bg = "lGold100 lGray300 lRed100 lTeal100 dark:dGold500 dark:dGray400 dark:dRed500 dark:dTeal500"
    w-text = "capitalize cBlack lGold500 lRed500 lTeal500 sm dark:cWhite dark:dGold200 dark:dRed200 dark:dTeal200"/>
-->