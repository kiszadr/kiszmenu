<template>
  <div class="add">
    <h2>Add to menu</h2>
    <input type="text" placeholder="tytul" v-model="title"> </input>
    <textarea
      v-model="message" 
      placeholder="add multiple lines"
    ></textarea>
    <button @click="addToBase"> dodaj obj do firebase </button>
  </div>
</template>

<script>
export default {
  name: 'Add',
  data () {
    return {
      addDescription: '',
      msg: 'Welcome to Your Vue.js App',
      message: '',
      title: ''
    }
  },
  methods: {
    addToBase () {
      const postData = {
        description: this.message,
        title: this.title,
        ingredients: [
          {
            name: 'ziemniaki',
            value: 2.5,
            unit: 'kg'
          }
        ]
      }
      this.$emit('addToFirebase', postData)
      this.message = ''
      this.title = ''
    }
  }
}
</script>


<style scoped lang='scss'>
  .add {
    textarea {
      display: block;
      margin: auto;
      height: 200px;
      width: 400px;
      margin-bottom: 1rem;
    }
  }
</style>
