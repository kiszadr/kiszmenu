<template>
  <div class="vue-wrapper" id="vue-elements" style="padding-bottom: 20px;"> 
    <button class="w3-btn w3-margin-bottom width100" id="button-editList" @click="editList" v-if="!isEdited"> edit list </button>
    <button class="w3-btn w3-margin-bottom width100" id="button-editList" @click="discardChanges" v-else> discard changes </button>
    
    <ol v-if="!isEdited">
      <li
        v-for="(current_todo, index) in current_todo"
        @click.self="markAsBought(index, current_todo.id, current_todo.bought)"
        :class="{ bought: current_todo.bought }"
        :key="`${current_todo}-${index}`"
        >
        {{ current_todo.text }}
      </li>
    </ol>
    <ol v-else>
      <li v-for="(todo, index) in todos" :key="`${todo}-${index}`">
        {{ todo.text }}
        <button @click="removeFromList(todo)"> remove </button>
        <button @click="moveUp(index)" v-if="index > 0"> up </button>
        <button @click="moveDown(index)" v-if="index < todos.length - 1"> down </button>
      </li>
    </ol>
      
    <input placeholder="put the value" style="margin-bottom: 20px; outline:none;" class="w3-input" v-model="message" v-on:keyup.enter="addToTodolist" v-if="isEdited">
    
    <button class="w3-btn w3-margin-bottom width100" @click="hideBought" v-if="!isEdited"> hide bought </button>
    <button class="w3-btn w3-margin-bottom width100" @click="clearList" v-if="isEdited"> clear list </button>
    <button class="w3-btn w3-margin-bottom width100" @click="reset" v-if="isEdited"> reset changes </button>
    <button class="w3-btn w3-margin-bottom width100" @click="sendRequest" v-if="isEdited"> send list to server </button>
    <button class="w3-btn w3-margin-bottom width100" @click="showAll" v-if="!isEdited"> show all </button>
    <button class="w3-btn w3-margin-bottom width100" @click="editList" v-if="isEdited"> close edition </button>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  props: {
    propsTodos: {
      type: Array,
      default: [
        {
          text: 'jaja2',
          bought: false,
          id: 0
        },
        {
          text: 'mleko2',
          bought: false,
          id: 1
        },
        {
          text: 'wedliny2',
          bought: false,
          id: 2
        }
      ]
    }
  },

  data () {
    return {
      todos_beforeEdit: [],
      todos: [...this.propsTodos],
      current_todo: [...this.propsTodos],
      message: '',
      isEdited: false,
      boughtWasHidden: false,
      test: 'tescik'
    }
  },
  methods: {
    editList () {
      this.isEdited = !this.isEdited
      if (this.isEdited) {
        this.showAll()
        this.todos_beforeEdit = [...this.todos]
      } else {
        if (this.message !== '') {
          this.addToTodolist()
        }
        this.sendRequest()
        if (this.boughtWasHidden) {
          this.hideBought()
        }
      }
    },

    discardChanges () {
      this.reset()
      this.isEdited = false
      if (this.boughtWasHidden) {
        this.hideBought()
      }
    },

    clearList () {
      this.todos = []
    },

    removeFromList (toRemove) {
      this.todos = [...this.todos.filter((todo) => todo.text !== toRemove.text)]
    },

    reset () {
      this.todos = [...this.todos_beforeEdit]
    },

    addToTodolist () {
      this.todos.push({text: this.message, bought: false})
      this.message = ''
    },

    sendRequest () {
      let todoList = []
      // const self = this

      for (let i = 0, l = this.todos.length; i < l; i += 1) {
        todoList[i] = this.todos[i].text
      }
      // $.post('setValues.php',
      //   {
      //     current: todoList
      //   },
      //   (data, status) => {
      //     if (status === 'success') {
      //       alert('udało się :)')
      //       self.current_todo = [...self.todos]
      //     } else {
      //       alert('błąd, spróbuj ponownie.')
      //     }
      //   }
      // )
    },

    markAsBought (index, id, bought) {
      console.log(index, id, bought)
      if (!this.isEdited) {
        Vue.set(this.todos[id], 'bought', !bought)
        Vue.set(this.current_todo[index], 'bought', !bought)
      }
    },

    showAll () {
      if (!this.isEdited) {
        this.boughtWasHidden = false
      }
      this.current_todo = [...this.todos]
    },

    hideBought () {
      this.boughtWasHidden = true
      this.current_todo = this.todos.filter(value => !value.bought)
    },
    moveUp (index) {
      let current = [this.todos[index]]
      let previous = [this.todos[index - 1]]
      this.todos = this.todos.slice(0, index - 1).concat(current).concat(previous).concat(this.todos.slice(index + 1))
    },
    moveDown (index) {
      let current = [this.todos[index]]
      let next = [this.todos[index + 1]]
      this.todos = this.todos.slice(0, index).concat(next).concat(current).concat(this.todos.slice(index + 2))
    }
  }
}
</script>

<style lang="scss" scoped>
  .bought{
		text-decoration: line-through;
	}
</style>
