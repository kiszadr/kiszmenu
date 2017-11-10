<template>
  <div class="menu" v-if="$store.state.menuLoaded">
    <h2> {{ currentMenuTitle }}</h2>
    <!-- <div v-if="currentMenuImage.length > 0" :style="`background-image: url(${currentMenuImage}); width: 100px; height: 100px;`"> -->
    <div v-if="currentMenuImage.length > 0">
      <img class="menu__mainImage"
        :src="currentMenuImage"
        :alt="currentMenuTitle"
      />
    </div>
    <section v-if="$store.state.showMenu.ingredients && $store.state.showMenu.ingredients.length">
      <h3> Ingredients </h3>
      <ol>
        <li v-for="(element, index) in $store.state.showMenu.ingredients" :key="`${element}-${index}`">
          {{ element.text }}
        </li>
      </ol>
    </section>
    <div v-html="currentMenuDescription"></div>
    <p> {{ currentMenuDescription }} </p>
  </div>
  <Loader v-else>
    <h6> ładuję menu </h6>
  </Loader>
</template>

<script>
import Loader from './partials/Loader'
import NoPhoto from '../assets/noPhoto.png'

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
      if (this.currentMenuTitle) {
        const firebaseImg = this.$store.state.showMenu.imageMedium ? this.$store.state.showMenu.imageMedium : this.$store.state.showMenu.image
        return firebaseImg || NoPhoto
      }
      return ''
    }
  },

  created () {
    this.$store.dispatch('showMenu', this.$route.params.key)
    // this.$store.dispatch('showMenu', this.$route.params.key).then(() => {
    //   console.log('this.$store.state.showMenu', this.$store.state.showMenu)
    // })
  },

  components: {
    Loader
  }
}
</script>


<style scoped lang='scss'>
  .menu {
    text-align: center;
    
    .menu__mainImage {
      width: 100%;
      max-width: 500px;
      height: auto;
      max-height: 400px;
      object-fit: contain;
    }
  }
</style>
