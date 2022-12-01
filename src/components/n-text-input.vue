<!--suppress ConditionalExpressionJS, ConstantOnRightSideOfComparisonJS, HtmlUnknownAttribute, NestedFunctionCallJS -->
<script
  setup
  lang = "ts">
  import NIcon from '~/client/components/n-icon.vue'
  const textInputEmits = defineEmits<{
    (event : 'update:modelValue', value : string) : void
  }>()
  const textInputProps = withDefaults(defineProps<{
    disabled? : boolean
    dropdown? : boolean
    iconR? : null | string
    label : string
    modelValue : string
    readonly? : boolean
    required? : boolean
    type? : 'email' | 'text' | 'url'
  }>(), {
    disabled: false,
    dropdown: false,
    iconR: null,
    label: '',
    modelValue: '',
    readonly: false,
    required: false,
    type: 'text'
  })
  let textInput = $computed<string>({
    get: () => {
      return textInputProps.modelValue
    },
    set: value => {
      textInputEmits('update:modelValue', value)
    }
  })
</script>
<template>
  <label
    w-display = "block"
    w-font = "medium"
    w-pos = "relative">
    <span
      w-pointer = "none"
      w-pos = "absolute left-4 top-2"
      w-text = "base lGray600 dark:dGray200"
      w-transition = "duration-0.25s transform"
      v-bind:w-transform = "`${textInput.length > 0 ? 'scale-75 -translate-x-5 -translate-y-7' : 'scale-100 translate-x-0 translate-y-0'} ~`">{{textInputProps.label}}</span>
    <input
      w-bg = "cWhite dark:cBlack"
      w-box = "border"
      w-h = "10"
      w-outline = "none"
      w-text = "base cBlack dark:cWhite"
      w-w = "full"
      v-bind:disabled = "textInputProps.disabled"
      v-bind:readonly = "textInputProps.readonly"
      v-bind:required = "textInputProps.required"
      v-bind:type = "textInputProps.type"
      v-bind:w-border = "`${textInputProps.dropdown ? 'rounded-t-md' : 'rounded-md'} ~ lGray300 solid dark:dGray300`"
      v-bind:w-p = "textInputProps.iconR ? 'l-4 r-11 y-2' : 'x-4 y-2'"
      v-bind:w-ring = "textInputProps.dropdown ? '2 lTeal300 dark:dTeal300' : 'focus:2 focus:lTeal300 focus:dark:dTeal300'"
      v-model = "textInput"/>
    <NIcon
      w-pointer = "none"
      w-pos = "absolute right-4 top-3.5"
      w-z = "1"
      v-bind:name = "textInputProps.iconR"
      v-bind:size = "3"
      v-if = "textInputProps.iconR"/>
  </label>
</template>
<!--
  <safe
    w-border = "~ lGray300 rounded-md rounded-t-md solid dark:dGray300"
    w-p = "l-4 r-11 x-4 y-2"
    w-ring = "2 lTeal300 dark:dTeal300 focus:2 focus:lTeal300 focus:dark:dTeal300"
    w-transform = "~ scale-100 scale-75 translate-x-0 translate-y-0 -translate-x-5 -translate-y-7"/>
-->