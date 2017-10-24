<template>
  <div class="menu" v-if="$store.state.loaded">
    <h2> {{ currentMenuTitle }}</h2>
    <!-- <div v-if="currentMenuImage.length > 0" :style="`background-image: url(${currentMenuImage}); width: 100px; height: 100px;`"> -->
    <div v-if="currentMenuImage.length > 0">
      <img class="menu__mainImage"
        :src="currentMenuImage"
        :alt="currentMenuTitle"
      />
    </div>
    <p> {{ currentMenuDescription }} </p>
  </div>
  <Loader v-else>
    <h3> ładuję menu </h3>
  </Loader>
</template>

<script>
import Loader from './partials/Loader'

export default {
  name: 'Menu',
  props: {
    showMenu: {
      type: Object
    }
  },

  computed: {
    currentMenuTitle () {
      return this.$store.state.showMenu.title
    },
    currentMenuDescription () {
      return this.$store.state.showMenu.description
    },
    currentMenuImage () {
      const emptyImage = 'https://hash.fm/resources/source/85752/image'
      return this.$store.state.showMenu.image ? this.$store.state.showMenu.image : emptyImage
    }
  },

  created () {
    this.$store.dispatch('showMenu', this.$route.params.key)
  },

  components: {
    Loader
  }
}
</script>


<style scoped lang='scss'>
  .menu {
    .menu__mainImage {
      width: 100%;
      max-width: 500px;
      height: auto;
      max-height: 400px;
      object-fit: contain;
    }
  }
</style>
