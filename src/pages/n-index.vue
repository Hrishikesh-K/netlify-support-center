<!--suppress AnonymousFunctionJS, ChainedFunctionCallJS, ConstantOnRightSideOfComparisonJS, HtmlUnknownAttribute, JSValidateTypes, MagicNumberJS, NestedFunctionCallJS -->
<script
  setup
  lang = "ts">
  import type {_DPost} from '~/@types'
  import axios from 'axios'
  import {onMounted} from 'vue'
  import {Autoplay} from 'swiper'
  import {Swiper, SwiperSlide} from 'swiper/vue'
  import {useStore} from '~/client/store'
  import NMascot from '~/client/assets/mascot.svg?component'
  import NProduct from '~/client/components/n-product.vue'
  const store = useStore()
  let forumPosts = $ref<Array<_DPost>>([])
  function fetchTopForumPosts() {
    axios({
      url: '/api/forums/posts',
    }).then((topPosts : {
      data : Array<_DPost>
    }) => {
      forumPosts = topPosts.data
    }, store.errorHandler)
  }
  onMounted(() => {
    fetchTopForumPosts()
  })
</script>
<template>
  <div
    w-align = "items-center"
    w-bg = "lBlue100 dark:dBlue400"
    w-border = "rounded-lg"
    w-box = "border"
    w-flex = "~ wrap"
    w-justify = "center"
    w-p = "6"
    w-w = "full">
    <NMascot
      w-max-h = "50 xs:75"
      w-max-w = "50 xs:75"/>
    <h2
      w-flex = "xs:1"
      w-m = "0"
      w-text = "center 4xl"
      w-w = "<xs:full">How can we help?</h2>
  </div>
  <h2
    w-font = "normal"
    w-m = "0 b-6 t-24">From our forums</h2>
  <Swiper
    auto-height
    grab-cursor
    w-m = "!-6"
    w-p = "!6"
    v-bind:autoplay = "{delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true}"
    v-bind:breakpoints = "{480: {slidesPerView: 2}, 1024: {slidesPerView: 3}}"
    v-bind:modules = "[Autoplay]"
    v-bind:slides-per-view = "1"
    v-bind:space-between = "24">
    <template
      v-if = "forumPosts.length > 0">
      <SwiperSlide
        rel = "nofollow noopener noreferrer"
        tag = "a"
        target = "_blank"
        w-bg = "cWhite dark:cBlack"
        w-border = "~ lGray300 rounded-lg solid dark:dGray700"
        w-box = "border"
        w-p = "6"
        w-shadow = "lShallow dark:dShallow"
        w-text = "cBlack no-underline dark:cWhite"
        v-bind:href = "`https://answers.netlify.com/t/${post.id}`"
        v-bind:key = "post.id"
        v-for = "post in forumPosts">
        <h3
          w-m = "0"
          w-overflow = "hidden">
          <span
            v-if = "post.has_accepted_answer">[Solved]&nbsp;</span>{{post.title}}</h3>
        <div
          w-flex = "~"
          w-gap = "x-6"
          w-m = "t-6">
          <div
            w-flex = "1">
            <p
              w-m = "0">Views</p>
            <p
              w-m = "0">{{post.views}}</p>
          </div>
          <div
            w-flex = "1">
            <p
              w-m = "0">Replies</p>
            <p
              w-m = "0">{{post.reply_count}}</p>
          </div>
        </div>
      </SwiperSlide>
    </template>
    <template
      v-else>
      <SwiperSlide
        w-bg = "cWhite dark:cBlack"
        w-border = "~ lGray300 rounded-lg solid dark:dGray700"
        w-box = "border"
        w-p = "6"
        w-shadow = "lShallow dark:dShallow"
        v-bind:key = "key"
        v-for = "key in Array.from(Array(10).keys())">
        <div
          w-animate = "pulse"
          w-bg = "lGray300 dark:dGray500"
          w-border = "rounded-md"
          w-h = "11">
        </div>
        <div
          w-flex = "~"
          w-gap = "x-6"
          w-m = "t-6">
          <div
            w-animate = "pulse"
            w-bg = "lGray300 dark:dGray500"
            w-border = "rounded-md"
            w-flex = "1"
            w-h = "9.5">
          </div>
          <div
            w-animate = "pulse"
            w-bg = "lGray300 dark:dGray500"
            w-border = "rounded-md"
            w-flex = "1"
            w-h = "9.5">
          </div>
        </div>
      </SwiperSlide>
    </template>
  </Swiper>
  <h2
    w-font = "normal"
    w-m = "0 t-24">Browse by product</h2>
  <div
    w-gap = "6"
    w-grid = "~ cols-1 md:cols-2 lg:cols-3"
    w-m = "t-6"
    w-w = "full">
    <NProduct
      icon = "user"
      name = "Account"/>
    <NProduct
      icon = "chart-line"
      name = "Analytics"/>
    <NProduct
      icon = "circle-nodes"
      name = "API"/>
    <NProduct
      icon = "send-back"
      name = "Background Functions"
      state = "beta"/>
    <NProduct
      icon = "receipt"
      name = "Billing"/>
    <NProduct
      icon = "puzzle-piece"
      name = "Build Plugins"/>
    <NProduct
      icon = "wifi"
      name = "CDN"/>
    <NProduct
      icon = "shapes"
      name = "CI/CD"/>
    <NProduct
      icon = "rectangle-terminal"
      name = "CLI"/>
    <NProduct
      icon = "folder-grid"
      name = "CMS"/>
    <NProduct
      icon = "share-nodes"
      name = "Collaborative Deploy Previews"/>
    <NProduct
      icon = "server"
      name = "DNS"/>
    <NProduct
      icon = "globe"
      name = "Domains"/>
    <NProduct
      icon = "function"
      name = "Edge Functions"
      state = "beta"/>
    <NProduct
      icon = "table-list"
      name = "Forms"/>
    <NProduct
      icon = "lambda"
      name = "Functions"/>
    <NProduct
      icon = "chart-network"
      name = "Graph"
      state = "beta"/>
    <NProduct
      icon = "wrench-simple"
      name = "Headers"/>
    <NProduct
      icon = "fingerprint"
      name = "Identity"/>
    <NProduct
      icon = "flask-vial"
      name = "Labs"
      state = "experimental"/>
    <NProduct
      icon = "code-branch"
      name = "Large Media"/>
    <NProduct
      icon = "grate"
      name = "Log Drains"/>
    <NProduct
      icon = "robot"
      name = "Prerendering"
      state = "beta"/>
    <NProduct
      icon = "shuffle"
      name = "Redirects"/>
    <NProduct
      icon = "split"
      name = "Split Testing"
      state = "beta"/>
    <NProduct
      icon = "binary-lock"
      name = "SSL"/>
    <NProduct
      icon = "rectangles-mixed"
      name = "Others"/>
  </div>
</template>