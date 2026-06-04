export default function TodoInput({ onAdd }) {
  function handleAction(formData) {
    const trimmed = formData.get('text').trim()
    if (!trimmed) return
    onAdd(trimmed)
  }

  return (
    <form className="todo-input-form" action={handleAction}>
      <input
        className="todo-input"
        type="text"
        name="text"
        placeholder="What needs to be done?"
        autoFocus
      />
      <button className="add-btn" type="submit">
        Add
      </button>
    </form>
  )
}
