<template>
  <header>
    <h1 class="title"> kiszmenu </h1>
    <ul>
      <li>
        <router-link to="/add">Go to Add</router-link>
      </li>
      <li>
        <router-link to="/">Home</router-link>
      </li>
    </ul>
  </header>
</template>

<script>



</script>


<style lang="scss" scoped>
  header {
      text-align: center;
      background: plum;
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
  }
</style>
