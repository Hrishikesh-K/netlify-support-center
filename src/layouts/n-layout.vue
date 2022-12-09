<!--suppress AnonymousFunctionJS, AssignmentResultUsedJS, ChainedFunctionCallJS, ConditionalExpressionJS, ConstantOnRightSideOfComparisonJS, CssConvertColorToRgbInspection, HtmlUnknownAttribute, JSCheckFunctionSignatures, FunctionWithMultipleReturnPointsJS, MagicNumberJS, NestedAssignmentJS, NestedFunctionCallJS -->
<script
  setup
  lang = "ts">
  import type {AxiosError} from 'axios'
  import type {_NUser, _SpStatus, _ZdUser} from '~/@types'
  import axios from 'axios'
  import {divide, exp, multiply, subtract} from 'mathjs'
  import {onMounted, watch} from 'vue'
  import {useRoute} from 'vue-router'
  import {v4} from 'uuid'
  import {useStore} from '~/client/store'
  import NButton from '~/client/components/n-button.vue'
  import NDropdownChild from '~/client/components/n-dropdown-child.vue'
  import NIcon from '~/client/components/n-icon.vue'
  import NToast from '~/client/components/n-toast.vue'
  import NTooltip from '~/client/components/n-tooltip.vue'
  const route = useRoute()
  const store = useStore()
  let loadProgress = $ref<number>(0)
  let loadProgressInterval : null | NodeJS.Timer
  let loadProgressShow = $ref<boolean>(false)
  let loadProgressTime = 0
  let savingBtnLogout = $ref<boolean>(false)
  let selectSupport = $ref<boolean>(false)
  let sysStatus = $ref<null | _SpStatus>(null)
  let sysStatusStyles = $computed<{
    bg : string
    text : string
  }>(() => {
    if (sysStatus) {
      switch (sysStatus.status.indicator) {
        case 'critical':
        case 'major':
          return {
            bg: 'lRed300 dark:dRed200',
            text: 'cBlack dark:dRed500'
          }
        case 'maintenance':
        case 'minor':
          return {
            bg: 'lGold200 dark:dGold500',
            text: 'lGold500 dark:dGold200'
          }
        case 'none':
        default:
          return {
            bg: 'lTeal300 dark:dTeal300',
            text: 'lTeal500 dark:dTeal500'
          }
      }
    } else {
      return {
        bg: 'lGray300 dark:dGray400',
        text: 'cBlack dark:cWhite'
      }
    }
  })
  let sysStatusTimer : null | NodeJS.Timer = null
  let theme = $ref<'dark' | 'light'>('light')
  function checkSysStatus() {
    sysStatus = null
    if (!sysStatusTimer) {
      sysStatusTimer = setInterval(() => {
        checkSysStatus()
      }, 300000)
    }
    axios({
      url: '/api/system/status'
    }).then((sysStatusResponse : {
      data : _SpStatus
    }) => {
      sysStatus = sysStatusResponse.data
    }, store.errorHandler)
  }
  function checkTheme() {
    const selectedTheme = localStorage.getItem('theme')
    if (selectedTheme) {
      if (selectedTheme === 'dark') {
        theme = 'dark'
      } else {
        theme = 'light'
      }
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        theme = 'dark'
      } else {
        theme = 'light'
      }
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', checkTheme)
    }
  }
  function fetchUser() {
    store.loginLoading = true
    axios({
      url: '/api/user'
    }).then((ntlUser: {
      data : {
        ntl : _NUser
        zd : _ZdUser
      }
    }) => {
      store.nUser = ntlUser.data.ntl
      store.zUser = ntlUser.data.zd
      store.toasts.push({
        id: v4(),
        text: `Welcome, ${store.nUser.full_name}`,
        variant: 'success'
      })
    }, ((ntlUserErr : AxiosError) => {
      if (ntlUserErr.response?.status !== 403) {
        store.errorHandler(ntlUserErr)
      }
    })).finally(() => {
      store.loginLoading = false
    })
  }
  function loadProgressStart() {
    loadProgressInterval = setInterval(() => {
      loadProgressTime += 100
      loadProgress = subtract(1, exp(multiply(-1, divide(loadProgressTime, 1000))))
      if (loadProgress >= 1) {
        loadProgressStop()
      }
    }, 100)
  }
  function loadProgressStop() {
    loadProgress = 1
    clearInterval(loadProgressInterval as NodeJS.Timer)
    loadProgressInterval = null
  }
  function logout() {
    savingBtnLogout = true
    axios({
      url: '/api/user/logout'
    }).then(() => {
      store.nUser = {
        accounts: [],
        avatar_url: '',
        email: '',
        full_name: '',
        id: '',
        loading: true,
        priority: 0
      }
      store.zUser = {
        email: '',
        external_id: '',
        id: 0,
        loading: true,
        name: '',
        organization_id: 0
      }
      store.toasts.push({
        id: v4(),
        text: 'Successfully logged out',
        variant: 'success'
      })
    }, store.errorHandler).finally(() => {
      savingBtnLogout = false
    })
  }
  function toggleTheme() {
    if (theme === 'dark') {
      theme = 'light'
    } else {
      theme = 'dark'
    }
    localStorage.setItem('theme', theme)
    window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', checkTheme)
  }
  watch(() => {
    return store.compLoading
  }, () => {
    if (store.compLoading) {
      loadProgress = loadProgressTime = 0
      loadProgressShow = true
      loadProgressStart()
    } else {
      loadProgressStop()
      setTimeout(() => {
        loadProgressShow = false
      }, 500)
    }
  })
  watch(() => {
    return theme
  }, () => {
    (document.querySelector('html') as HTMLElement).className = theme
  })
  onMounted(() => {
    checkSysStatus()
    checkTheme()
    fetchUser()
    if (store.error.status === 1000) {
      logout()
    }
  })
</script>
<template>
  <div
    w-h = "0.5"
    w-pos = "fixed left-0 top-0"
    w-transition = "duration-0.25s opacity"
    w-w = "full"
    v-bind:w-opacity = "loadProgress >= 1 ? '0' : '100'"
    v-if = "loadProgressShow">
    <div
      w-h = "full"
      w-bg = "lTeal300 dark:dTeal300"
      w-transition = "duration-0.25s progress"
      v-bind:style = "`width:${multiply(100, loadProgress)}%`">
    </div>
  </div>
  <header
    w-align = "items-center"
    w-flex = "~"
    w-m = "x-auto"
    w-max-w = "320"
    w-justify = "between"
    w-w = "full">
    <div
      w-align = "items-center"
      w-flex = "~"
      w-space = "x-2">
      <RouterLink
        to = "/"
        w-text = "cBlack dark:cWhite">
        <NIcon
          name = "netlify"
          v-bind:size = "10"/>
      </RouterLink>
      <NTooltip
        v-bind:offset = "2"
        v-on:tooltip-close = "selectSupport = false"
        v-on:tooltip-open = "selectSupport = true">
        <NButton
          font-weight = "semibold"
          icon-x = "right"
          level = "tertiary"
          text = "Netlify Support"
          text-size = "xl"
          v-bind:icon = "selectSupport ? 'angle-up' : 'angle-down'"
          v-bind:icon-size = "3"/>
        <template
          v-slot:content>
          <NDropdownChild
            icon-l = "netlify"
            icon-r = "arrow-up-right-from-square"
            text = "Netlify Forums"
            to = "https://answers.netlify.com/"
            w-border = "rounded-md"/>
        </template>
      </NTooltip>
    </div>
    <div
      w-align = "items-center"
      w-flex = "~"
      w-space = "x-2">
      <NTooltip
        content = "Toggle theme">
        <NButton
          level = "tertiary"
          v-bind:icon = "theme === 'dark' ? 'sun-bright' : 'moon'"
          v-bind:icon-size = "6"
          v-on:click = "toggleTheme"/>
      </NTooltip>
      <template
        v-if = "!store.nUser.loading">
        <NTooltip
          w-h = "8"
          w-w = "8"
          placement = "bottom-end"
          v-bind:offset = "2">
          <button
            w-border = "0 rounded-full"
            w-cursor = "pointer"
            w-h = "8"
            w-overflow = "hidden"
            w-p = "0"
            w-ring = "offset-2 offset-cWhite dark:offset-cBlack focus:2 focus:lTeal300 focus:dark:dTeal300 hover:2"
            w-w = "8">
            <img
              alt = "user icon"
              w-h = "8"
              w-w = "8"
              v-bind:src = "store.nUser.avatar_url"
              v-if = "store.nUser.avatar_url"/>
            <span
              w-align = "items-center"
              w-flex = "~"
              w-gradient = "from-dBlue400 to-br to-dBlue200"
              w-h = "8"
              w-justify = "center"
              w-text = "cWhite"
              w-w = "8"
              v-else>
              <NIcon
                name = "netlify"
                v-bind:size = "4"/>
            </span>
          </button>
          <template
            v-slot:content>
            <NDropdownChild
              icon-l = "plus"
              text = "New ticket"
              to = "/tickets/new"
              w-border = "rounded-t-md"/>
            <NDropdownChild
              icon-l = "messages"
              text = "My tickets"
              to = "/tickets"/>
            <div
              w-border = "rounded-b-md"
              w-overflow = "hidden"
              v-bind:w-cursor = "savingBtnLogout ? 'not-allowed' : 'auto'"
              v-bind:w-opacity = "savingBtnLogout ? '50' : '100'">
              <NDropdownChild
                icon-l = "arrow-right-from-bracket"
                text = "Logout"
                variant = "danger"
                v-bind:saving = "savingBtnLogout"
                v-on:click = "savingBtnLogout ? null : logout()"/>
            </div>
          </template>
        </NTooltip>
      </template>
      <NButton
        level = "primary"
        icon = "arrow-right-to-bracket"
        text = "Login"
        v-bind:saving = "store.loginLoading"
        v-else
        v-on:click = "store.loginLoading ? null : store.login(route.path)"/>
    </div>
  </header>
  <aside
    w-border = "rounded-md"
    w-box = "border"
    w-m = "t-6 x-auto"
    w-max-w = "320"
    w-p = "6"
    w-w = "full"
    v-bind:w-bg = "sysStatusStyles.bg"
    v-bind:w-text = "sysStatusStyles.text">
    <template
      v-if = "sysStatus">
      <a
        target = "_blank"
        rel = "nofollow noopener noreferrer"
        w-align = "items-center"
        w-flex = "~"
        w-justify = "center"
        w-space = "x-1"
        v-bind:href = "sysStatus.page.url"
        v-bind:w-text = "`${sysStatusStyles.text} no-underline`">
        <p
          w-font = "semibold"
          w-m = "0"
          w-text = "center">{{sysStatus.status.description}}</p>
        <NIcon
          name = "arrow-up-right-from-square"/>
      </a>
    </template>
    <p
      w-m = "0"
      w-text = "center"
      v-else>Checking system status...</p>
  </aside>
  <main
    w-m = "t-6 x-auto"
    w-max-w = "320"
    w-w = "full">
    <div
      w-bg = "cWhite dark:[#0d1117]"
      w-border = "~ lGray300 rounded-md solid dark:dGray700"
      w-flex = "~"
      w-gap = "3"
      w-font = "mono"
      w-p = "6"
      w-pos = "relative"
      w-text = "lCodeDefault space-nowrap xs dark:dCodeDefault"
      v-if = "store.error.status > 0">
      <div
        w-text = "cCodeSubtle">
        <span
          w-display = "block"
          w-p = "y-0.5">1</span>
        <span
          w-display = "block"
          w-p = "y-0.5">2</span>
        <span
          w-display = "block"
          w-p = "y-0.5">3</span>
        <span
          w-display = "block"
          w-p = "y-0.5">4</span>
        <span
          w-display = "block"
          w-p = "y-0.5">5</span>
      </div>
      <div
        w-flex = "1"
        w-overflow = "x-auto"
        w-scrollbar = "thin thumb-lTeal400 track-lTeal500 dark:thumb-dTeal400 dark:track-dTeal500">
        <span
          w-display = "block"
          w-p = "y-0.5">{</span>
        <span
          w-display = "block"
          w-p = "y-0.5">
          <span
            w-text = "lCodeEntity dark:dCodeEntity">&nbsp;&nbsp;"message"</span>
          <span>:</span>
          <span
            w-text = "lCodeString dark:dCodeString"
            v-if = "store.error.message">&nbsp;"{{store.error.message}}"</span>
          <span
            w-text = "lCodeConstant dark:dCodeConstant"
            v-else>&nbsp;null</span>
          <span>,</span>
        </span>
        <span
          w-display = "block"
          w-p = "y-0.5">
          <span
            w-text = "lCodeEntity dark:dCodeEntity">&nbsp;&nbsp;"request_id"</span>
          <span>:</span>
          <span
            w-text = "lCodeString dark:dCodeString"
            v-if = "store.error.request_id">&nbsp;"{{store.error.request_id}}"</span>
          <span
            w-text = "lCodeConstant dark:dCodeConstant"
            v-else>&nbsp;null</span>
          <span>,</span>
        </span>
        <span
          w-display = "block"
          w-p = "y-0.5">
          <span
            w-text = "lCodeEntity dark:dCodeEntity">&nbsp;&nbsp;"status"</span>
          <span>:</span>
          <span
            w-text = "lCodeConstant dark:dCodeConstant">&nbsp;{{store.error.status}}</span>
        </span>
        <span
          w-display = "block">}</span>
      </div>
    </div>
    <RouterView
      v-else/>
  </main>
  <footer
    w-m = "t-6 x-auto"
    w-max-w = "320"
    w-w = "full">
    <p
      w-m = "0"
      w-text = "center"
      w-w = "full">&copy; {{new Date().getFullYear()}} Netlify</p>
  </footer>
  <template
    v-if = "store.toasts.length > 0">
    <NToast
      v-bind:id = "toast.id"
      v-bind:key = "toast.id"
      v-for = "toast in store.toasts"/>
  </template>
</template>
<!--
  <safe
    w-bg = "lGold200 lGray300 lRed300 lTeal300 dark:dGold500 dark:dGray400 dark:dRed200 dark:dTeal300"
    w-cursor = "auto not-allowed"
    w-opacity = "0 50 100"
    w-text = "no-underline lGold500 lTeal500 dark:cWhite dark:dGold200 dark:dRed500 dark:dTeal500"/>
-->