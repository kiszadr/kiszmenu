<template>
  <div id="app">
    <img src="./assets/logo.png">
    <router-view/>
    <button @click="addToBase"> dodaj obj do firebase </button>
  </div>
</template>

<script>
export default {
  name: 'app',
  methods: {
    addToBase () {
      // this.this.$parent.$firebase.kiszmenu.push({
      //   name: {
      //     id: 1,
      //     text: 'tralalalalallalala',
      //     details: 'details',
      //     shortDescription: 'pyszne'
      //   }
      // })
      console.log('button', this.$parent.$firebaseRefs.kiszmenu.push(['aaaaaaa']))
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
