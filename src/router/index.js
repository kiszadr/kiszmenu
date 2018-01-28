import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '@/components/Welcome'
import Add from '@/components/Add'
import Menu from '@/components/menu/Menu'
import ToDoList from '@/components/ToDoList'
import MenuList from '@/components/menu/MenuList'
import Page404 from '@/components/Page404'
import BadMenuKey from '@/components/BadMenuKey'
import Logout from '@/components/Logout'
import store from '../store'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Welcome,
      meta: { available: true }
    },
    {
      path: '/logout',
      name: 'Logout',
      component: Logout,
      meta: { available: true }
    },
    {
      path: '/add',
      name: 'Add',
      component: Add,
      meta: {
        requiresAuth: true,
        available: true
      }
    },
    {
      path: '/menu/:key',
      name: 'Menu',
      component: Menu,
      meta: { available: true }
    },
    {
      path: '/todo/',
      name: 'TodoList',
      component: ToDoList,
      meta: { available: true }
    },
    {
      path: '/menus',
      name: 'MenuList',
      component: MenuList,
      meta: { available: true }
    },
    {
      path: '/puste_menu/:key',
      name: 'BadMenuKey',
      component: BadMenuKey,
      meta: { available: true }
    },
    {
      path: '/404',
      name: '404',
      component: Page404,
      meta: { available: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.available)) {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      console.log('wejscie', store.getters.getUserName)
      if (!store.getters.getUserName) {
        next({
          path: from.path
        })
      } else {
        next()
      }
    } else {
      next()
    }
  } else {
    // fetch('Page404.php').then((response) => {
    //   console.log('poszlo 404', response)
    // })
    next({
      // path: '/404'
      path: from.path
    })
  }
})

export default router
