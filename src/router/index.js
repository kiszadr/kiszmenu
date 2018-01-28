import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '@/components/Welcome'
import Login from '@/components/Login'
import Add from '@/components/Add'
import Menu from '@/components/Menu'
import ToDoList from '@/components/ToDoList'
import MenuList from '@/components/MenuList'
import store from '../store'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Welcome
    },
    {
      path: '/add',
      name: 'Add',
      component: Add,
      meta: { requiresAuth: true }
    },
    {
      path: '/menu/:key',
      name: 'Menu',
      component: Menu
    },
    {
      path: '/todo/',
      name: 'TodoList',
      component: ToDoList
    },
    {
      path: '/menus',
      name: 'MenuList',
      component: MenuList
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: { isNotLoggedIn: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters.getUserName) {
      next({
        path: '/login'
      })
    } else {
      next()
    }
  } else if (to.matched.some(record => record.meta.isNotLoggedIn)) {
    if (store.getters.getUserName) {
      next({
        path: from.path
        // query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next() // make sure to always call next()!
  }
})

export default router
