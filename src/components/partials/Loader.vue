<template>
  <div class="loader__body">
    <img :src="loader" alt="loader"/>
    <slot></slot>
  </div>
</template>

<script>
import LoaderIcon from '../../assets/loader.jpg'

export default {
  name: 'Loader',

  data () {
    return {
      loader: LoaderIcon
    }
  }
}
</script>


<style scoped lang='scss'>

  .loader__body {
    display: flex;
    flex-direction: column;

    img {
      display: block;
      margin: 50px auto 0;
      height: 50px;
      width: 50px;
      animation: loaderRotation 1s infinite linear;
    }

    @keyframes loaderRotation {
      0%  {transform: rotate(0deg);}
      100%{transform: rotate(360deg);}    
    }
  }
</style>
