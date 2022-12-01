<!--suppress HtmlUnknownAttribute, NestedFunctionCallJS -->
<script
  setup
  lang = "ts">
  import sprite from '~/client/assets/sprites.svg?url'
  const iconProps = withDefaults(defineProps<{
    name : string
    size? : number
  }>(), {
    name: '',
    size: 4
  })
</script>
<template>
  <svg
    w-display = "block"
    w-svg = "fill-wCurrent"
    v-bind:w-h = "iconProps.size"
    v-bind:w-w = "iconProps.size">
    <use
      v-bind:xlink:href = "`${sprite}#${iconProps.name}`"/>
  </svg>
</template>
<!--
  <safe
    w-h = "2 3 4 6 10"
    w-w = "2 3 4 6 10"/>
-->