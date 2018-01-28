import Vue from 'vue'
import Vuex from 'vuex'
import * as Firebase from 'firebase'
import Es6Promise from 'es6-promise'
Es6Promise.polyfill()

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: '',
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

    SET_USER (state, payload) {
      state.user = payload
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
            console.log('addToFirebase')
            resolve(status)
          })
        } catch (err) {
          console.log('error addToFirebase', err)
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

    addChildAddedListener (context, database) {
      database.limitToLast(1).on('child_added', (menu, prevChildKey) => {
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
      return new Promise((resolve, reject) => {
        if (context.state.activeMenuList.hasOwnProperty(menuKey)) {
          context.commit('SET_MENU_TO_SHOW', { menu: context.state.activeMenuList[menuKey], key: menuKey })
          context.commit('MENU_IS_LOADING', true)
          resolve()
        } else {
          context.commit('MENU_IS_LOADING', false)
          context.state.mainDatabase.child(menuKey).once('value', function (menu) {
            // context.commit('MENUS_FROM_FIREBASE', menu.val())
            if (menu.val()) {
              context.commit('SET_MENU_TO_SHOW', { menu: menu.val(), key: menuKey })
              context.commit('MENU_IS_LOADING', true)
              resolve()
            } else {
              // eslint-disable-next-line prefer-promise-reject-errors
              reject(menuKey)
            }
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

    /** Firebase auth **/
    setUser (context, payload) {
      context.commit('SET_USER', payload.providerData[0])
    },

    setEmptyUser (context) {
      context.commit('SET_USER', {})
    },

    signIn (context, payload) {
      return new Promise((resolve, reject) => {
        const provider = new Firebase.auth[`${payload}AuthProvider`]()
        Firebase.auth().signInWithPopup(provider).then((signInUser) => {
          console.log('signInUser', signInUser.user.email)
          Firebase.database()
            .ref('users')
            .orderByChild('email')
            .equalTo(signInUser.user.email)
            .once('value', (user) => {
              console.log('user', user.val())
              if (user.val()) {
                resolve()
              } else {
                context.dispatch('createUserAccount', signInUser.user.providerData[0]).then(() => {
                  resolve()
                })
              }
            })
        }, (err) => {
          console.error('signIn err', err)
          // eslint-disable-next-line prefer-promise-reject-errors
          reject()
        })
      })
    },

    signOut (context) {
      Firebase.auth().signOut()
    },

    createUserAccount (context, payload) {
      return new Promise((resolve, reject) => {
        const userDetails = payload

        try {
          Firebase.database().ref('users').push(userDetails).then((status) => {
            resolve(status)
          })
        } catch (err) {
          console.log('error addToFirebase', err)
          reject(err)
        }
      })
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

    getUserName: state => (state.user.displayName && state.user.displayName.split(' ')[0]) || '',
    getUserEmail: state => state.user.email || '',
    getShowMenu: state => state.showMenu || {}
  }
})

export default store
