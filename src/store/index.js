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
    activeMenu: {},
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
    todosLoaded: false
  },

  mutations: {
    SEARCHED_MENU (state, payload) {
      state.searchedMenu = payload.toLowerCase()
    },

    MENUS_FROM_FIREBASE (state, payload) {
      if (!state.loaded) {
        state.loaded = true
      }
      Vue.set(state, 'activeMenu', {})
      Object.keys(payload).map((item) => {
        Vue.set(state.activeMenu, item, payload[item])
      })
    },

    SET_SHOW_MENU (state, menuKey) {
      Vue.set(state, 'showMenu', state.activeMenu[menuKey])
    },

    SET_CURRENT_MENU_IMAGE (state, url) {
      Vue.set(state.showMenu, 'image', url)
    },

    LIMITED_LIST_VISIBILITY (state, bool) {
      state.limitedListVisibility = bool
    },

    TODOS_FROM_FIREBASE (state, todos) {
      console.log('todos', todos)
      state.todos = todos
      state.todosLoaded = true
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
      return new Promise((resolve) => {
        const kiszmenu = Firebase.database().ref('kiszmenu')

        // listener wylapuje dodanie do firebase, wiec wystarczy tylko tu robic mutacje
        kiszmenu.on('value', (menu) => {
          context.commit('MENUS_FROM_FIREBASE', menu.val())
          resolve()
        })
      })
    },

    getTodoList (context) {
      return new Promise((resolve) => {
        const todoList = Firebase.database().ref('todoList')

        todoList.once('value', (list) => {
          const todos = list.val()
          context.commit('TODOS_FROM_FIREBASE', todos)
          resolve(todos)
        })
      })
    },

    setTodoList (context, list) {
      console.log('vuex set', list)
      return new Promise((resolve) => {
        Firebase.database().ref('todoList').set(list)
        // przydaloby sie jakies potwierdzenie
        resolve()
      })
    },

    showMenu (context, menuKey) {
      context.dispatch('getMenus').then(() => {
        context.commit('SET_SHOW_MENU', menuKey)
      })
    }
  },

  getters: {
    activeMenuGetter: (state, getters) => {
      return state.limitedListVisibility ? getters.activeMenus.slice(0, state.limit) : getters.activeMenus
    },

    activeMenus: (state, getters) => {
      return getters.limitedSearchedMenus.length > 0 ? getters.limitedSearchedMenus.reverse() : Object.keys(state.activeMenu).reverse()
    },

    limitedSearchedMenus: (state, getters) => {
      if (getters.searchedMenu.length === 0) {
        return []
      }
      return state.limitedListVisibility ? getters.searchedMenu.slice(0, state.limit) : getters.searchedMenu
    },

    searchedMenu: state => {
      return state.searchedMenu === '' ? [] : Object.keys(state.activeMenu).filter((key) => state.activeMenu[key].title.toLowerCase().match(state.searchedMenu, 'i'))
    }
  }
})

export default store
