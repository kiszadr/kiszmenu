<template>
  <div class="app__menu">
    <h3> Ostatnio dodane2 </h3>
    <ul class="app__menuList">
      <li>
        <label for="menusList"> search input </label>
        <input id="menusList" placeholder="wyszukaj" type="text" name="szukaj" v-model="searchMenu"/>
      </li>
      <li class="app__menuItem" v-for="key in $store.getters.activeMenuGetter"
        :class="{'active' : $route.params.key === key }"
        :key="$store.state.activeMenu[key].title"
        v-if="$store.state.activeMenu[key].title"
        @click="setCurrentMenu(key)"
      >
        {{ $store.state.activeMenu[key].title }}
      </li>
      <li
        v-if="$store.getters.activeMenus.length > $store.state.limit"
        class="app__showAllMenus"
        @click="setLimitedListVisibility"
      >
        {{ $store.state.limitedListVisibility ? 'pokaz wszystkie' : 'zwiń' }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'menuList',
  data () {
    return {
      searchMenu: ''
    }
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
    setLimitedListVisibility () {
      this.$store.dispatch('setLimitedListVisibility')
    }
  }
}
</script>

<style lang="scss">
  $menuItemHeight: 42px;
  $menusBgColor: #aaa;
  $menusBgHoverColor: #123456;
  $white: #fff;

  .app__menu {
    flex: 2;
    background-color: $menusBgColor;

    .app__menuList {
      margin: 0;
      padding: 0;
      list-style-type: none;
    }

    .app__menuItem {
      text-align: left;
      height: $menuItemHeight;
      line-height: $menuItemHeight;
      border-bottom: 1px solid $menusBgHoverColor;
      cursor: pointer;
      padding: 0 1rem;
      white-space: nowrap;

      &:hover,
      &.active { // JS
        background-color: $menusBgHoverColor;
        color: $white;
      }
    }

    .app__showAllMenus {
      height: $menuItemHeight;
      line-height: $menuItemHeight;
      text-align: center;
      cursor: pointer;

      &:hover {
        background-color: $menusBgHoverColor;
        color: $white;
      }
    }
  }

</style>