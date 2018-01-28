<template>
  <header>
    <h1 class="title"> <router-link to="/" >kiszmenu</router-link> </h1>
    <ul class="header__navi">
      <li>
        <router-link to="/menus" :class="{'current' : $route.fullPath === '/menus'}">Menus</router-link>
      </li>
      <li v-if="getUserName">
        <router-link to="/add" :class="{'current' : $route.fullPath === '/add'}">Dodaj</router-link>
      </li>
      <li>
        <router-link to="/todo" :class="{'current' : $route.fullPath === '/todo'}">Lista</router-link>
      </li>
      <li class="header__userName" v-if="getUserName" @click="toggleMoreOptions">
        Witaj, {{ getUserName }}!
        <ul v-if="showMoreUserOptions" class="userOptions">
          <li>
            jeden
          </li>
          <li>
            dwa
          </li>
          <li @mousedown.stop="logoutUser">
            wyloguj
          </li>
        </ul>
      </li>
      <li v-else>
        <router-link to="/login" :class="{'current' : $route.fullPath === '/login'}">Zaloguj</router-link>
      </li>
    </ul>
  </header>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'KiszHeader',
  data () {
    return {
      showMoreUserOptions: false
    }
  },
  computed: {
    ...mapGetters([
      'getUserName'
    ])
  },
  methods: {
    toggleMoreOptions () {
      this.showMoreUserOptions = !this.showMoreUserOptions
    },

    logoutUser () {
      this.$store.dispatch('logoutUser').then((resp) => {
        console.log('resp', resp)
        this.$router.push(`/`)
      }, (err) => {
        console.log('err', err)
      })
    }
  }
}
</script>


<style lang="scss" scoped>
$headerBgColor: #123456;
$white: #fff;
$listItemHeight: 30px;

  header {
      text-align: center;
      background: $headerBgColor;
      color: $white;
  }
  
  .title {
    margin: 0;
    padding: 1rem 0;
    a {
      color: $white;
      text-decoration: none;
    }
  }

  .header__navi {
    list-style-type: none;
    display: flex;
    justify-content: center;
    margin: 0;
    padding: 0 0 1rem;

    li {
      padding: 0 1rem;
      height: $listItemHeight;
      line-height: $listItemHeight;

      &.header__userName {
        position: relative;
      }
    }

    a {
      text-decoration: none;
      color: $white;
    }

    .current {
      color: plum;
    }

    .userOptions {
      position: absolute;
      color: $white;
      background-color: $headerBgColor;
      list-style-type: none;
      margin: 0;
      padding: 0;
      left: 0;
      right: 0;
      z-index: 1;

      li {
        height: $listItemHeight;
        line-height: $listItemHeight;
        border-top: 1px solid $white;
      }
    }
  }
</style>
