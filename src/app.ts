// noinspection AnonymousFunctionJS, ChainedFunctionCallJS, ConstantOnRightSideOfComparisonJS, FunctionWithInconsistentReturnsJS, FunctionWithMultipleReturnPointsJS, MagicNumberJS, NestedFunctionCallJS

import {createApp, nextTick, watch} from 'vue'
import {createPinia} from 'pinia'
import {createRouter, createWebHistory} from 'vue-router'
import {useStore} from '~/client/store'
import NLayout from '~/client/layouts/n-layout.vue'
import 'swiper/css'
//import 'virtual:windi.css'
import 'uno.css'
import '~/client/css/styles.css'
const app = createApp(NLayout)
const pinia = createPinia()
const store = useStore()
const router = createRouter({
  history: createWebHistory(),
  routes: [{
    component: () => {
      return import('~/client/pages/n-index.vue')
    },
    name: 'n-index',
    path: '/'
  }, {
    component: () => {
      return import('~/client/pages/n-ticket-list.vue')
    },
    name: 'n-ticket-list',
    path: '/tickets'
  }, {
    component: () => {
      return import('~/client/pages/n-ticket-view.vue')
    },
    name: 'n-ticket-view',
    path: '/ticket/:ticketId'
  }, {
    component: () => {
      return import('~/client/pages/n-ticket-new.vue')
    },
    name: 'n-ticket-new',
    path: '/tickets/new'
  }],
  scrollBehavior: to => {
    if (to.name === 'n-ticket-view' && to.hash.startsWith('#comment-')) {
      if (store.ticketSel.comments.length > 0) {
        document.querySelector(to.hash)!.scrollIntoView({
          behavior: 'smooth'
        })
      } else {
        const commentWatcher = watch([() => {
          return store.error
        }, () => {
          return store.ticketSel.comments
        }], () => {
          if (store.error.status > 0) {
            commentWatcher()
          }
          if (store.ticketSel.comments.length > 0) {
            commentWatcher()
            nextTick().then(() => {
              document.querySelector(to.hash)!.scrollIntoView({
                behavior: 'smooth'
              })
            })
          }
        }, {
          immediate: true
        })
      }
    }
  }
})
router.afterEach(() => {
  store.compLoading = false
})
router.beforeEach((to, _, next) => {
  if (typeof to.matched[0]!.components!['default'] === 'function') {
    store.compLoading = true
  }
  if (to.query['csrf']) {
    if (to.query['csrf'] !== localStorage.getItem('csrf')) {
      store.error = {
        message: 'csrf error',
        notification: 'skipped',
        request_id: null,
        status: 1000
      }
    }
    delete to.query['csrf']
    next({
      ...to,
      replace: true
    })
  } else {
    next()
  }
  localStorage.removeItem('csrf')
})
app.use(pinia).use(router).mount('body')