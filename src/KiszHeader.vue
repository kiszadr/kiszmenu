<template>
  <header>
    <h1 class="title"> <router-link to="/" >kiszmenu</router-link> </h1>
    <ul class="header__navi">
      <li class="header__naviItem">
        <router-link to="/menus" :class="{'current' : $route.fullPath === '/menus'}">Menus</router-link>
      </li>
      <li v-if="getUserName" class="header__naviItem">
        <router-link to="/add" :class="{'current' : $route.fullPath === '/add'}">Dodaj</router-link>
      </li>
      <li class="header__naviItem">
        <router-link to="/todo" :class="{'current' : $route.fullPath === '/todo'}">Lista</router-link>
      </li>
      <li class="header__naviItem header__dropdown" v-if="getUserName" @click="toggleMoreOptions">
        Witaj, {{ getUserName }}!
        <ul v-if="showMoreUserOptions" class="userOptions">
          <li>
            <router-link to="/private" >Moje przepisy</router-link>
          </li>
          <li>
            <router-link to="/user" >Moje konto</router-link>
          </li>
          <li @mousedown.stop="signOut">
            wyloguj
          </li>
        </ul>
      </li>
      <li class="header__naviItem header__dropdown" v-else @click="toggleLoginOptions">
        Zaloguj
        <ul v-if="showLoginOptions" class="userOptions">
          <li @mousedown.stop="signIn('Google')">
            Google
          </li>
          <li @mousedown.stop="signIn('Facebook')">
            Facebook
          </li>
          <li>
            costam
          </li>
        </ul>
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
      showMoreUserOptions: false,
      showLoginOptions: false
    }
  },
  computed: {
    ...mapGetters([
      'getUserName'
    ])
  },
  methods: {
    toggleLoginOptions () {
      this.showLoginOptions = !this.showLoginOptions
    },

    toggleMoreOptions () {
      this.showMoreUserOptions = !this.showMoreUserOptions
    },

    signIn (provider) {
      this.$store.dispatch('signIn', provider).then(() => {
        if (this.$router.history.current.name === 'Logout') {
          this.$router.push(`/`)
        }
      }, () => {
        console.error('nie udalo sie zalogowac')
      })
    },

    signOut () {
      this.$store.dispatch('signOut').then((resp) => {
        this.$router.push(`/logout`)
      }, (err) => {
        console.error('err', err)
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

    .header__naviItem {
      padding: 0 1rem;
      height: $listItemHeight;
      line-height: $listItemHeight;

      &.header__dropdown {
        cursor: pointer;
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
