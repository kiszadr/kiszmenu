<template>
  <div class="hello">
    <p v-if="isLoggedOut"> Wylogowano </p>
    <p v-else> Wylogowanie nie powiodło się </p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Logout',
  data () {
    return {
      isLoggedOut: true
    }
  },
  created () {
    if (this.getUserName) {
      this.$store.dispatch('signOut').then((resp) => {
        this.isLoggedOut = true
      }, () => {
        this.isLoggedOut = false
      })
    }
  },
  computed: {
    ...mapGetters([
      'getUserName'
    ])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

  .hello {
    text-align: center;
  }
</style>