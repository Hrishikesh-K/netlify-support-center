<!--suppress AnonymousFunctionJS, ChainedFunctionCallJS, ConditionalExpressionJS, ConstantOnRightSideOfComparisonJS, FunctionWithMultipleLoopsJS, HtmlUnknownAttribute, JSClassNamingConvention, LocalVariableNamingConventionJS, MagicNumberJS, NestedFunctionCallJS, ParameterNamingConventionJS, PlatformDetectionJS -->
<script
  setup
  lang = "ts">
  import type {_UiFile} from '~/@types'
  import {add, floor, multiply, pow, subtract} from 'mathjs'
  import Blockquote from '@tiptap/extension-blockquote'
  import Bold from '@tiptap/extension-bold'
  import BulletList from '@tiptap/extension-bullet-list'
  import Code from '@tiptap/extension-code'
  import CodeBlock from '@tiptap/extension-code-block'
  import Document from '@tiptap/extension-document'
  import file2md5 from 'file2md5'
  import {partial} from 'filesize'
  import History from '@tiptap/extension-history'
  import Italic from '@tiptap/extension-italic'
  import Link from '@tiptap/extension-link'
  import ListItem from '@tiptap/extension-list-item'
  import {onMounted, onUnmounted, watch} from 'vue'
  import OrderedList from '@tiptap/extension-ordered-list'
  import Paragraph from '@tiptap/extension-paragraph'
  import Placeholder from '@tiptap/extension-placeholder'
  import Text from '@tiptap/extension-text'
  import Underline from '@tiptap/extension-underline'
  import {useEditor} from '@tiptap/vue-3'
  import {v4} from 'uuid'
  import {useStore} from '~/client/store'
  import {EditorContent} from '@tiptap/vue-3'
  import NButton from '~/client/components/n-button.vue'
  import NIcon from '~/client/components/n-icon.vue'
  import NTooltip from '~/client/components/n-tooltip.vue'
  const body = document.querySelector('body')
  const editorEmits = defineEmits<{
    (event: 'updateFiles', value : Array<_UiFile>): void
    (event : 'update:modelValue', value : string) : void
  }>()
  const editorProps = withDefaults(defineProps<{
    modelValue : string
    usedSize : number
  }>(), {
    modelValue: '',
    usedSize: 0
  })
  const fileSize = partial({
    base: 2,
    standard: 'iec'
  })
  const store = useStore()
  let attachedFiles = $ref<Array<_UiFile>>([])
  let attachInput = $ref<null | HTMLInputElement>(null)
  let dragActive = $ref<boolean>(false)
  let editor = $(useEditor({
    content: editorProps.modelValue,
    editorProps: {
      attributes: {
        'w-border': 'rounded-b-md',
        'w-min-h': '37.5',
        'w-outline': 'none',
        'w-p': '3 b-6',
        'w-text': 'break-all space-pre-wrap'
      }
    },
    extensions: [Blockquote.extend({
      renderHTML() {
        return ['blockquote', {
          'w-bg': 'lGray300 dark:dGray500',
          'w-border': '0 l-2 cBlack rounded-r-md solid dark:cWhite',
          'w-m': 'l-1.5 r-0 y-3',
          'w-p': '1.5',
        }, 0]
      }
    }), Bold, BulletList.extend({
      renderHTML() {
        return ['ul', {
          'w-list': 'disc',
          'w-m': 'l-3 r-0 y-3',
          'w-p': 'l-3'
        }, 0]
      }
    }), Code.extend({
      renderHTML() {
        return ['code', {
          'w-bg': 'code',
          'w-font': 'mono',
          'w-border': 'rounded-sm',
          'w-p': 'x-2 y-1'
        }, 0]
      }
    }), CodeBlock.extend({
      renderHTML() {
        return ['pre', {
          'w-bg': 'code',
          'w-border': 'rounded-md',
          'w-m': 'y-3',
          'w-p': '3'
        }, ['code', {
          'w-font': 'mono'
        }, 0]]
      }
    }), Document, History, Italic, Link.configure({
      HTMLAttributes: {
        'w-text': 'underline'
      }
    }), ListItem, OrderedList.extend({
      renderHTML() {
        return ['ol', {
          'w-list': 'decimal',
          'w-m': 'l-3 r-0 y-3',
          'w-p': 'l-3'
        }, 0]
      }
    }), Paragraph.extend({
      renderHTML() {
        return ['p', {
          'w-m': '0'
        }, 0]
      }
    }), Placeholder.configure({
      emptyEditorClass: 'text-lGray400 before:content-[attr(data-placeholder)] before:float-left before:h-0 dark:text-dGray300',
      placeholder: 'How can we help...?'
    }), Text, Underline],
    injectCSS: false,
    onUpdate: instance => {
      editorEmits('update:modelValue', instance.editor.getHTML())
    }
  }))
  let editorMetaKey = $ref<'^' | '⌘'>('^')
  let totalSizeLeft = $computed<number>(() => {
    return floor(subtract(multiply(5, (pow(1024, 2) as number)), add(editorProps.usedSize, add(editorProps.modelValue.length, attachedFiles.reduce((currentSize, currentFile) => {
      return add(currentSize, add(currentFile.base64.length, currentFile.name.length))
    }, 0)))))
  })
  async function dragDrop(event : DragEvent) {
    event.preventDefault()
    dragActive = false
    const dataTransferFiles = event.dataTransfer!.files
    const dataTransferItems = event.dataTransfer!.items
    const filesToProcess : Array<File> = []
    for (let i = 0; i < dataTransferItems.length; i++) {
      if (dataTransferItems[i]!.webkitGetAsEntry()!.isDirectory) {
        store.toasts.push({
          id: v4(),
          text: `${dataTransferFiles[i]!.name} is a directory`,
          variant: 'error'
        })
      } else {
        filesToProcess.push(dataTransferFiles[i]!)
      }
    }
    for (let i = 0; i < filesToProcess.length; i++) {
      await processFile(filesToProcess[i]!)
    }
  }
  function dragEnter(event : DragEvent) {
    event.preventDefault()
    dragActive = true
  }
  function dragLeave(event : DragEvent) {
    event.preventDefault()
    dragActive = false
  }
  function dragOver(event : DragEvent) {
    event.preventDefault()
  }
  async function fileInput(event : Event) {
    const files = (event.target as HTMLInputElement).files
    for (let i = 0; i < files!.length; i++) {
      await processFile(files![i]!)
    }
  }
  function processFile(file : File) {
    return new Promise<void>(resolve => {
      if (multiply(1.375, file.size) > totalSizeLeft) {
        store.toasts.push({
          id: v4(),
          text: `${file.name} is too large`,
          variant: 'error'
        })
        resolve()
      } else {
        file2md5(file).then(md5 => {
          if (attachedFiles.some(attachedFile => {
            return attachedFile.md5 === md5
          })) {
            store.toasts.push({
              id: v4(),
              text: `${file.name} is already attached`,
              variant: 'error'
            })
            resolve()
          } else {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.addEventListener('load', () => {
              const base64 = reader.result!.toString()
              attachedFiles.push({
                base64: base64.slice(base64.indexOf(',') + 1),
                md5: md5,
                name: file.name
              })
              editorEmits('updateFiles', attachedFiles)
              resolve()
            }, {
              once: true
            })
          }
        })
      }
    })
  }
  function removeFile(fileIndex : number) {
    attachedFiles.splice(fileIndex, 1)
    editorEmits('updateFiles', attachedFiles)
  }
  watch(() => {
    return dragActive
  }, () => {
    if (dragActive) {
      body!.setAttribute('w-pointer', 'all:none')
    } else {
      body!.removeAttribute('w-pointer')
    }
  })
  onMounted(() => {
    if (navigator.platform.indexOf('Mac') === 0) {
      editorMetaKey = '⌘'
    }
    body!.addEventListener('dragenter', dragEnter)
    body!.addEventListener('dragleave', dragLeave)
    body!.addEventListener('dragover', dragOver)
    body!.addEventListener('drop', dragDrop)
  })
  onUnmounted(() => {
    body!.removeEventListener('dragenter', dragEnter)
    body!.removeEventListener('dragleave', dragLeave)
    body!.removeEventListener('dragover', dragOver)
    body!.removeEventListener('drop', dragDrop)
  })
</script>
<template>
  <div
    w-flex = "~ <xs:wrap"
    w-gap = "3">
    <div
      w-bg = "cWhite dark:cBlack"
      w-border = "1 lGray300 rounded-md solid dark:dGray300"
      w-flex = "xs:1"
      w-ring = "hover:2 hover:lTeal300 hover:dark:dTeal300"
      w-w = "<xs:full"
      v-if = "editor">
      <div
        w-overflow = "x-auto"
        w-scrollbar = "thin thumb-lTeal400 track-lTeal500 dark:thumb-dTeal400 dark:track-dTeal500"
        w-w = "full">
        <div
          w-align = "items-center"
          w-flex = "~"
          w-p = "3"
          w-space = "x-3"
          w-w = "fit">
          <div
            w-align = "items-center"
            w-flex = "~"
            w-space = "x-1">
            <NTooltip
              v-bind:content = "`Undo (${editorMetaKey} + Z)`">
              <NButton
                icon = "rotate-left"
                v-on:click = "editor?.chain().focus().undo().run()"/>
            </NTooltip>
            <NTooltip
              v-bind:content = "`Redo (${editorMetaKey} + Y)`">
              <NButton
                icon = "rotate-right"
                v-on:click = "editor?.chain().focus().redo().run()"/>
            </NTooltip>
          </div>
          <div
            w-align = "items-center"
            w-flex = "~"
            w-space = "x-1">
            <NTooltip
              v-bind:content = "`Bold (${editorMetaKey} + B)`">
              <NButton
                icon = "bold"
                v-bind:level = "editor?.isActive('bold') ? 'primary' : 'secondary'"
                v-on:click = "editor?.chain().focus().toggleBold().run()"/>
            </NTooltip>
            <NTooltip
              v-bind:content = "`Italic (${editorMetaKey} + I)`">
              <NButton
                icon = "italic"
                v-bind:level = "editor?.isActive('italic') ? 'primary' : 'secondary'"
                v-on:click = "editor?.chain().focus().toggleItalic().run()"/>
            </NTooltip>
            <NTooltip
              v-bind:content = "`Underline (${editorMetaKey} + U)`">
              <NButton
                icon = "underline"
                v-bind:level = "editor?.isActive('underline') ? 'primary' : 'secondary'"
                v-on:click = "editor?.chain().focus().toggleUnderline().run()"/>
            </NTooltip>
          </div>
          <NTooltip
            content = "Link">
            <NButton
              icon = "link"/>
          </NTooltip>
          <div
            w-align = "items-center"
            w-flex = "~"
            w-space = "x-1">
            <NTooltip
              v-bind:content = "`Ordered List (${editorMetaKey} + ⇧ + 7)`">
              <NButton
                icon = "list-ol"
                v-bind:level = "editor?.isActive('orderedList') ? 'primary' : 'secondary'"
                v-on:click = "editor?.chain().focus().toggleOrderedList().run()"/>
            </NTooltip>
            <NTooltip
              v-bind:content = "`Unordered List (${editorMetaKey} + ⇧ + 8)`">
              <NButton
                icon = "list-ul"
                v-bind:level = "editor?.isActive('bulletList') ? 'primary' : 'secondary'"
                v-on:click = "editor?.chain().focus().toggleBulletList().run()"/>
            </NTooltip>
          </div>
          <NTooltip
            v-bind:content = "`Quote (${editorMetaKey} + ⇧ + B)`">
            <NButton
              icon = "block-quote"
              v-bind:level = "editor?.isActive('blockquote') ? 'primary' : 'secondary'"
              v-on:click = "editor?.chain().focus().toggleBlockquote().run()"/>
          </NTooltip>
          <div
            w-align = "items-center"
            w-flex = "~"
            w-space = "x-1">
            <NTooltip
              v-bind:content = "`Code (${editorMetaKey} + E)`">
              <NButton
                icon = "code"
                v-bind:level = "editor?.isActive('code') ? 'primary' : 'secondary'"
                v-on:click = "editor?.chain().focus().toggleCode().run()"/>
            </NTooltip>
            <NTooltip
              v-bind:content = "`Code Block (${editorMetaKey} + ⌥ + C)`">
              <NButton
                icon = "rectangle-terminal"
                v-bind:level = "editor?.isActive('codeBlock') ? 'primary' : 'secondary'"
                v-on:click = "editor?.chain().focus().toggleCodeBlock().run()"/>
            </NTooltip>
          </div>
          <NTooltip
            content = "Attach files">
            <NButton
              icon = "paperclip"
              level = "secondary"
              v-on:click = "attachInput?.click()"/>
          </NTooltip>
        </div>
      </div>
      <EditorContent
        v-bind:editor = "editor"/>
      <div
        w-align = "items-center"
        w-flex = "~"
        w-gap = "x-3"
        w-justify = "between"
        w-m = "b-2 x-6">
        <h2
          w-m = "0">Attachments</h2>
        <p
          w-m = "0">~ {{fileSize(totalSizeLeft)}}</p>
      </div>
      <hr
        w-border = "0 lGray100 t-1 dark:dGray300"
        w-m = "0 b-6 x-6"/>
      <div
        class = "drag-parent"
        ref = "dragDropEl"
        w-border = "rounded-md"
        w-m = "b-6 x-6"
        w-p = "3"
        v-bind:w-bg = "dragActive ? 'lTeal300 dark:dTeal300' : 'lGray300 dark:dGray500'"
        v-bind:w-text = "dragActive ? 'lTeal500 dark:dTeal500' : 'cBlack dark:cWhite'">
        <div
          w-align = "items-center"
          w-flex = "~ wrap"
          w-justify = "center"
          w-p = "3"
          v-bind:w-border = "`${dragActive ? 'lTeal500 dark:dTeal500' : 'cBlack dark:cWhite'} 2 dashed rounded-md`">
          <button
            type = "button"
            w-bg = "wTransparent"
            w-border = "0"
            w-cursor = "pointer"
            w-font = "sans"
            w-p = "0"
            w-text = "base underline wCurrent"
            v-on:click = "attachInput?.click()">Choose files</button>
          <span>&nbsp;or drop them here</span>
          <input
            hidden
            multiple
            ref = "attachInput"
            type = "file"
            w-display = "hidden"
            v-on:input = "fileInput"/>
        </div>
      </div>
      <template
        v-if = "attachedFiles.length > 0">
        <div
          w-align = "items-center"
          w-flex = "~"
          w-font = "bold"
          w-gap = "x-3"
          w-p = "x-6 y-3">
          <div
            w-h = "6"
            w-w = "6">
          </div>
          <p
            w-m = "0"
            w-w = "50">Name</p>
          <p
            w-m = "0"
            w-w = "25">Transfer</p>
        </div>
        <div
          w-m = "b-6"
          w-max-h = "45"
          w-overflow = "y-auto"
          w-scrollbar = "thin thumb-lTeal400 track-lTeal500 dark:thumb-dTeal400 dark:track-dTeal500">
          <div
            w-align = "items-center"
            w-bg = "even:lSeparator/2 even:dark:cWhite/3 hover:lSeparator/3 hover:dark:cWhite/4"
            w-flex = "~"
            w-gap = "x-3"
            w-p = "x-6 y-3"
            v-bind:key = "file.md5"
            v-for = "(file, fileIndex) in attachedFiles">
            <NIcon
              name = "file-arrow-up"
              v-bind:size = "6"/>
            <p
              w-m = "0"
              w-text = "truncate"
              w-w = "50">{{file.name}}</p>
            <p
              w-m = "0"
              w-w = "25">{{fileSize(file.base64.length)}}</p>
            <NTooltip
              content = "Remove">
              <NButton
                icon = "trash-can"
                v-on:click = "removeFile(fileIndex)"/>
            </NTooltip>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<!--
  <safe
    class = "text-lGray400 before:content-[attr(data-placeholder)] before:float-left before:h-0 dark:text-dGray300"
    w-bg = "lGray300 lTeal300 dark:dGray500 dark:dTeal300"
    w-border = "0 cBlack dashed l-2 lTeal300 rounded-b-md rounded-sm rounded-r-md solid dark:cWhite dark:dTeal300"
    w-font = "mono"
    w-list = "decimal disc"
    w-m = "0 l-1.5 l-3 r-0 y-3"
    w-min-h = "37.5"
    w-outline = "none"
    w-p = "1.5 3 b-6 l-3 x-2 y-1"
    w-pointer = "all:none"
    w-text = "break-all cBlack lTeal500 space-pre-wrap underline dark:cWhite dark:dTeal500"/>
-->