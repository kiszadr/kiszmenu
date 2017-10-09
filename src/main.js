// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueFire from 'vuefire'
import Firebase from 'firebase'

import App from './App'
import router from './router'
import store from './store'

Vue.use(VueFire)
Vue.config.productionTip = false

// Initialize Firebase
const config = {
  apiKey: 'AIzaSyBa2KO_tUvUF64gPgX2PfhFCy6rOoKsZfM',
  authDomain: 'kiszmenu.firebaseapp.com',
  databaseURL: 'https://kiszmenu.firebaseio.com',
  projectId: 'kiszmenu',
  storageBucket: 'kiszmenu.appspot.com',
  messagingSenderId: '835934660927'
}
const firebaseApp = Firebase.initializeApp(config)
const db = firebaseApp.database()

console.log('base', db)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  firebase: {
    // kiszmenu: {
    //   source: db.ref('kiszmenu'),
    //   // optionally bind as an object
    //   asObject: true,
    //   // optionally provide the cancelCallback
    //   cancelCallback: function () {},
    //   // this is called once the data has been retrieved from firebase
    //   readyCallback: function () {
    //     console.log('firebase ready')
    //   }
    // }
    kiszmenu: db.ref('kiszmenu')
  },
  store,
  template: '<App/>',
  components: { App }
})
