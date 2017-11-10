<template>
  <div class="wysiwyg">
    <quill-editor
      v-model="content"
      :options="editorOptions"
      @change="wysiwygTextChanged"
      >
    </quill-editor>
  </div>
</template>

<script>
  import { quillEditor } from 'vue-quill-editor'

  export default {
    props: {
      offer: {
        type: Object,
        default: null
      },

      mobileVersion: {
        type: Boolean,
        default: false
      },

      maxchar: {
        type: Number,
        default () {
          return 0
        }
      }
    },

    data: function () {
      return {
        content: '',
        editorOptions: this.getOptions(),
        textDelay: {},
        currentText: ''
      }
    },

    mounted () {
      if (this.offer && this.offer.params && this.offer.params.desc) {
        this.content = this.offer.params.desc
        this.currentText = this.offer.params.desc
      }
    },

    computed: {
      counter () {
        if (this.currentText.length - 1 === 0 || this.currentText.length - 1 > this.maxchar) {
          return true
        }
        return false
      }
    },

    components: {
      quillEditor
    },

    methods: {
      wysiwygTextChanged (content) {
        this.content = content.html
        this.currentText = content.text

        clearTimeout(this.textDelay)
        this.textDelay = setTimeout(() => {
          this.$emit('wysiwygTextChanged', content.html)
        }, 500)
      },

      getOptions () {
        return {
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline'],
              [{'list': 'ordered'}, {'list': 'bullet'}],
              [{'indent': '-1'}, {'indent': '+1'}, {'align': []}],
              ['clean']
            ]
          },
          formats: [
            'bold',
            'italic',
            'underline',
            'header',
            'indent',
            'list',
            'align'
          ],
          placeholder: 'Opis...'
        }
      }
    }
  }
</script>

<style lang="scss">

$wysiwyg-color-5: #aaa;


  .wysiwyg {
    position: relative;
    max-width: 500px;
    width: 100%;
    display: block;
    margin: 0 auto 1rem;
    height: 342px;
    padding: 0 0.5rem;
    box-sizing: border-box;

    label {
      position: absolute;
      top: 0;
      left: 10px;
      font-size: 13px;
      font-weight: 600;
      line-height: 42px;
    }

    .ql-toolbar { // JS
      display: flex;
      justify-content: flex-end;
      // background-color: $wysiwyg-color-5;
      // height: 42px;
    }

    .ql-container {
      // font-family: $font-primary;
      // height: 300px;
    }

    .ql-editor { // JS
      // background-color: plum;
      height: 300px;
    }

    // wysiwyg animation
    .wysiwyg__transition-enter-active {
      transition: opacity 1s;
    }

    .wysiwyg__transition-leave-active {
      transition: opacity 0.5s;
    }

    .wysiwyg__transition-enter,
    .wysiwyg__transition-leave-to {
      opacity: 0;
    }
  }
</style>
