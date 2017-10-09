import Vue from 'vue'
import Vuex from 'vuex'

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
    activeThread: null
  },

  mutations: {
    firstMutation (state, payload) {
      console.log('mutation', payload)
    }
  },

  actions: {
    addToFirebase (context, payload) {
      console.log('add', payload)
    }
  }
})

export default store
