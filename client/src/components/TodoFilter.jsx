export default function TodoFilter({ current, onChange, filters }) {
  return (
    <div className="filter-group">
      {Object.values(filters).map(f => (
        <button
          key={f}
          className={`filter-btn${current === f ? ' active' : ''}`}
          onClick={() => onChange(f)}
        >
          {f.charAt(0).toUpperCase() + f.slice(1)}
        </button>
      ))}
    </div>
  )
}
