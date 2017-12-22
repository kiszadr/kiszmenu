<template>
  <div class="todos" v-if="$store.state.todosLoaded">
    <ConfirmMessage
      :confirmMessage="confirmMessage"
    >
    </ConfirmMessage>
    <div class="todos__buttons">
      <button class="todos__mainButton" @click="editList" v-if="!isEdited"> edit list </button>
      <button class="todos__mainButton" @click="discardChanges" v-else> discard changes </button>
      <button class="todos__mainButton" @click="hideBought" v-if="!isEdited"> hide bought </button>
      <button class="todos__mainButton" @click="showAll" v-if="!isEdited"> show all </button>
    </div>
    <ol class="todos__list" v-if="!isEdited">
      <li
        class="todos__item"
        v-for="(todo, index) in current_todo"
        @click.self="markAsBought(index, todo.id, todo.bought)"
        :class="{ bought: todo.bought }"
        :key="`${todo}-${index}`"
        >
        <!-- {{ `${index + 1}. ${todo.text}` }} -->
        {{ current_todo.length ? todo.text : 'lista jest pusta' }}  
      </li>
      <li v-if="current_todo.length === 0">
        lista jest pusta 
      </li>
    </ol>
    <ol v-else class="todos__list edit">
      <li
        class="todos__item"
        v-for="(todo, index) in todos" 
        :key="`${todo}-${index}`"
      >
        {{ todo.text }}
        <button @click="removeFromList(todo)"> remove </button>
        <button @click="moveUp(index)" v-if="index > 0"> up </button>
        <button @click="moveDown(index)" v-if="index < todos.length - 1"> down </button>
      </li>
    </ol>
    <input placeholder="put the value" style="margin: 20px 0; outline:none;" class="w3-input" v-model="message" v-on:keyup.enter="addToTodolist" v-if="isEdited">
    <div class="todos__buttons">
      <button class="todos__mainButton" @click="addToTodolist" v-if="isEdited"> add to list </button>
      <button class="todos__mainButton" @click="hideBought" v-if="!isEdited"> hide bought </button>
      <button class="todos__mainButton" @click="clearList" v-if="isEdited"> clear list </button>
      <button class="todos__mainButton" @click="reset" v-if="isEdited"> reset changes </button>
      <button class="todos__mainButton" @click="sendRequest" v-if="isEdited"> send list to server </button>
      <button class="todos__mainButton" @click="showAll" v-if="!isEdited"> show all </button>
      <button class="todos__mainButton" @click="editList" v-if="isEdited"> close edition </button>
    </div>
  </div>
  <Loader v-else>
    <h6> ładuję listę </h6>
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
      confirmMessage: ''
    }
  },

  created () {
    this.$store.dispatch('getTodoList').then((todos) => {
      let current = []
      for (const todo in todos) {
        if (todos[todo] !== '') {
          current.push({
            text: todos[todo],
            bought: false,
            id: todo
          })
        }
      }

      // @todo current_todo zastapic na this.$store.state.todos
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
  $todo-main-1: #123456;
  $todo-main-2: #c2c2c2;
  $todo-text-hover: #fff;
  $todo-font-size: 32px;

  .todos {
    // max-width: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;
    text-align: center;

    .todos__buttons {
      display: block;
      margin-top: 1rem;
    }

    // got from w3 stylesheet
    .todos__mainButton {
      border: none;
      display: inline-block;
      outline: 0;
      padding: 6px 16px;
      vertical-align: middle;
      overflow: hidden;
      text-decoration: none!important;
      color: #fff;
      background-color: #000;
      text-align: center;
      cursor: pointer;
      white-space: nowrap;
      user-select: none;
      transition: background-color .25s,color .15s,box-shadow .15s,opacity .25s,filter .25s,border .15s;
      -webkit-appearance: button;
      text-transform: none;
      margin: 0 0 1rem;
    }

    .todos__list {
      position: relative;
      min-width: 300px;
      max-width: 100%;
      width: 500px;
      margin: 0 auto;
      padding: 25px;
      box-sizing: border-box;
      background-color: #fff;
      -webkit-box-shadow: 0 0 4px rgba(0, 0, 0, 0.2), inset 0 0 50px rgba(0, 0, 0, 0.1);
      -moz-box-shadow: 0 0 4px rgba(0, 0, 0, 0.2), inset 0 0 50px rgba(0, 0, 0, 0.1);
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.2), inset 0 0 50px rgba(0, 0, 0, 0.1);
      max-width: 90%;
      user-select: none;
      list-style-type: none;

      &:before, &:after {
        position: absolute;
				width: 40%;
				height: 10px;
				content: ' ';
				left: 12px;
				bottom: 12px;
				background: transparent;
				-webkit-transform: skew(-5deg) rotate(-5deg);
				-moz-transform: skew(-5deg) rotate(-5deg);
				-ms-transform: skew(-5deg) rotate(-5deg);
				-o-transform: skew(-5deg) rotate(-5deg);
				transform: skew(-5deg) rotate(-5deg);
				-webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
				-moz-box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
				box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
				z-index: -1;
      }

      &:after {
				left: auto;
				right: 12px;
				-webkit-transform: skew(5deg) rotate(5deg);
				-moz-transform: skew(5deg) rotate(5deg);
				-ms-transform: skew(5deg) rotate(5deg);
				-o-transform: skew(5deg) rotate(5deg);
				transform: skew(5deg) rotate(5deg);
			}

      .todos__item {
        cursor: pointer;
        font-style: italic;
        min-height: $todo-font-size;
        min-width: 150px;
        max-width: 100%;
        line-height: $todo-font-size;
        border-bottom: 1px solid $todo-main-2;
      }
    }
    .bought { //JS
      text-decoration: line-through;
    }
  }
</style>
