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
/*
<style lang='scss'>
@import url('https://fonts.googleapis.com/css?family=Merienda+One');
#app {
  // font-family: 'Avenir', Helvetica, Arial, sans-serif;
  font: 400 1rem 'Merienda One', Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
  //aa
  .app__body {
    max-width: 1000px;
    margin: auto;
  }
}
</style>
*/
</script>

<style lang='scss'>
@import url('http://fonts.googleapis.com/css?family=Milonga');

@font-face {
  font-family: myFirstFont;
  src: url(http://fonts.gstatic.com/s/milonga/v5/hwluam44b9JfoHvBi4IlqA.woff2);
}

@font-face {
  font-family: myFirstFont;
  src: url(http://fonts.gstatic.com/s/milonga/v5/FylG2WIUALMAaF22K8PzQfY6323mHUZFJMgTvxaG2iE.woff2);
}

#app {
  font: 400 1rem 'myFirstFont', Helvetica, sans-serif;
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
