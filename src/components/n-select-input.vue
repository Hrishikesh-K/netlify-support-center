<!--suppress ConditionalExpressionJS, HtmlUnknownAttribute, JSClassNamingConvention, NestedFunctionCallJS -->
<script
  setup
  lang = "ts">
  import type {_UiSupportCategory} from '~/@types'
  import NTextInput from '~/client/components/n-text-input.vue'
  import NTooltip from '~/client/components/n-tooltip.vue'
  const selectInputEmits = defineEmits<{
    (event : 'updateChoice', value : _UiSupportCategory) : void
  }>()
  const selectInputProps = withDefaults(defineProps<{
    label : string
    multiple : boolean
    options : Array<_UiSupportCategory>
  }>(), {
    label: '',
    multiple: false,
    options: () => {
      return []
    }
  })
  let selectOpen = $ref<boolean>(false)
  let selectChoice = $ref<_UiSupportCategory>({
    id: '',
    name: ''
  })
  function choiceClick(choice : _UiSupportCategory, props : any) {
    selectInputEmits('updateChoice', choice)
    selectChoice = choice
    props.hide()
  }
</script>
<template>
  <div
    w-cursor = "pointer"
    w-pos = "relative">
    <NTooltip
      full-width
      v-bind:offset = "2"
      v-on:tooltip-close = "selectOpen = false"
      v-on:tooltip-open = "selectOpen = true">
      <NTextInput
        readonly
        required
        w-pointer = "none"
        v-bind:dropdown = "selectOpen"
        v-bind:icon-r = "selectOpen ? 'angle-up' : 'angle-down'"
        v-bind:label = "selectInputProps.label"
        v-model = "selectChoice.name"/>
        <template
          v-slot:content = "props">
          <div
            w-border = "rounded-b-md"
            w-max-h = "50"
            w-overflow = "hidden"
            w-ring = "2 lGray300 dark:dGray300"
            w-w = "full">
            <div
              w-max-h = "50"
              w-scrollbar = "thin thumb-lTeal400 track-lTeal500 dark:thumb-dTeal400 dark:track-dTeal500"
              w-w = "full">
              <div
                v-if = "selectInputProps.multiple">
                <input
                  type = "checkbox"
                  w-appearance = "none"
                  w-bg = "checked:dark:dTeal200 dark:dGray700"
                  w-border = "1 rounded-md solid checked:dark:dTeal300 dark:dGray200"
                  w-cursor = "pointer"
                  w-h = "5"
                  w-ring = "focus:2 focus:offset-2 focus:dark:dTeal300 focus:dark:offset-cBlack"
                  w-w = "5"/>
              </div>
              <div
                w-box = "border"
                w-cursor = "pointer"
                w-font = "medium"
                w-p = "x-4 y-2"
                w-text = "lGray700 truncate dark:dGray100"
                w-w = "full"
                v-bind:key = "option.id"
                v-bind:w-bg = "option.id === selectChoice.id ? 'lBlue100 dark:dBlue200 hover:lBlue200 hover:dark:dBlue300' : 'cWhite dark:dGray700 hover:lGray300 hover:dark:dGray500'"
                v-else
                v-for = "option in selectInputProps.options"
                v-on:click = "choiceClick(option, props)">{{option.name}}</div>
            </div>
          </div>
        </template>
      </NTooltip>
  </div>
</template>
<!--
  <safe
    w-bg = "cWhite lBlue100 dark:dBlue200 dark:dGray700 hover:lBlue200 hover:lGray300 hover:dark:dBlue300 hover:dark:dGray500"/>
-->