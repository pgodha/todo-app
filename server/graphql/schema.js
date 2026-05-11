import { randomUUID } from 'crypto'
import db from '../db/database.js'

export const typeDefs = `#graphql
  type Todo {
    id: ID!
    text: String!
    completed: Boolean!
    created_at: Float!
  }

  type Query {
    todos: [Todo!]!
  }

  type Mutation {
    addTodo(text: String!): Todo!
    toggleTodo(id: ID!): Todo!
    editTodo(id: ID!, text: String!): Todo!
    deleteTodo(id: ID!): Boolean!
    clearCompleted: Boolean!
  }
`

export const resolvers = {
  Query: {
    todos: () => {
      const rows = db.prepare('SELECT * FROM todos ORDER BY created_at DESC').all()
      return rows.map(row => ({ ...row, completed: row.completed === 1 }))
    },
  },

  Mutation: {
    addTodo: (_, { text }) => {
      const trimmed = text.trim()
      if (!trimmed) throw new Error('text is required')
      const todo = { id: randomUUID(), text: trimmed, completed: 0, created_at: Date.now() }
      db.prepare('INSERT INTO todos (id, text, completed, created_at) VALUES (?, ?, ?, ?)').run(
        todo.id, todo.text, todo.completed, todo.created_at
      )
      return { ...todo, completed: false }
    },

    toggleTodo: (_, { id }) => {
      const existing = db.prepare('SELECT * FROM todos WHERE id = ?').get(id)
      if (!existing) throw new Error('Todo not found')
      const completed = existing.completed === 1 ? 0 : 1
      db.prepare('UPDATE todos SET completed = ? WHERE id = ?').run(completed, id)
      return { ...existing, completed: completed === 1 }
    },

    editTodo: (_, { id, text }) => {
      const trimmed = text.trim()
      const existing = db.prepare('SELECT * FROM todos WHERE id = ?').get(id)
      if (!existing) throw new Error('Todo not found')
      db.prepare('UPDATE todos SET text = ? WHERE id = ?').run(trimmed, id)
      return { ...existing, text: trimmed, completed: existing.completed === 1 }
    },

    deleteTodo: (_, { id }) => {
      const result = db.prepare('DELETE FROM todos WHERE id = ?').run(id)
      if (result.changes === 0) throw new Error('Todo not found')
      return true
    },

    clearCompleted: () => {
      db.prepare('DELETE FROM todos WHERE completed = 1').run()
      return true
    },
  },
}
