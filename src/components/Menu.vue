<template>
  <div class="add">
    <h2> {{ currentMenuTitle }}</h2>
    <div v-if="currentMenuImage.length > 0">
      <img
        :src="currentMenuImage"
        :alt="currentMenuTitle"
      />
    </div>
    <p> {{ currentMenuDescription }} </p>
  </div>
</template>

<script>
export default {
  name: 'Add',
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
      // const emptyImage = 'https://wallpaperscraft.com/image/bread_vegetables_meat_food_70203_1920x1080.jpg'
      return this.$store.state.showMenu.image ? this.$store.state.showMenu.image : ''
    }
  },

  data () {
    return {

    }
  },
  created () {
    this.$store.dispatch('showMenu', this.$route.params.key)
  }
}
</script>


<style scoped lang='scss'>
  .add {
    img {
      width: 100%;
      max-width: 500px;
      height: auto;
    }
  }
</style>
