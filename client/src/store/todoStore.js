import { create } from 'zustand'

const API = '/api/todos'

const useTodoStore = create((set, get) => ({
  todos: [],
  loading: true,
  error: null,

  fetchTodos: async () => {
    try {
      const res = await fetch(API)
      if (!res.ok) throw new Error('Failed to fetch todos')
      set({ todos: await res.json(), loading: false, error: null })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },

  addTodo: async (text) => {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
    if (!res.ok) throw new Error('Failed to add todo')
    const created = await res.json()
    set(state => ({ todos: [created, ...state.todos] }))
  },

  toggleTodo: async (id) => {
    const todo = get().todos.find(t => t.id === id)
    const res = await fetch(`${API}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !todo.completed }),
    })
    if (!res.ok) throw new Error('Failed to update todo')
    const updated = await res.json()
    set(state => ({ todos: state.todos.map(t => t.id === id ? updated : t) }))
  },

  editTodo: async (id, text) => {
    const res = await fetch(`${API}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
    if (!res.ok) throw new Error('Failed to edit todo')
    const updated = await res.json()
    set(state => ({ todos: state.todos.map(t => t.id === id ? updated : t) }))
  },

  deleteTodo: async (id) => {
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete todo')
    set(state => ({ todos: state.todos.filter(t => t.id !== id) }))
  },

  clearCompleted: async () => {
    const res = await fetch(API, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to clear completed')
    set(state => ({ todos: state.todos.filter(t => !t.completed) }))
  },
}))

export default useTodoStore
