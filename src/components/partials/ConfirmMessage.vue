<template>
  <transition name="showMessage">
    <p v-if="confirmMessage.length"> {{ confirmMessage }} </p>
  </transition>
</template>

<script>
export default {
  props: {
    confirmMessage: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
  .showMessage {
    display: block;
  }
</style>