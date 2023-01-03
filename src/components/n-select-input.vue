<!--suppress ConditionalExpressionJS, HtmlUnknownAttribute, JSClassNamingConvention, NestedFunctionCallJS -->
<script
  setup
  lang = "ts">
  import type {_UiSupportCategory} from '~/@types'
  import NIcon from '~/client/components/n-icon.vue'
  import NTextInput from '~/client/components/n-text-input.vue'
  import NTooltip from '~/client/components/n-tooltip.vue'
  const selectInputEmits = defineEmits<{
    (event : 'updateChoice', value : Array<_UiSupportCategory>) : void
  }>()
  const selectInputProps = withDefaults(defineProps<{
    disabled? : boolean
    label : string
    limit? : number
    multiple? : boolean
    options : Array<_UiSupportCategory>
  }>(), {
    disabled: false,
    label: '',
    limit: 5,
    multiple: false,
    options: () => {
      return []
    }
  })
  const selectLimit = $computed(() => {
    return selectInputProps.options.filter(availableOptions => {
      return availableOptions.selected
    }).length === selectInputProps.limit
  })
  const selectText = $computed(() => {
    if (selectInputProps.multiple) {
      const selectedCount = selectInputProps.options.filter(availableOptions => {
        return availableOptions.selected
      }).length
      if (selectedCount === 1) {
        return '1 option selected'
      } else {
        return `${selectedCount} options selected`
      }
    } else if (selectInputProps.options.some(availableOptions => {
      return availableOptions.selected
    })) {
      return selectInputProps.options.find(availableOptions => {
        return availableOptions.selected
      })!.name
    } else {
      return ''
    }
  })
  let selectOpen = $ref<boolean>(false)
  function choiceClick(choice : _UiSupportCategory) {
    if (!selectLimit || choice.selected) {
      const optionsCopy = selectInputProps.options
      const clickedOption = optionsCopy.findIndex(availableOptions => {
        return availableOptions.id === choice.id
      }) as number
      optionsCopy[clickedOption]!.selected = !optionsCopy[clickedOption]!.selected
      if (!selectInputProps.multiple) {
        optionsCopy.forEach(availableOptions => {
          if (availableOptions.id !== choice.id) {
            availableOptions.selected = false
          }
        })
      }
      selectInputEmits('updateChoice', optionsCopy)
    }
  }
</script>
<template>
  <div
    w-pos = "relative"
    v-bind:w-cursor = "selectInputProps.disabled ? 'not-allowed' : 'pointer'"
    v-bind:w-opacity = "selectInputProps.disabled ? '50' : '100'">
    <NTooltip
      full-width
      keep-open
      v-bind:offset = "2"
      v-on:tooltip-close = "selectOpen = false"
      v-on:tooltip-open = "selectOpen = true"
      v-bind:w-pointer = "selectInputProps.disabled ? 'none' : 'all'">
      <NTextInput
        readonly
        required
        w-pointer = "none"
        v-bind:disabled = "selectInputProps.disabled"
        v-bind:dropdown = "selectOpen"
        v-bind:icon-r = "selectOpen ? 'angle-up' : 'angle-down'"
        v-bind:label = "selectInputProps.label"
        v-model = "selectText"/>
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
              <template
                v-if = "selectInputProps.multiple">
                <div
                  w-box = "border"
                  w-p = "x-4 y-2"
                  w-pos = "relative"
                  v-bind:key = "option.id"
                  v-bind:w-cursor = "!option.selected && selectLimit ? 'not-allowed' : 'pointer'"
                  v-bind:w-opacity = "!option.selected && selectLimit ? '50' : '100'"
                  v-for = "option in selectInputProps.options"
                  v-on:click.self = "choiceClick(option)">
                  <NIcon
                    w-pointer = "none"
                    w-pos = "absolute left-5 top-3"
                    w-text = "dark:dTeal500"
                    name = "check"
                    v-bind:size = "3"
                    v-if = "option.selected"/>
                  <label
                    w-align = "items-center"
                    w-cursor = "pointer"
                    w-flex = "~"
                    v-bind:w-pointer = "!option.selected && selectLimit ? 'none' : 'all'">
                    <input
                      type = "checkbox"
                      w-appearance = "none"
                      w-cursor = "pointer"
                      w-h = "5"
                      w-m = "0"
                      w-ring = "focus:2 focus:offset-2 focus:dark:dTeal300 focus:dark:offset-cBlack"
                      w-w = "5 before:12"
                      v-bind:disabled = "!option.selected && selectLimit"
                      v-bind:w-bg = "option.selected ? 'dark:dTeal200' : ''"
                      v-bind:w-border = "`${option.selected ? 'dark:dTeal300' : 'dark:dGray200'} 1 rounded-md solid`"
                      v-on:click.prevent.self = "choiceClick(option)"/>
                    <span
                      w-m = "l-2">{{option.name}}</span>
                  </label>
                </div>
              </template>
              <template
                v-else>
                <div
                  w-align = "items-center"
                  w-bg = "cWhite dark:dGray700 hover:lGray300 hover:dark:dGray500"
                  w-box = "border"
                  w-cursor = "pointer"
                  w-flex = "~"
                  w-font = "medium"
                  w-p = "x-4 y-2"
                  w-text = "lGray700 truncate dark:dGray100"
                  w-w = "full"
                  v-bind:key = "option.id"
                  v-for = "option in selectInputProps.options"
                  v-on:click = "choiceClick(option); props.hide()">
                  <NIcon
                    w-pointer = "none"
                    name = "check"
                    v-bind:size = "3"
                    v-if = "option.selected"/>
                  <span
                    w-m = "l-2">{{option.name}}</span>
                </div>
              </template>
            </div>
          </div>
        </template>
      </NTooltip>
  </div>
</template>
<!--
  <safe
    w-bg = "cWhite dark:dGray700 hover:lGray300 hover:dark:dGray500"
    w-border = "1 rounded-md solid dark:dGray200 dark:dTeal300"
    w-cursor = "not-allowed pointer"
    w-opacity = "50 100"
    w-pointer = "all none"/>
-->