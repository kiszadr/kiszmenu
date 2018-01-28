<template>
  <div class="add">
    <div class="add__loading" v-if="loading"></div>
    <h2 class="add__sectionTitle">Add to menu</h2>
    <ConfirmMessage
      :confirmMessage="confirmMessage"
    >
    </ConfirmMessage>
    <div class="add__title">
      <label class="add__titleLabel" for="addMenuTitle"> Add title </label>
      <input class="add__titleInput" type="text" id="addMenuTitle" placeholder="tytul" v-model="title"/>
    </div>
    <Wysiwyg
      @wysiwygTextChanged="wysiwygTextChanged"
    >
    </Wysiwyg>
    <section class="add__products">
      <h3>Lista produktów.</h3>
      <ol class="add__productList">
        <li
          class="add__item"
          v-for="(product, index) in products"
          :class="{'drag' : dragIndex === index}"
          :key="`${product}-${index}`"
        >
          <div class="add__itemWrapper">
            <p
              :id="index"
              draggable="true"
              @drag="startDragging($event, index)"
              @dragover="dragOver"
              @drop="stopDragging"
            > {{ index + 1 }}. {{ product.text }} </p>
            <div class="add__productsButtons">
              <img :src="upArrow" class="add__productsImages" @click="moveUp(index)" v-if="index > 0"/>
              <img :src="downArrow" class="add__productsImages" @click="moveDown(index)" v-if="index < products.length - 1"/>
              <img :src="trash" class="add__productsImages" @click="removeFromList(index)"/>
            </div>
          </div>
        </li>
      </ol>
      <div>
        <input placeholder="dodaj produkt" style="margin-bottom: 20px; outline:none;" v-model="productInput" v-on:keyup.enter="addToProductsList">
        <img :src="plusIcon" class="add__addProductButton" @click="addToProductsList"/>
      </div>
    </section>
    <section v-if="!image" class="add__imageSection">
      <h3> Add image </h3>
      <h6>Select an image, only JPG, JPEG, PNG & GIF files are allowed.</h6>
      <div v-if="error"> {{ error }} </div>
      <label for="addFileInput"> Add file </label>
      <input type="file" id="addFileInput" @change="onFileChange"/>
    </section>
    <section v-else class="add__imageSection">
      <h3> Menu image </h3>
      <img class="add__galeryImage" :src="image" />
      <button @click="removeImage" class="add__removeButton">Remove image</button>
    </section>
    <button @click="addToBase" type="button" class="add__addButton"> dodaj obj do firebase </button>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import ConfirmMessage from './partials/ConfirmMessage'
import Wysiwyg from './Wysiwyg'
import UpArrow from '../assets/arrow-up.svg'
import DownArrow from '../assets/arrow-down.svg'
import Trash from '../assets/cross.svg'
import Plus from '../assets/plus_123456.svg'
const FormData = require('form-data')
// let currentDragElement = -1

export default {
  name: 'Add',
  data () {
    return {
      upArrow: UpArrow,
      downArrow: DownArrow,
      trash: Trash,
      plusIcon: Plus,
      message: '',
      title: '',
      image: '',
      error: '',
      files: [],
      newMenuKey: '',
      loading: false,
      loadingImageToPreview: false,
      confirmMessage: '',
      productInput: '',
      products: [
        {text: 'skladnik 1'},
        {text: 'skladnik 2'},
        {text: 'skladnik 3'},
        {text: 'skladnik 4'},
        {text: 'skladnik 5'},
        {text: 'skladnik 6'}
      ],
      dragIndex: -1,
      isDragging: false
      // currentDragElementVue: -1
    }
  },

  computed: {
    ...mapGetters([
      'getUserEmail'
    ])
  },

  methods: {
    // dragging
    startDragging (e, index) {
      this.dragIndex = index
      this.isDragging = true
      // this.currentDragElementVue = index
      // currentDragElement = index
    },

    dragOver (e) {
      e.preventDefault()
      // const targetId = parseInt(e.target.id, 10)
      // console.log('over0000', targetId, currentDragElement, this.currentDragElementVue)
      // if (currentDragElement !== targetId) {
      //   console.log('over11111', targetId, currentDragElement, this.currentDragElementVue)
      //   // this.setCurrentOrder(currentDragElement, targetId)
      //   this.setCurrentOrder(targetId, currentDragElement)
      //   this.dragIndex = targetId
      //   currentDragElement = targetId
      //   // this.currentDragElementVue = targetId
      //   Vue.set(this, 'currentDragElementVue', targetId)
      //   console.log('over2222', targetId, currentDragElement, this.currentDragElementVue)
      // }
      // if (this.dragIndex !== targetId) {
      //   console.log('inny indeks')
      //   const fakeEvent = new Event('fakeEvent', { detail: targetId })
      //   targetElement.dispatchEvent(event);
      //   this.stopDragging(fakeEvent)
      //   this.startDragging(targetId)
      // }
    },

    stopDragging (e) {
      e.preventDefault()
      const targetId = parseInt(e.target.id, 10)

      if (targetId !== this.dragIndex && this.isDragging) {
        this.setCurrentOrder(this.dragIndex, targetId)
      }
      this.isDragging = false
      this.dragIndex = -1
      // currentDragElement = -1
    },

    setCurrentOrder (dragIndex, targetId) {
      const buffor = this.products[dragIndex]
      this.products.splice(dragIndex, 1)
      this.products.splice(targetId, 0, buffor)
    },
  // end dragging

  // products list
    addToProductsList () {
      if (this.productInput !== '') {
        this.products.push({text: this.productInput})
        this.productInput = ''
      }
    },

    removeFromList (index) {
      Vue.delete(this.products, index)
    },

    moveUp (index) {
      let current = [this.products[index]]
      let previous = [this.products[index - 1]]
      this.products = this.products.slice(0, index - 1).concat(current).concat(previous).concat(this.products.slice(index + 1))
    },

    moveDown (index) {
      let current = [this.products[index]]
      let next = [this.products[index + 1]]
      this.products = this.products.slice(0, index).concat(next).concat(current).concat(this.products.slice(index + 2))
    },

    createEmptyMenu () {
      return {
        description: this.message,
        title: this.title,
        ingredients: this.products,
        image: this.image,
        created: new Date().getTime(),
        author: this.getUserEmail
      }
    },

    addToBase () {
      if (this.validateAdd()) {
        this.loading = true
        let postData = this.createEmptyMenu()

        this.$store.dispatch('addToFirebase', postData).then((status) => {
          if (status.key) {
            if (this.files && this.files[0]) {
              this.sendFileToServer(status.key).then((resp) => {
                if (resp.status === 200) {
                  this.clearAddForm()
                  postData.image = resp.image
                  postData.imageSmall = resp.imageSmall
                  postData.imageMedium = resp.imageMedium
                  const firebaseChild = {
                    key: status.key,
                    menu: postData
                  }
                  this.$store.dispatch('updateFirebaseChild', firebaseChild).then(() => {
                    this.confirmMessage = 'Completed.'
                    setTimeout(() => {
                      this.confirmMessage = ''
                    }, 2000)
                  }, () => {
                    this.loading = false
                    this.error = 'Error due to upload.'
                  })
                } else {
                  this.clearAddForm()
                }
              }, (err) => {
                this.loading = false
                this.error = err
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
          return response.text()
        }).then((myBlob) => {
          let request = {}
          try {
            request = JSON.parse(myBlob)
          } catch (err) {
            request.status = 300
            request.text = err
          }

          if (request.status === 200) {
            resolve(request)
          } else {
            reject(request.text)
          }
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
        this.loadingImageToPreview = true
        this.createImage(this.files[0])
      } else {
        this.error = 'Wrong picture. Max size is 5MB.'
      }
    },

    createImage (file) {
      const reader = new FileReader()
      // const vm = this

      reader.onload = (e) => {
        this.image = e.target.result
        this.loadingImageToPreview = false
      }
      reader.readAsDataURL(file)
    },

    removeImage () {
      this.error = ''
      this.image = ''
    },

    wysiwygTextChanged (msg) {
      this.message = msg
    }
  },

  components: {
    ConfirmMessage,
    Wysiwyg
  }
}
</script>


<style scoped lang='scss'>
  $gutter-padding: 0.5rem;
  $gutter-padding-medium: 1rem;
  $gutter-padding-big: 2rem;

  .add {
    position: relative;
    max-width: 500px;
    margin: auto;

    .add__sectionTitle {
      text-align: center;
    }

    .add__title {
      margin-bottom: $gutter-padding-medium;
      padding: 0 $gutter-padding;

      .add__titleLabel {
        display: block;
        font-size: 0.8rem;
      }

      .add__titleInput {
        width: 100%;
        height: $gutter-padding-big;
        line-height: $gutter-padding-big;
        padding: 0 $gutter-padding;
        box-sizing: border-box;
      }
    }

    .add__loading {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 2;
      background-color: rgba(255, 255, 255, .6);
    }

    .add__products {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: $gutter-padding;
    }

    .add__productList {
      width: 100%;
      padding: 0;

      .add__item {
        height: 42px;
        line-height: 42px;
        display: block;
        user-select: none;

        .add__itemWrapper {
          display: flex;
          justify-content: space-between;
        }

        p {
          display: inline-block;
          margin: 0;
        }

        .add__productsButtons {
          display: block;
        }


        &.drag {
          opacity: 0.5;
        }
      }
    }

    .add__productsImages,
    .add__addProductButton {
      padding: 8px;
      width: 20px;
      height: 20px;
      vertical-align: middle;
      cursor: pointer;
    }

    .add__galeryImage {
      width: 200px;
      height: auto;
    }

    .add__imageSection {
      margin-bottom: $gutter-padding-big;
      text-align: center;
    }

    .add__addButton {
      width: 200px;
      height: 42px;
      display: block;
      margin: 0 auto $gutter-padding-big;
    }
  }
</style>
