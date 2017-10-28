import Vue from 'vue'
import Vuex from 'vuex'
import * as Firebase from 'firebase'
import Es6Promise from 'es6-promise'
Es6Promise.polyfill()

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    isSignedIn: false,
    columns: [
      {id: 0, name: 'New', threads: []},
      {id: 1, name: 'Needs attention', threads: []},
      {id: 2, name: 'Waiting for answer', threads: []},
      {id: 3, name: 'Closed', threads: []}
    ],
    activeThread: null,
    activeMenuList: {},
    showMenu: {
      title: '',
      description: '',
      image: ''
    },
    currentMenuKey: '',
    limit: 10,
    limitedListVisibility: true,
    loaded: false,
    searchedMenu: '',
    todos: [],
    todosLoaded: false,
    lastMenuListKey: ''
  },

  mutations: {
    SEARCHED_MENU (state, payload) {
      state.searchedMenu = payload.toLowerCase()
    },

    MENUS_FROM_FIREBASE (state, payload) {
      if (!state.loaded) {
        state.loaded = true
      }
      Object.keys(payload).reverse().map((item, index) => {
        state.lastMenuListKey = item
        Vue.set(state.activeMenuList, item, payload[item])
      })
    },

    SET_SHOW_MENU (state, menu) {
      Vue.set(state, 'showMenu', menu)
    },

    SET_CURRENT_MENU_IMAGE (state, url) {
      Vue.set(state.showMenu, 'image', url)
    },

    LIMITED_LIST_VISIBILITY (state, bool) {
      state.limitedListVisibility = bool
    },

    TODOS_FROM_FIREBASE (state, todos) {
      state.todos = todos
      state.todosLoaded = true
    },

    FIREBASE_IS_LOADED (state, bool) {
      state.loaded = bool
    },

    MENU_CHILD_ADDED (state, newMenu) {
      let menuObj = {}
      menuObj[newMenu.key] = newMenu.details
      const newActiveMenuList = Object.assign(menuObj, state.activeMenuList)

      Vue.set(state, 'activeMenuList', newActiveMenuList)
    }
  },

  actions: {
    searchMenu (context, payload) {
      context.commit('SEARCHED_MENU', payload)
    },

    setLimitedListVisibility (context) {
      context.commit('LIMITED_LIST_VISIBILITY', !context.state.limitedListVisibility)
    },

    addToFirebase (context, payload) {
      return new Promise((resolve, reject) => {
        const kiszmenu = Firebase.database().ref('kiszmenu')
        try {
          kiszmenu.push(payload)
        } catch (err) {
          reject(err)
        }
        resolve()
      })
    },

    getMenus (context) {
      context.commit('FIREBASE_IS_LOADED', false)
      return new Promise((resolve) => {
        const kiszmenu = Firebase.database().ref('kiszmenu')
        kiszmenu.orderByKey().limitToLast(5).once('value', (menu) => {
          context.commit('MENUS_FROM_FIREBASE', menu.val())
          context.dispatch('addChildAddedListener', kiszmenu)
          resolve()
        })
      })
    },

    addChildAddedListener (context, firebase) {
      firebase.limitToLast(1).on('child_added', (menu, prevChildKey) => {
        const newMenu = {
          key: menu.key,
          details: menu.val()
        }
        context.commit('MENU_CHILD_ADDED', newMenu)
      })
    },

    getMoreMenus (context) {
      return new Promise((resolve) => {
        const kiszmenu = Firebase.database().ref('kiszmenu')
        kiszmenu.orderByKey().endAt(context.state.lastMenuListKey).limitToLast(6).once('value', (menu) => {
          context.commit('MENUS_FROM_FIREBASE', menu.val())
          resolve()
        })
      })
    },

    showMenu (context, menuKey) {
      if (context.state.activeMenuList.hasOwnProperty(menuKey)) {
        context.commit('SET_SHOW_MENU', context.state.activeMenuList[menuKey])
      } else {
        context.commit('FIREBASE_IS_LOADED', false)
        Firebase.database().ref('kiszmenu').child(menuKey).once('value', function (menu) {
          context.commit('MENUS_FROM_FIREBASE', menu.val())
          context.commit('SET_SHOW_MENU', menu.val())
        })
      }
    },

    getTodoList (context) {
      return new Promise((resolve) => {
        if (context.state.todos.length > 0) {
          resolve(context.state.todos)
        } else {
          const todoList = Firebase.database().ref('todoList')

          todoList.once('value', (list) => {
            const todos = list.val()
            context.commit('TODOS_FROM_FIREBASE', todos)
            resolve(todos)
          })
        }
      })
    },

    setTodoList (context, list) {
      return new Promise((resolve, reject) => {
        Firebase.database().ref('todoList').set(list).then(() => {
          resolve()
        },
        (err) => {
          reject(err)
        })
      })
    }
  },

  getters: {
    activeMenuGetter: (state, getters) => {
      return getters.limitedSearchedMenus.length > 0 ? getters.limitedSearchedMenus.reverse() : Object.keys(state.activeMenuList)
    },

    limitedSearchedMenus: (state, getters) => {
      if (getters.searchedMenu.length === 0) {
        return []
      }
      return state.limitedListVisibility ? getters.searchedMenu.slice(0, state.limit) : getters.searchedMenu
    },

    searchedMenu: state => {
      return state.searchedMenu === '' ? [] : Object.keys(state.activeMenuList).filter((key) => state.activeMenuList[key].title.toLowerCase().match(state.searchedMenu, 'i'))
    }
  }
})

export default store
