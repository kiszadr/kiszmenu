<template>
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
        <div class="menus__menuWrapper menus__menuWrapper--moreMenus">
          <!-- <p class="menus__itemTitle"> pokaż więcej </p> -->
          <img class="menus__addMoreMenusImg" :src="moreMenusButton" />
        </div>
      </li>
    </transition-group>
</template>

<script>
export default {
  name: 'List',
  props: {
    ListItems: {
      type: Array,
      default () {
        return []
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

  .hello {
    text-align: center;
  }
</style>
