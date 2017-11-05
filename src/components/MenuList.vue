<template>
  <div class="menus" >
    <div class="menus__loading" v-if="!$store.state.loaded || getMenusFromFirebase"></div>
    <h3> Dostępne menu </h3>
    <div class="menus__search">
      <label for="menusList"></label>
      <input id="menusList" placeholder="wyszukaj" type="text" name="szukaj" v-model="searchMenu"/>
    </div>
    <transition-group name="menus__list" class="menus__list" v-if="$store.state.loaded" tag="ul">
      <li class="menus__listItem" v-for="(key, index) in $store.getters.activeMenusGetter"
        :key="key"
        v-if="$store.state.activeMenuList[key].title"
        @click="setCurrentMenu(key)"
        :id="key"
        @mouseenter="mouseEnter(index)"
        @mouseleave="mouseLeave"
      >
        <div class="menus__menuWrapper">
          <div class="menus_menuImageWrapper">
            <img class="menus__itemImage"
              :src="$store.state.activeMenuList[key].imageSmall || $store.state.activeMenuList[key].image || emptyImage"
              :alt="'menu image'"
            />
          </div>
          <transition name="menus__itemTitle">
            <p v-if="currentHoverIndex !== index" class="menus__itemTitle"> {{ $store.state.activeMenuList[key].title }} </p>
          </transition>
        </div>
      </li>
      <li class="menus__listItem"
        :key="'moreMenus'"
        @click="getMoreMenus"
        v-if="$store.getters.showMoreChecker"
      >
        <div class="menus__menuWrapper">
          <p class="menus__itemTitle"> pokaż więcej </p>
          <!-- <img class="menus__addMoreMenusImg" :src="moreMenusButton" /> -->
        </div>
      </li>
    </transition-group>
  </div>
</template>

<script>
import Loader from './partials/Loader'
import NoPhoto from '../assets/noPhoto.png'
import addImg from '../assets/plus.svg'

export default {
  name: 'menuList',
  data () {
    return {
      searchMenu: this.$store.state.searchedMenu,
      emptyImage: NoPhoto,
      getMenusFromFirebase: false,
      moreMenusButton: addImg,
      moreMenusClickCounter: 0,
      currentHoverIndex: -1
    }
  },

  created () {
    if (this.$store.getters.activeMenusGetter.length === 0) {
      this.$store.dispatch('getMenus')
    }
  },

  // mounted () {
    // todo ustawienie ekranu na ostatnio ogladanym id menu
  //   console.log('mounted')
  //   // :class="{'active' : $route.params.key === key }"
  // },

  watch: {
    searchMenu: function (val) {
      this.$store.dispatch('searchMenu', val)
    }
  },

  methods: {
    mouseEnter (index) {
      this.currentHoverIndex = index
    },

    mouseLeave () {
      this.currentHoverIndex = -1
    },

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

  .menus {
    position: relative;

    .menus__loading {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 2;
      background-color: rgba(255, 255, 255, .6);
    }
    
    .menus__list {
      margin: 0 auto;
      padding: 0;
      list-style-type: none;
      display: block;
      max-width: 100%;
      width: 100%;
    }

    .menus__list-enter-active {
      transition: all 1s;
    }
    .menus__list-enter {
      opacity: 0;
      transform: translateY(30px);
    }

    .menus__list-leave-to {
      opacity: 0;
    }
    
    .menus__list-leave-active {
      transition: all 1s;
      opacity: 1;
    }

    .menus__search {
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

    .menus__listItem {
      display: inline-block;;
      height: 300px;
      width: 300px;
      cursor: pointer;
      white-space: nowrap;
      box-sizing: border-box;
      margin: 0.5rem;
      max-width: 100%;
      vertical-align: top;

      // &:hover {
      //   background-color: $menusBgHoverColor;
      //   color: $white;
      // }

      .menus__menuWrapper {
        display: flex;
        height: 100%;
        flex-direction: column;
        padding: 10px;
        box-shadow: 3px 3px 15px $menusBgHoverColor;
        box-sizing: border-box;
      }

      .menus_menuImageWrapper {
        flex: 3;
        overflow: hidden;
        display: flex;
        justify-content: center;
      }

      .menus__itemImage {
        object-fit: cover;
        width: 100%;
        height: 100%;
      }

      .menus__itemTitle {
        width: 100%;
        display: flex;
        white-space: normal;
        max-width: 100%;
        align-items: center;
        justify-content: center;
        flex: 1;
        margin: 0;
      }

      .menus__itemTitle-enter-active,
      .menus__itemTitle-leave-active {
        transition: all .5s ease;
        max-height: 70px;
      }

      .menus__itemTitle-enter, .menus__itemTitle-leave-to {
        max-height: 0px;
        overflow: hidden;
      }
    }
  }

</style>