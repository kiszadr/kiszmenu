import Vue from 'vue'
import Vuex from 'vuex'
import * as Firebase from 'firebase'
import Es6Promise from 'es6-promise'
Es6Promise.polyfill()

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    userName: '',
    activeMenuList: {},
    showMenu: {
      title: '',
      description: '',
      image: ''
    },
    menuLoaded: false,
    currentMenuKey: '',
    limit: 10,
    limitedListVisibility: true,
    loaded: false,
    searchedMenu: '',
    todos: [],
    todosLoaded: false,
    lastMenuListKey: '',
    moreMenusClickCounter: 0,
    currentMenusShown: 5,
    getNewMenusCounter: 6,
    mainDatabase: {},
    todoListDatabase: {}
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
        if (payload[item].title && !state.activeMenuList[item]) {
          state.lastMenuListKey = item
          Vue.set(state.activeMenuList, item, payload[item])
        }
      })
    },

    SET_MENU_TO_SHOW (state, payload) {
      console.log('set menu', payload)
      Vue.set(state, 'showMenu', payload.menu)
      Vue.set(state.showMenu, 'key', payload.key)
    },

    MENU_IS_LOADING (state, bool) {
      state.menuLoaded = bool
    },

    LIMITED_LIST_VISIBILITY (state, bool) {
      state.limitedListVisibility = bool
    },

    TODOS_FROM_FIREBASE (state, todos) {
      if (state.todos.length) {
        let current = []

        for (let i = 0, l = todos.length; i < l; i += 1) {
          current.push({
            text: todos[i],
            bought: false,
            id: i
          })
        }
        state.todos = [...current]
      }
      state.todosLoaded = true
    },

    MENU_CHILD_ADDED (state, newMenu) {
      if (!state.activeMenuList[newMenu.key]) {
        let menuObj = {}
        menuObj[newMenu.key] = newMenu.details
        const newActiveMenuList = Object.assign(menuObj, state.activeMenuList)

        Vue.set(state, 'activeMenuList', newActiveMenuList)
        state.currentMenusShown += 1
      }
    },

    INCREASE_MORE_MENUS_COUNTER (state) {
      state.moreMenusClickCounter += 1
    },

    FIREBASE_IS_LOADED (state, bool) {
      state.loaded = bool
    },

    SET_MAIN_DATABASE_NAME (state, payload) {
      state.mainDatabase = Firebase.database().ref(payload)
    },

    SET_TODOLIST_DATABASE_NAME (state, payload) {
      state.todoListDatabase = Firebase.database().ref(payload)
    },

    SET_USER_PRIVATE_DATABASE_NAME (state, payload) {
      state.privateDatabase = Firebase.database().ref(payload)
    },

    SET_USER_NAME (state, payload) {
      state.userName = payload
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
        try {
          context.state.mainDatabase.push(payload).then((status) => {
            resolve(status)
          })
        } catch (err) {
          reject(err)
        }
      })
    },

    updateFirebaseChild (context, payload) {
      return new Promise((resolve, reject) => {
        const childKey = payload.key
        const childMenu = payload.menu
        context.state.mainDatabase.child(childKey).set(childMenu).then(() => {
          resolve()
        }, (err) => {
          reject(err)
        })
      })
    },

    getMenus (context) {
      context.commit('FIREBASE_IS_LOADED', false)
      return new Promise((resolve) => {
        context.state.mainDatabase.orderByKey().limitToLast(context.state.getNewMenusCounter - 1).once('value', (menu) => {
          context.commit('MENUS_FROM_FIREBASE', menu.val())
          context.dispatch('addChildAddedListener', context.state.mainDatabase)
          resolve()
        })
      })
    },

    addChildAddedListener (context, Firebase) {
      Firebase.limitToLast(1).on('child_added', (menu, prevChildKey) => {
        const newMenu = {
          key: menu.key,
          details: menu.val()
        }
        context.commit('MENU_CHILD_ADDED', newMenu)
      })
    },

    getMoreMenus (context) {
      return new Promise((resolve) => {
        context.state.mainDatabase.orderByKey().endAt(context.state.lastMenuListKey).limitToLast(context.state.getNewMenusCounter + 1).once('value', (menu) => {
          context.commit('MENUS_FROM_FIREBASE', menu.val())
          context.commit('INCREASE_MORE_MENUS_COUNTER')
          resolve()
        })
      })
    },

    showMenu (context, menuKey) {
      return new Promise((resolve) => {
        if (context.state.activeMenuList.hasOwnProperty(menuKey)) {
          context.commit('SET_MENU_TO_SHOW', { menu: context.state.activeMenuList[menuKey], key: menuKey })
          context.commit('MENU_IS_LOADING', true)
          resolve()
        } else {
          context.commit('MENU_IS_LOADING', false)
          context.state.mainDatabase.child(menuKey).once('value', function (menu) {
            // context.commit('MENUS_FROM_FIREBASE', menu.val())
            context.commit('SET_MENU_TO_SHOW', { menu: menu.val(), key: menuKey })
            context.commit('MENU_IS_LOADING', true)
            resolve()
          })
        }
      })
    },

    getTodoList (context) {
      return new Promise((resolve) => {
        if (context.state.todos.length > 0) {
          resolve(context.state.todos)
        } else {
          context.state.todoListDatabase.once('value', (list) => {
            const todos = list.val()
            context.commit('TODOS_FROM_FIREBASE', todos)
            resolve(todos)
          })
        }
      })
    },

    setTodoList (context, list) {
      return new Promise((resolve, reject) => {
        context.state.todoListDatabase.set(list).then(() => {
          resolve()
        },
        (err) => {
          reject(err)
        })
      })
    },

    /** Firebase **/
    setUser (context, payload) {
      context.commit('SET_USER_NAME', payload.displayName)
    },

    setEmptyUser (context) {
      context.commit('SET_USER_NAME', '')
    },

    signInByGoogle () {
      const provider = new Firebase.auth.GoogleAuthProvider()
      Firebase.auth().signInWithPopup(provider)
    },

    signInByFacebook () {
      const provider = new Firebase.auth.FacebookAuthProvider()
      Firebase.auth().signInWithPopup(provider)
    },

    logoutUser (context) {
      Firebase.auth().signOut()
    }
  },

  getters: {
    showMoreChecker: state => {
      return Object.keys(state.activeMenuList).length === state.currentMenusShown + state.getNewMenusCounter * state.moreMenusClickCounter
    },

    activeMenusGetter: (state, getters) => {
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
    },

    getUserName: state => state.userName.split(' ')[0],
    getShowMenu: state => state.showMenu || {},
    getShowMenuKey: (state, getters) => getters.getShowMenu.key || ''
  }
})

export default store
