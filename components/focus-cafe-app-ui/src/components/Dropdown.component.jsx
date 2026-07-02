import React, { useState, useRef, useEffect } from 'react'

const Dropdown = ({ options = [], placeholder = 'Select...', value, defaultValue, onChange }) => {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(() => {
    if (value !== undefined) return value
    if (defaultValue !== undefined) return defaultValue
    return options[0] ?? null
  })
  const ref = useRef()

  useEffect(() => {
    if (value !== undefined) {
      setSelected(value)
      return
    }

    if (defaultValue !== undefined) {
      setSelected(defaultValue)
    } else if (!selected && options.length > 0) {
      setSelected(options[0])
    }
  }, [value, defaultValue, options, selected])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (opt) => {
    setSelected(opt)
    setOpen(false)
    if (onChange) onChange(opt)
  }

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        type="button"
        className="w-48 rounded-lg border border-[color:var(--secondary)]/30 bg-[var(--milk)] px-4 py-2 text-sm font-medium text-[var(--text-color)] flex justify-between items-center transition hover:bg-[var(--secondary)]/5 focus:outline-none"
        onClick={() => setOpen((s) => !s)}
      >
        <span>{selected ? selected.label ?? selected : placeholder}</span>
        <svg className={`w-4 h-4 ml-2 transition-transform ${open ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.354a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div className="origin-top-right absolute mt-2 w-48 rounded-lg shadow-lg bg-[var(--milk)] border border-[color:var(--secondary)]/20 z-10">
          <div className="py-1">
            {options.length === 0 && (
              <div className="px-4 py-2 text-sm text-[var(--text-color)]/60">No options</div>
            )}
            {options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(opt)}
                className="w-full text-left px-4 py-2 text-sm text-[var(--text-color)] transition hover:bg-[var(--secondary)]/10"
                type="button"
              >
                {opt.label ?? opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dropdown
