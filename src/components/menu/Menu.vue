<template>
  <div class="menu" v-if="$store.state.menuLoaded && componentLoaded">
    <h2> {{ getShowMenu.title }}</h2>
    <!-- <div v-if="currentMenuImage.length > 0" :style="`background-image: url(${currentMenuImage}); width: 100px; height: 100px;`"> -->
    <div v-if="currentMenuImage.length > 0">
      <img class="menu__mainImage"
        :src="currentMenuImage"
        :alt="getShowMenu.title"
      />
    </div>
    <section v-if="$store.state.showMenu.ingredients && $store.state.showMenu.ingredients.length">
      <h3> Ingredients </h3>
      <ol class="menu__ingredients">
        <li v-for="(element, index) in $store.state.showMenu.ingredients" :key="`${element}-${index}`">
          {{ element.text }}
        </li>
      </ol>
    </section>
    <p v-html="getShowMenu.description"></p>
  </div>
  <Loader v-else>
    <h6> ładuję menu </h6>
  </Loader>
</template>

<script>
import { mapGetters } from 'vuex'
import Loader from '../partials/Loader'
import NoPhoto from '../../assets/noPhoto.png'

export default {
  name: 'Menu',
  props: {
    showMenu: {
      type: Object
    }
  },

  data () {
    return {
      componentLoaded: false
    }
  },

  computed: {
    ...mapGetters([
      'getShowMenu'
    ]),

    currentMenuImage () {
      if (this.getShowMenu.title) {
        return this.getShowMenu.imageMedium || this.getShowMenu.image || NoPhoto
      } else {
        return ''
      }
    }
  },

  created () {
    this.$store.dispatch('showMenu', this.$route.params.key).then((resp) => {
      this.componentLoaded = true
    }, (key) => {
      this.$router.push(`/puste_menu/${key}`)
    })
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

    .menu__ingredients {
      list-style-type: none;
      font-size: 14px;
      font-style: italic;
      padding: 0 0 15px;
      border-bottom: 1px solid #eee;
    }
  }
</style>
