<template>
  <header>
    <h1 class="title"> kiszmenu </h1>
    <ul v-if="$store.state.loaded">
      <li>
        <router-link to="/add">Go to Add</router-link>
      </li>
      <li>
        <router-link to="/">Home</router-link>
      </li>
      <li>
        <router-link to="/todo">TodoList</router-link>
      </li>
    </ul>
  </header>
</template>

<script>
export default {
  name: 'KiszHeader'
}
</script>


<style lang="scss" scoped>
$headerBgColor: #123456;
$white: #fff;

  header {
      text-align: center;
      background: $headerBgColor;
      color: $white;
  }
  
  .title {
    margin: 0;
    padding: 1rem 0;
  }

  ul {
    list-style-type: none;
    display: flex;
    justify-content: center;
    margin: 0;
    padding: 0 0 1rem;

    li {
      padding: 0 1rem;
    }

    a {
      text-decoration: none;
      color: $white;
    }
  }
</style>
