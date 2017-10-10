<template>
  <div id="app">
    <KiszHeader>
    </KiszHeader>
    <div class="app__body">
      <div class="app__menu">
        <ul>
          <li v-for="item in Object.keys(kiszmenu)" 
            :key="kiszmenu[item].title"
          >
            {{ kiszmenu[item].title }}
          </li>
        </ul>
      </div>
      <div class="app__router">
        <router-view @addToFirebase="addToFirebase"/>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VueFire from 'vuefire'
import Firebase from 'firebase'

import KiszHeader from './KiszHeader'

Vue.use(VueFire)

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

export default {
  name: 'app',
  data () {
    return {
      firebaseItems: []
    }
  },

  firebase: {
    kiszmenu: {
      source: db.ref('kiszmenu'),
      // optionally bind as an object
      asObject: true,
      // optionally provide the cancelCallback
      cancelCallback: function () {
        console.log('cos poszlo nie tak')
      },
      // this is called once the data has been retrieved from firebase
      readyCallback: function () {
        console.log('firebase ready')
      }
    }
    // kiszmenu: db.ref('kiszmenu')
  },

  methods: {
    addToFirebase (menu) {
      db.ref('kiszmenu').push(menu)
      console.log('Object.keys(kiszmenu)', Object.keys(this.kiszmenu))
    }
  },
  components: {
    KiszHeader
  }
}
</script>

<style lang='scss'>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  
  .app__body {
    display: flex;
  }
  .app__menu {
    flex: 1;
    background: #c2c2c2;
  }

  .app__router {
    flex: 4;
    background: #666;
  }
}
</style>
