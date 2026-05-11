import { useState, useEffect } from 'react'
import useTodoStore from './store/todoStore'
import TodoInput from './components/TodoInput'
import TodoList from './components/TodoList'
import TodoFilter from './components/TodoFilter'
import './App.css'

const FILTERS = { ALL: 'all', ACTIVE: 'active', COMPLETED: 'completed' }

export default function App() {
  const { todos, loading, error, fetchTodos, addTodo, toggleTodo, editTodo, deleteTodo, clearCompleted } = useTodoStore()
  const [filter, setFilter] = useState(FILTERS.ALL)

  useEffect(() => { fetchTodos() }, [fetchTodos])

  const filtered = todos.filter(todo => {
    if (filter === FILTERS.ACTIVE) return !todo.completed
    if (filter === FILTERS.COMPLETED) return todo.completed
    return true
  })

  const activeCount = todos.filter(t => !t.completed).length

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>Todo</h1>
        </header>

        <TodoInput onAdd={addTodo} />

        {error && <p className="error-banner">Error: {error}</p>}

        <div className="card">
          {loading ? (
            <p className="loading">Loading...</p>
          ) : (
            <TodoList
              todos={filtered}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
            />
          )}

          {todos.length > 0 && (
            <div className="footer">
              <span className="count">{activeCount} item{activeCount !== 1 ? 's' : ''} left</span>
              <TodoFilter current={filter} onChange={setFilter} filters={FILTERS} />
              <button className="clear-btn" onClick={clearCompleted}>
                Clear completed
              </button>
            </div>
          )}
        </div>

        {!loading && todos.length === 0 && (
          <p className="empty-hint">Add your first task above</p>
        )}
      </div>
    </div>
  )
}
