import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '@/components/Welcome'
import Add from '@/components/Add'
import Menu from '@/components/Menu'
import ToDoList from '@/components/ToDoList'
import MenuList from '@/components/MenuList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Welcome
    },
    {
      path: '/add',
      name: 'Add',
      component: Add
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
      path: '/menus/',
      name: 'MenuList',
      component: MenuList
    }
  ]
})
