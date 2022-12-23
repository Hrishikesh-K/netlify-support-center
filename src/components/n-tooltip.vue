<!--suppress AnonymousFunctionJS, ConditionalExpressionJS, FunctionWithMultipleReturnPointsJS, HtmlUnknownAttribute, NestedFunctionCallJS -->
<script
  setup
  lang = "ts">
  import type {Instance, Placement} from '@popperjs/core'
  import {createPopper} from '@popperjs/core'
  import {directive as vClickAway} from 'vue3-click-away'
  import {onMounted, useSlots, watch} from 'vue'
  const tooltipEmits = defineEmits<{
    (event: 'tooltipClose') : void
    (event: 'tooltipOpen') : void
  }>()
  const tooltipProps = withDefaults(defineProps<{
    content? : string
    fullWidth? : boolean
    keepOpen? : boolean
    offset? : number
    placement? : Placement
  }>(), {
    content: '',
    fullWidth: false,
    keepOpen: false,
    offset: 12,
    placement: 'bottom'
  })
  const tooltipSlots = useSlots()
  let popperInstance = $ref<null | Instance>(null)
  let tooltipEl = $ref<null | HTMLElement>(null)
  let tooltipMouseEvents = $computed(() => {
    if (tooltipSlots['content']) {
      return {
        click: () => {
          if (tooltipShow) {
            tooltipClose()
          } else {
            tooltipOpen()
          }
        }
      }
    } else {
      return {
        mouseleave: tooltipClose,
        mouseover: tooltipOpen
      }
    }
  })
  let tooltipParentEl = $ref<null | HTMLElement>(null)
  let tooltipShow = $ref<boolean>(false)
  function tooltipOpen() {
    tooltipShow = true
    popperInstance!.update()
    tooltipEmits('tooltipOpen')
  }
  function tooltipClose() {
    tooltipShow = false
    tooltipEmits('tooltipClose')
  }
  const tooltipContentWatch = watch(() => {
    return tooltipProps.content
  }, () => {
    if (popperInstance) {
      popperInstance.update()
    }
  })
  const tooltipElWatch = watch([() => {
    return tooltipParentEl
  }, () => {
    return tooltipEl
  }], () => {
    if (tooltipParentEl && tooltipEl) {
      tooltipElWatch()
      popperInstance = createPopper(tooltipParentEl, tooltipEl, {
        modifiers: [{
          name: 'offset',
          options: {
            offset: [0, tooltipProps.offset]
          }
        }, {
          name: 'preventOverflow',
          options: {
            padding: 24
          }
        }],
        placement: tooltipProps.placement
      })
    }
  })
  onMounted(() => {
    if (tooltipSlots['content']) {
      tooltipContentWatch()
    }
  })
</script>
<template>
  <div>
    <div
      ref = "tooltipParentEl"
      w-display = "inline-block"
      w-w = "full"
      v-on = "tooltipMouseEvents">
      <slot/>
    </div>
    <div
      ref = "tooltipEl"
      w-bg = "cWhite dark:dGray700"
      w-border = "rounded-lg"
      w-shadow = "lShallow dark:dShallow"
      w-z = "100"
      v-bind:w-display = "tooltipShow ? 'block' : 'hidden'"
      v-bind:w-w = "tooltipProps.fullWidth ? 'full' : 'auto'"
      v-click-away = "() => tooltipClose()"
      v-if = "tooltipSlots['content']"
      v-on:click = "tooltipProps.keepOpen ? null : tooltipClose">
      <slot
        name = "content"
        v-bind:hide = "tooltipClose"
        v-bind:show = "tooltipOpen"/>
    </div>
    <div
      ref = "tooltipEl"
      w-bg = "cBlack"
      w-border = "~ dGray700 rounded-lg solid"
      w-p = "x-4 y-3"
      w-text = "cWhite sm space-nowrap"
      w-z = "100"
      v-bind:w-display = "tooltipShow ? 'block' : 'hidden'"
      v-else>{{tooltipProps.content}}</div>
  </div>
</template>
<!--
  <safe
    w-display = "block hidden"
    w-w = "auto full"/>
-->