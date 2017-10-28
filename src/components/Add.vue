<template>
  <div class="add">
    <h2>Add to menu</h2>
    <div v-if="error"> {{ error }} </div>
    <label for="addMenuTitle"> Add title </label>
    <input type="text" id="addMenuTitle" placeholder="tytul" v-model="title"/>
    <textarea
      v-model="message" 
      placeholder="add multiple lines"
    ></textarea>
    <section v-if="!image">
      <h3>Select an image</h3>
      <label for="addFileInput"> Add file </label>
      <input type="file" id="addFileInput" @change="onFileChange"/>
    </section>
    <section v-else>
      <img :src="image" />
      <button @click="removeImage">Remove image</button>
    </section>
    <button @click="addToBase"> dodaj obj do firebase </button>
  </div>
</template>

<script>
export default {
  name: 'Add',
  data () {
    return {
      message: '',
      title: '',
      image: '',
      error: ''
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
        ],
        image: this.image
      }
      this.$store.dispatch('addToFirebase', postData).then(() => {
        console.log('receive correct file')
        this.message = ''
        this.title = ''
        this.image = ''
      }, (err) => {
        console.log('rejected received', typeof err, err.toString())
        const error = err.toString()
        if (error.indexOf('10485760 utf8') !== -1) {
          this.error = 'Za duże zdjęcie.'
        } else {
          this.error = error
        }
      })
    },

    onFileChange (e) {
      this.error = ''
      const files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        this.image = ''
        return
      }
      this.createImage(files[0])
    },

    createImage (file) {
      const reader = new FileReader()
      const vm = this

      reader.onload = (e) => {
        vm.image = e.target.result
      }
      reader.readAsDataURL(file)
    },

    removeImage () {
      this.error = ''
      this.image = ''
    }
  }
}
</script>


<style scoped lang='scss'>
  .add {
    textarea {
      display: block;
      height: 200px;
      max-width: 400px;
      width: 100%;
      margin: 1rem auto;
      box-sizing: border-box;
    }

    img {
      width: 200px;
      height: auto;
    }
  }
</style>
