<!--suppress HtmlUnknownAttribute, ConditionalExpressionJS, ConstantOnRightSideOfComparisonJS, MagicNumberJS, NestedFunctionCallJS, -->
<script
  setup
  lang = "ts">
  import NBadge from '~/client/components/n-badge.vue'
  import NIcon from '~/client/components/n-icon.vue'
  const productProps = withDefaults(defineProps<{
    icon : string
    name : string,
    state? : 'beta' | 'experimental' | 'production'
  }>(), {
    icon: '',
    name: '',
    state: 'production'
  })
</script>
<template>
  <div
    w-bg = "hover:lTeal100 hover:dark:dTeal500"
    w-border = "rounded-md"
    w-flex = "~"
    w-gap = "x-3"
    w-p = "3"
    w-text = "cBlack dark:cWhite hover:lTeal500 hover:dark:cWhite">
    <NIcon
      w-flex = "shrink-0"
      v-bind:name = "productProps.icon"
      v-bind:size = "10"/>
    <div
      w-flex = "1"
      w-text = "truncate">
      <p
        w-font = "bold"
        w-m = "0"
        w-text = "truncate"
        w-w = "full">{{productProps.name}}</p>
      <p
        w-m = "0"
        w-text = "sm truncate"
        w-w = "full">Description</p>
    </div>
    <NBadge
      v-bind:text = "productProps.state"
      v-bind:variant = "productProps.state === 'beta' ? 'warn' : 'error'"
      v-if = "productProps.state !== 'production'"/>
  </div>
</template>