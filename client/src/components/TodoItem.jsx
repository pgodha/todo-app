import { useState, useRef, useEffect } from 'react'

export default function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(todo.text)
  const inputRef = useRef(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  function handleEditSubmit(e) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) {
      onDelete(todo.id)
    } else {
      onEdit(todo.id, trimmed)
    }
    setEditing(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      setValue(todo.text)
      setEditing(false)
    }
  }

  return (
    <li className={`todo-item${todo.completed ? ' completed' : ''}`}>
      <button
        className="check-btn"
        onClick={() => onToggle(todo.id)}
        aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        <span className="check-circle">
          {todo.completed && (
            <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
              <path d="M1 5l3.5 3.5L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
      </button>

      {editing ? (
        <form className="edit-form" onSubmit={handleEditSubmit}>
          <input
            ref={inputRef}
            className="edit-input"
            value={value}
            onChange={e => setValue(e.target.value)}
            onBlur={handleEditSubmit}
            onKeyDown={handleKeyDown}
          />
        </form>
      ) : (
        <span
          className="todo-text"
          onDoubleClick={() => !todo.completed && setEditing(true)}
          title={todo.completed ? '' : 'Double-click to edit'}
        >
          {todo.text}
        </span>
      )}

      <div className="item-actions">
        {!todo.completed && !editing && (
          <button className="action-btn edit" onClick={() => setEditing(true)} aria-label="Edit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        )}
        <button className="action-btn delete" onClick={() => onDelete(todo.id)} aria-label="Delete">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </button>
      </div>
    </li>
  )
}
