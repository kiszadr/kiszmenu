<template>
  <div class="hello">
    <p> login </p>

    <button @click="signIn('Google')"> Google </button>
    <button @click="signIn('Facebook')"> Facebook </button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Login',

  computed: {
    ...mapGetters([
      'getUserName'
    ])
  },

  methods: {
    signIn (provider) {
      this.$store.dispatch(`signInBy${provider}`).then(() => {
        this.$router.push(`/`)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

  .hello {
    text-align: center;

    h1, h2 {
      font-weight: normal;
    }

    ul {
      list-style-type: none;
      padding: 0;
    }

    li {
      display: inline-block;
      margin: 0 10px;
    }

    a {
      color: #42b983;
    }
  }
</style>
