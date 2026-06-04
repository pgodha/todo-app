import { useState } from 'react'

export default function TodoInput({ onAdd }) {
  const [hasValue, setHasValue] = useState(false)

  function handleAction(formData) {
    const trimmed = formData.get('text').trim()
    if (!trimmed) return
    onAdd(trimmed)
    setHasValue(false)
  }

  return (
    <form className="todo-input-form" action={handleAction}>
      <input
        className="todo-input"
        type="text"
        name="text"
        placeholder="What needs to be done?"
        onChange={e => setHasValue(e.target.value.trim().length > 0)}
        autoFocus
      />
      <button className="add-btn" type="submit" disabled={!hasValue}>
        Add
      </button>
    </form>
  )
}
