import { Router } from 'express'
import { randomUUID } from 'crypto'
import db from '../db/database.js'

const router = Router()

// GET /api/todos
router.get('/', (req, res) => {
  const todos = db.prepare('SELECT * FROM todos ORDER BY created_at DESC').all()
  res.json(todos.map(row => ({ ...row, completed: row.completed === 1 })))
})

// POST /api/todos
router.post('/', (req, res) => {
  const { text } = req.body
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'text is required' })
  }
  const todo = {
    id: randomUUID(),
    text: text.trim(),
    completed: 0,
    created_at: Date.now(),
  }
  db.prepare('INSERT INTO todos (id, text, completed, created_at) VALUES (?, ?, ?, ?)').run(
    todo.id, todo.text, todo.completed, todo.created_at
  )
  res.status(201).json({ ...todo, completed: false })
})

// PATCH /api/todos/:id
router.patch('/:id', (req, res) => {
  const { id } = req.params
  const existing = db.prepare('SELECT * FROM todos WHERE id = ?').get(id)
  if (!existing) return res.status(404).json({ error: 'Not found' })

  const text = req.body.text !== undefined ? req.body.text.trim() : existing.text
  const completed = req.body.completed !== undefined ? (req.body.completed ? 1 : 0) : existing.completed

  db.prepare('UPDATE todos SET text = ?, completed = ? WHERE id = ?').run(text, completed, id)
  res.json({ ...existing, text, completed: completed === 1 })
})

// DELETE /api/todos  (clear completed)
router.delete('/', (req, res) => {
  db.prepare('DELETE FROM todos WHERE completed = 1').run()
  res.status(204).end()
})

// DELETE /api/todos/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params
  const result = db.prepare('DELETE FROM todos WHERE id = ?').run(id)
  if (result.changes === 0) return res.status(404).json({ error: 'Not found' })
  res.status(204).end()
})

export default router
