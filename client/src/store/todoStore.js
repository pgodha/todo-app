import { create } from 'zustand'

const GQL = '/graphql'

async function gql(query, variables = {}) {
  const res = await fetch(GQL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  })
  const json = await res.json()
  if (json.errors) throw new Error(json.errors[0].message)
  return json.data
}

const useTodoStore = create((set, get) => ({
  todos: [],
  loading: true,
  error: null,

  fetchTodos: async () => {
    try {
      const data = await gql(`{ todos { id text completed created_at } }`)
      set({ todos: data.todos, loading: false, error: null })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },

  addTodo: async (text) => {
    const data = await gql(
      `mutation AddTodo($text: String!) { addTodo(text: $text) { id text completed created_at } }`,
      { text }
    )
    set(state => ({ todos: [data.addTodo, ...state.todos] }))
  },

  toggleTodo: async (id) => {
    const data = await gql(
      `mutation ToggleTodo($id: ID!) { toggleTodo(id: $id) { id text completed created_at } }`,
      { id }
    )
    set(state => ({ todos: state.todos.map(t => t.id === id ? data.toggleTodo : t) }))
  },

  editTodo: async (id, text) => {
    const data = await gql(
      `mutation EditTodo($id: ID!, $text: String!) { editTodo(id: $id, text: $text) { id text completed created_at } }`,
      { id, text }
    )
    set(state => ({ todos: state.todos.map(t => t.id === id ? data.editTodo : t) }))
  },

  deleteTodo: async (id) => {
    await gql(
      `mutation DeleteTodo($id: ID!) { deleteTodo(id: $id) }`,
      { id }
    )
    set(state => ({ todos: state.todos.filter(t => t.id !== id) }))
  },

  clearCompleted: async () => {
    await gql(`mutation { clearCompleted }`)
    set(state => ({ todos: state.todos.filter(t => !t.completed) }))
  },
}))

export default useTodoStore
