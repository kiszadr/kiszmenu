<template>
  <div id="app">
    <KiszHeader>
    </KiszHeader>
    <div class="app__body">
      <div class="app__router">
        <router-view>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script>
import KiszHeader from './KiszHeader'

export default {
  name: 'app',

  // created () {
    // if (this.$route.name !== 'TodoList') {
    // this.$store.dispatch('getMenus')
  // },

  methods: {
    setCurrentMenu (key) {
      this.$store.dispatch('showMenu', key)
      this.$router.push(`/menu/${key}`)
    },
    setLimitedListVisibility () {
      this.$store.dispatch('setLimitedListVisibility')
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
  // text-align: center;
  color: #2c3e50;
  
  .app__body {
    max-width: 1000px;
    margin: auto;
  }
}
</style>
