<template>
  <div class="hello">
    <p> Nie mamy takiego przepisu :( </p>
    <p> <router-link to="/menus" >Wszystkie przepisy</router-link></p>
  </div>
</template>

<script>
export default {
  name: 'BadMenuKey'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

  .hello {
    text-align: center;
  }
</style>