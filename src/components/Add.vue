<template>
  <div class="add">
    <div class="add__loading" v-if="loading"></div>
    <h2>Add to menu</h2>
    <label for="addMenuTitle"> Add title </label>
    <input type="text" id="addMenuTitle" placeholder="tytul" v-model="title"/>
    <textarea
      v-model="message" 
      placeholder="add multiple lines"
    ></textarea>
    <section v-if="!image">
      <h6>Select an image, only JPG, JPEG, PNG & GIF files are allowed.</h6>
      <div v-if="error"> {{ error }} </div>
      <label for="addFileInput"> Add file </label>
      <input type="file" id="addFileInput" @change="onFileChange"/>
    </section>
    <section v-else>
      <img :src="image" />
      <button @click="removeImage">Remove image</button>
    </section>
    <button @click="addToBase" type="button"> dodaj obj do firebase </button>
  </div>
</template>

<script>
const FormData = require('form-data')

export default {
  name: 'Add',
  data () {
    return {
      message: '',
      title: '',
      image: '',
      error: '',
      files: [],
      newMenuKey: '',
      loading: false
    }
  },
  methods: {
    addToBase () {
      if (this.validateAdd()) {
        this.loading = true
        let postData = {
          description: this.message,
          title: this.title,
          ingredients: [
            {
              name: 'ziemniaki',
              value: 2.5,
              unit: 'kg'
            }
          ],
          image: this.image,
          created: new Date().getTime(),
          author: this.$store.state.user
        }

        this.$store.dispatch('addToFirebase', postData).then((status) => {
          if (status.key) {
            if (this.files && this.files[0]) {
              this.sendFileToServer(status.key).then((resp) => {
                if (resp.status === 200) {
                  postData.image = resp.image
                  postData.imageSmall = resp.imageSmall
                  const firebaseChild = {
                    key: status.key,
                    menu: postData
                  }
                  this.$store.dispatch('updateFirebaseChild', firebaseChild).then(() => {
                    this.clearAddForm()
                  }, () => {
                    this.loading = false
                    this.error = 'Error due to upload.'
                  })
                } else {
                  this.clearAddForm()
                }
              })
            } else {
              this.clearAddForm()
            }
          }
        }, () => {
          // const error = err.toString()
          this.loading = false
          this.error = 'Add is not allowed. Connection error. Please refresh page.'
        })
      } else {
        this.loading = false
        this.error = 'Required fields are missing.'
      }
    },

    sendFileToServer (menuId) {
      return new Promise((resolve, reject) => {
        let form = new FormData()
        form.append('fileToUpload', this.files[0])
        form.append('customName', menuId || 'wielki_test.jpg')
        const post = {
          method: 'POST',
          body: form
        }
        fetch('upload.php', post).then((response) => {
          return response.json()
        }).then((myBlob) => {
          resolve(myBlob)
        })
      })
    },

    validateAdd () {
      if (this.error === '' && this.title !== '') {
        return true
      }
      return false
    },

    clearAddForm () {
      this.message = ''
      this.title = ''
      this.image = ''
      this.loading = false
    },

    onFileChange (e) {
      this.error = ''
      this.files = e.target.files || e.dataTransfer.files
      if (!this.files.length) {
        this.image = ''
        this.error = 'Wrong picture. Max size is 5MB.'
        return
      }

      if (this.files[0].size < 5347738) {
        this.createImage(this.files[0])
      } else {
        this.error = 'Wrong picture. Max size is 5MB.'
      }
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
    position: relative;

    .add__loading {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 2;
      background-color: rgba(255, 255, 255, .6);
    }
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
