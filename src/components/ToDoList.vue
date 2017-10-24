<template>
  <div class="todos" style="padding-bottom: 20px;" v-if="$store.state.todosLoaded">
    <ConfirmMessage
      :confirmMessage="confirmMessage"
    >
    </ConfirmMessage>
    <button class="todos__mainButton" @click="editList" v-if="!isEdited"> edit list </button>
    <button class="todos__mainButton" @click="discardChanges" v-else> discard changes </button>
    
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
    
    <button class="todos__mainButton" @click="hideBought" v-if="!isEdited"> hide bought </button>
    <button class="todos__mainButton" @click="clearList" v-if="isEdited"> clear list </button>
    <button class="todos__mainButton" @click="reset" v-if="isEdited"> reset changes </button>
    <button class="todos__mainButton" @click="sendRequest" v-if="isEdited"> send list to server </button>
    <button class="todos__mainButton" @click="showAll" v-if="!isEdited"> show all </button>
    <button class="todos__mainButton" @click="editList" v-if="isEdited"> close edition </button>
  </div>
  <Loader v-else>
    <h3> ładuję listę </h3>
  </Loader>
</template>

<script>
import Vue from 'vue'
import Loader from './partials/Loader'
import ConfirmMessage from './partials/ConfirmMessage'

export default {
  data () {
    return {
      todos_beforeEdit: [],
      todos: [],
      current_todo: [],
      message: '',
      isEdited: false,
      boughtWasHidden: false,
      test: 'tescik',
      confirmMessage: 'gosciu udalo sie!!!!!! :)'
    }
  },

  created () {
    this.$store.dispatch('getTodoList').then((todos) => {
      console.log('todos list', todos)
      let current = []
      for (const todo in todos) {
        console.log('todo in created', todo)
        if (todos[todo] !== '') {
          current.push({
            text: todos[todo],
            bought: false,
            id: todo
          })
        }
      }
      this.todos = [...current]
      this.current_todo = [...current]
    })
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
      if (this.message !== '') {
        this.todos.push({text: this.message, bought: false})
        this.message = ''
      }
    },

    sendRequest () {
      const todoList = []

      for (const todo in this.todos) {
        todoList.push(this.todos[todo].text)
        Vue.set(this.todos[todo], 'id', todo)
      }

      this.$store.dispatch('setTodoList', todoList).then(() => {
        this.current_todo = [...this.todos]
        this.confirmMessage = 'Zapisane'
        setTimeout(() => {
          this.confirmMessage = ''
        }, 2000)
      }, () => {
        this.confirmMessage = 'Nie udało się. Spróbuj ponownie'
      })
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
  },

  components: {
    Loader,
    ConfirmMessage
  }
}
</script>

<style lang="scss" scoped>
  .todos {
    .bought{
      text-decoration: line-through;
    }
  }
</style>
