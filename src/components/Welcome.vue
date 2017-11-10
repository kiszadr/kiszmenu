<template>
  <div class="hello">
    <h2>{{ msg }}</h2>
    <p> coś o mnie... </p>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to kiszmenu App'
    }
  }

  // created () {
  //   fetch('setValues.php').then((response) => {
  //     // console.log('response', response, response.json(), response.arrayBuffer(), response.blob())
  //     return response.json()
  //   }).then((myBlob) => {
  //   // const objectURL = URL.createObjectURL(myBlob)
  //   // myImage.src = objectURL;
  //     console.log('wellcome setValues resp', myBlob)
  //   })
  // },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

  .hello {
    text-align: center;

    h1, h2 {
      font-weight: normal;
    }

    ul {
      list-style-type: none;
      padding: 0;
    }

    li {
      display: inline-block;
      margin: 0 10px;
    }

    a {
      color: #42b983;
    }
  }
</style>
