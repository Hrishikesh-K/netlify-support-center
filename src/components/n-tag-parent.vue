<!--suppress AnonymousFunctionJS, ConditionalExpressionJS, ConstantOnRightSideOfComparisonJS, HtmlUnknownAttribute, JSClassNamingConvention, NestedFunctionCallJS -->
<script
  setup
  lang = "ts">
  import {v4} from 'uuid'
  import NTagChild from '~/client/components/n-tag-child.vue'
  interface _Tag {
    deleted : boolean
    id : number | string
    text : string
  }
  const tagInputEmits = defineEmits<{
    (event : 'tagsUpdate', value : Array<_Tag>) : void
  }>()
  const tagInputProps = withDefaults(defineProps<{
    regex? : RegExp
    label : string
    tags : Array<_Tag>
  }>(), {
    regex: () => {
      return /./
    },
    label: '',
    tags: () => {
      return []
    }
  })
  let doubleDelete : null | NodeJS.Timer
  let tagsComputed = $computed<Array<_Tag>>({
    get: () => {
      return tagInputProps.tags
    },
    set: value => {
      tagInputEmits('tagsUpdate', value)
    }
  })
  let tagNew = $ref<string>('')
  function tagAdd() {
    if (tagNew.length > 0) {
      const newArray = tagsComputed
      newArray.push({
        deleted: false,
        id: v4(),
        text: tagNew
      })
      tagsComputed = newArray
      tagNew = ''
    }
  }
  function tagEdit(tagIndex : number, text : string) {
    const newArray = tagsComputed
    newArray[tagIndex]!.text = text
    tagsComputed = newArray
  }
  function tagDelete(tagIndex : number) {
    const newArray = tagsComputed
    newArray.splice(tagIndex, 1)
    tagsComputed = newArray
  }
  function tagDeleteLast() {
    if (tagNew.length > 0) {
      tagNew = tagNew.slice(0, -1)
    } else if (tagsComputed.length > 0) {
      const newArray = tagsComputed
      const lastTag = newArray[newArray.length - 1] as _Tag
      if (lastTag.deleted) {
        newArray.pop()
        if (doubleDelete) {
          clearTimeout(doubleDelete)
        }
      } else {
        lastTag.deleted = true
        doubleDelete = setTimeout(() => {
          lastTag.deleted = false
          tagsComputed = newArray
          doubleDelete = null
        }, 1000)
      }
      tagsComputed = newArray
    }
  }
</script>
<template>
  <div
    w-bg = "cWhite dark:cBlack"
    w-border = "1 lGray300 rounded-md solid dark:dGray300"
    w-box = "border"
    w-cursor = "pointer"
    w-flex = "~ wrap"
    w-gap = "2"
    w-m = "t-6"
    w-p = "x-4 y-2"
    w-pos = "relative"
    w-ring = "hover:2 hover:lTeal300 hover:dark:dTeal300"
    w-text = "base cBlack dark:cWhite"
    w-w = "full">
    <span
      w-font = "medium"
      w-pointer = "none"
      w-pos = "absolute left-4 top-2.75"
      w-text = "base lGray600 dark:dGray200"
      w-transform = "~ scale-75 -translate-x-4.25 -translate-y-8"
      w-transition = "duration-0.25s transform">{{tagInputProps.label}}</span>
    <ul
      w-flex = "~ wrap"
      w-gap = "x-2 y-1"
      w-list = "none"
      w-m = "0"
      w-p = "0">
      <NTagChild
        v-bind:deleted = "tag.deleted"
        v-bind:key = "tag.id"
        v-bind:regex = "tagInputProps.regex"
        v-bind:text = "tag.text"
        v-for = "(tag, tagIndex) in tagsComputed"
        v-on:tag-edit = "tagEdit(tagIndex, $event)"
        v-on:tag-delete = "tagDelete(tagIndex)"/>
      <li
        w-w = "full">
        <form
          w-w = "full"
          v-on:submit.prevent = "tagAdd">
          <input
            placeholder = "Add another"
            w-bg = "wTransparent"
            w-border = "0"
            w-font = "bold"
            w-outline = "none"
            w-p = "0"
            w-text = "cBlack sm dark:cWhite"
            w-w = "full"
            v-on:keydown.delete.prevent = "tagDeleteLast"
            v-model = "tagNew"/>
        </form>
      </li>
    </ul>
  </div>
</template>