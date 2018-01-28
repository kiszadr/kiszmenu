<template>
  <div id="app">
    <KiszHeader>
    </KiszHeader>
    <!-- <Firebase>
    </Firebase> -->
    <div class="app__body">
      <div class="app__router">
        <router-view>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script>
import KiszHeader from './KiszHeader'
// import Firebase from './components/Firebase'

export default {
  name: 'app',
  components: {
    KiszHeader
    //, Firebase
  }
}
</script>

<style lang='scss'>
@import url('https://fonts.googleapis.com/css?family=Milonga');

@font-face {
  font-family: myFirstFont;
  src: url(https://fonts.gstatic.com/s/milonga/v5/hwluam44b9JfoHvBi4IlqA.woff2);
}

@font-face {
  font-family: myFirstFont;
  src: url(https://fonts.gstatic.com/s/milonga/v5/FylG2WIUALMAaF22K8PzQfY6323mHUZFJMgTvxaG2iE.woff2);
}

#app {
  font: 400 1rem 'myFirstFont', Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
  
  .app__body {
    max-width: 1000px;
    margin: auto;
  }
}
</style>
