// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import * as firebase from 'firebase'
import config from './firebase/config'
import App from './App'
import router from './router'
import store from './store'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  created () {
    firebase.initializeApp(config)
    this.$store.commit('SET_MAIN_DATABASE_NAME', 'public')
    this.$store.commit('SET_TODOLIST_DATABASE_NAME', 'todoList')
    this.$store.commit('SET_USER_PRIVATE_DATABASE_NAME', 'private')
    firebase.auth().onAuthStateChanged((user) => {
      if (user) { // User is signed in!
        this.$store.dispatch('setUser', user)
      } else { // User is signed out!
        this.$store.dispatch('setEmptyUser')
      }
    })
  }
})
