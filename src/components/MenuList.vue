<template>
  <div class="app__menus" >
    <h3> Dostępne menu </h3>
    <ul class="app__menusList"  v-if="$store.state.loaded">
      <li class="app__menusSearch">
        <label for="menusList"></label>
        <input id="menusList" placeholder="wyszukaj" type="text" name="szukaj" v-model="searchMenu"/>
      </li>
      <li class="app__menusItem" v-for="key in $store.getters.activeMenuGetter"
        :class="{'active' : $route.params.key === key }"
        :key="$store.state.activeMenuList[key].title"
        v-if="$store.state.activeMenuList[key].title"
        @click="setCurrentMenu(key)"
      >
        <img class="app__itemImage"
          :src="$store.state.activeMenuList[key].image || emptyImage"
          :alt="'menu image'"
        />
        <p class="app__itemTitle"> {{ $store.state.activeMenuList[key].title }} </p>
      </li>
      <li
        v-if="!getMenusFromFirebase"
        class="app__showAllMenus"
        @click="getMoreMenus"
      >
        pokaż więcej
      </li>
    </ul>
    <Loader v-if="!$store.state.loaded || getMenusFromFirebase">
      <h6> ładuję, proszę czekać </h6>
    </Loader>
  </div>
</template>

<script>
import Loader from './partials/Loader'
import NoPhoto from '../assets/noPhoto.png'

export default {
  name: 'menuList',
  data () {
    return {
      searchMenu: this.$store.state.searchedMenu,
      emptyImage: NoPhoto,
      getMenusFromFirebase: false
    }
  },

  created () {
    this.$store.dispatch('getMenus')
  },

  watch: {
    searchMenu: function (val) {
      this.$store.dispatch('searchMenu', val)
    }
  },

  methods: {
    setCurrentMenu (key) {
      this.$store.dispatch('showMenu', key)
      this.$router.push(`/menu/${key}`)
    },

    getMoreMenus () {
      this.getMenusFromFirebase = true
      this.$store.dispatch('getMoreMenus').then(() => {
        this.getMenusFromFirebase = false
      })
    }
  },
  components: {
    Loader
  }
}
</script>

<style lang="scss">
  $menuItemHeight: 100px;
  $menusBgColor: #aaa;
  $menusBgHoverColor: #123456;
  $white: #fff;

  .app__menus {
    
    .app__menusList {
      margin: 0;
      padding: 0;
      list-style-type: none;
    }

    .app__menusSearch {
      margin-bottom: 1rem;
      display: flex;
      justify-content: center;

      label {
        &:before {
          content: '';
          background: url('https://image.flaticon.com/icons/png/128/149/149852.png');
          height: 30px;
          width: 30px;
          background-repeat: no-repeat;
          display: block;
          background-size: contain;
          transition: all 0.5s;
        }
        &:hover:before{
          // height: 40px;
          // width: 40px;
        }
      }
    }

    .app__menusItem {
      display: flex;
      // text-align: left;
      height: $menuItemHeight;
      line-height: $menuItemHeight;
      border-bottom: 1px solid $menusBgHoverColor;
      cursor: pointer;
      padding: 10px;
      white-space: nowrap;
      box-sizing: border-box;

      &:hover,
      &.active { // JS
        background-color: $menusBgHoverColor;
        color: $white;
      }

      .app__itemImage {
        width: 80px;
        height: 80px;
        object-fit: contain;
      }

      p {
        margin: 0;
        line-height: 100px;
      }

      .app__itemTitle {
        width: 100%;
        text-align: center;
      }
    }

    .app__showAllMenus {
      height: #{$menuItemHeight / 2};
      line-height: #{$menuItemHeight / 2};;
      text-align: center;
      cursor: pointer;

      &:hover {
        background-color: $menusBgHoverColor;
        color: $white;
      }
    }
  }

</style>