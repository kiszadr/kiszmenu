<template>
  <div class="showMessage">
    <transition name="showMessage__transition">
      <p class="showMessage__text" v-if="confirmMessage.length"> {{ confirmMessage }} </p>
    </transition>
  </div>
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
  $showMessage-correct: green;
  $showMessage-wrong: red;

  .showMessage {
    height: 50px;

    .showMessage__text {
      margin: 0;
      line-height: 50px;
  // todo
      &.correct {
        border: 1px solid $showMessage-correct;
        box-sizing: border-box;
      }

      &.wrong {
        border: 1px solid $showMessage-wrong;
        box-sizing: border-box;
      }
    }
  }

  .showMessage__transition-enter-active, .showMessage__transition-leave-active {
    transition: opacity .5s
  }
  .showMessage__transition-enter, .showMessage__transition-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0
  }
</style>