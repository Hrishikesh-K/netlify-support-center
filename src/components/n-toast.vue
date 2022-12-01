<!--suppress AnonymousFunctionJS, ConditionalExpressionJS, ConstantOnRightSideOfComparisonJS, FunctionWithInconsistentReturnsJS, FunctionWithMultipleReturnPointsJS, HtmlUnknownAttribute, MagicNumberJS, NestedFunctionCallJS -->
<script
  setup
  lang = "ts">
  import type {PausableTimeout} from 'pause-me'
  import {onMounted} from 'vue'
  import pauseMe from 'pause-me'
  import {useStore} from '~/client/store'
  import NButton from '~/client/components/n-button.vue'
  import NTooltip from '~/client/components/n-tooltip.vue'
  const store = useStore()
  const toastProps = withDefaults(defineProps<{
    id : string
  }>(), {
    id: ''
  })
  let animState = $ref<boolean>(true)
  let showToast = $ref<boolean>(false)
  let toastIndex = $computed<number>(() => {
    return store.toasts.findIndex(toast => {
      return toast.id === toastProps.id
    })
  })
  let toastStyles = $computed<{
    bg : string
    text : string
  }>(() => {
    switch (store.toasts[toastIndex]!.variant) {
      case 'error':
        return {
          bg: 'lRed300 dark:dRed200',
          text: 'cBlack dark:dRed500'
        }
      case 'success':
        return {
          bg: 'lTeal300 dark:dTeal300',
          text: 'lTeal500 dark:dTeal500'
        }
      case 'warn':
        return {
          bg: 'lGold200 dark:dGold200',
          text: 'cBlack dark:dGold500'
        }
      case 'info':
      default:
        return {
          bg: 'lBlue300 dark:dBlue100',
          text: 'cWhite dark:dBlue500'
        }
    }
  })
  let totalBottom = $computed<number>(() => {
    if (store.toasts.length > 1) {
      const delta : number = store.toasts.length - toastIndex
      return (delta + ((delta - 1) * 72)) + 24
    } else {
      return 24
    }
  })
  let usedTimer = $ref<null | PausableTimeout>(null)
  function mouseEnter() {
    if (usedTimer) {
      usedTimer.pause()
    }
    animState = false
  }
  function mouseLeave() {
    if (usedTimer) {
      usedTimer.resume()
    }
    animState = true
  }
  function removeToast() {
    showToast = false
    setTimeout(() => {
      store.toasts.splice(toastIndex, 1)
    }, 250)
  }
  onMounted(() => {
    setTimeout(() => {
      showToast = true
      usedTimer = pauseMe(() => {
        removeToast()
        usedTimer!.stop()
        usedTimer = null
      }, 5000)
    }, 250)
  })
</script>
<template>
  <div
    w-align = "items-center"
    w-border = "rounded-md"
    w-flex = "~"
    w-max-w = "toast"
    w-opacity = "0"
    w-p = "3"
    w-pos = "bottom-0 fixed left-1/2"
    w-transform = "~ -translate-x-1/2"
    w-transition = "duration-0.25s ease-linear toast"
    w-w = "100"
    w-z = "10"
    v-bind:style = "showToast ? `bottom:${totalBottom}px;opacity:1;` : ''"
    v-bind:w-bg = "toastStyles.bg"
    v-on:mouseenter = "mouseEnter"
    v-on:mouseleave = "mouseLeave">
    <p
      w-flex = "1"
      w-m = "0"
      v-bind:w-text = "`${toastStyles.text} center truncate`">{{store.toasts[toastIndex]?.text}}</p>
    <NTooltip
      content = "Close">
      <NButton
        icon = "xmark"
        v-on:click = "removeToast"></NButton>
    </NTooltip>
    <div
      w-h = "1"
      w-border = "rounded-b-md"
      w-pos = "absolute bottom-0 left-0"
      w-overflow = "hidden"
      w-w = "full">
      <div
        w-h = "full"
        w-w = "full"
        v-bind:w-animate = "`${animState ? 'running' : 'paused'} duration-5s ease-linear fill-forwards toZero`"
        v-bind:w-bg = "toastStyles.text">
      </div>
    </div>
  </div>
</template>
<!--
 <safe
    w-animate = "duration-5s ease-linear fill-forwards paused running toZero"
    w-bg = "cBlack cWhite lBlue300 lGold200 lRed300 lTeal300 lTeal500 dark:dBlue100 dark:dBlue500 dark:dGold200 dark:dGold500 dark:dRed200 dark:dRed500 dark:dTeal300 dark:dTeal500"
    w-text = "cBlack center cWhite lTeal500 truncate dark:dBlue500 dark:dGold500 dark:dRed500 dark:dTeal500"/>
-->