<template>
  <div id="app">
    <KiszHeader>
    </KiszHeader>
    <div class="app__body" v-if="$store.state.loaded">
      <MenuList>
      </MenuList>
      <div class="app__router">
        <router-view/>
      </div>
    </div>
    <div v-else class="app__body app__body--loader">
      <h2> Witaj w kiszmenu! </h2>
      <img :src="loader" alt="loader"/>
    </div>
  </div>
</template>

<script>
import KiszHeader from './KiszHeader'
import MenuList from './components/MenuList'
import Loader from './assets/loader.jpg'

export default {
  name: 'app',
  data () {
    return {
      loader: Loader
    }
  },

  created () {
    this.$store.dispatch('getMenus')
  },

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
    KiszHeader,
    MenuList
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

  .app__body--loader {
    display: flex;
    flex-direction: column;

    img {
      display: block;
      margin: 50px auto 0;
      height: 50px;
      width: 50px;
      animation: loaderRotation 1s infinite linear;
    }

    @keyframes loaderRotation {
      0%  {transform: rotate(0deg);}
      100%{transform: rotate(360deg);}    
    }
  }

  .app__router {
    flex: 4;
  }
}
</style>
