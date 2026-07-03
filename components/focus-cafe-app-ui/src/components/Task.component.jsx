import React, { useEffect, useRef, useState } from 'react'
import Dropdown from './Dropdown.component.jsx'

const statusOptionList = [
  { label: 'Not Started', value: 'notStarted' },
  { label: 'In Progress', value: 'inProgress' },
  { label: 'Complete', value: 'complete' },
]

export default function Task({ task, onDelete, onEdit, onStatusChange, statusOptions = statusOptionList }) {
  const [isEditing, setIsEditing] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [inputValue, setInputValue] = useState(task?.desc || '')
  const menuRef = useRef(null)

  useEffect(() => {
    setInputValue(task?.desc || '')
  }, [task?.desc])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!task) return null

  const selectedStatus = statusOptions.find((option) => option.value === task.status) || statusOptions[0]
  const isComplete = task.status === 'complete'

  const handleSave = () => {
    if (!inputValue.trim()) return
    onEdit(task, inputValue.trim())
    setIsEditing(false)
  }

  return (
    <div className="rounded-xl border border-(--secondary)/20 bg-(--milk) p-3 shadow-sm dark:bg-slate-700/40">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Dropdown
              options={statusOptions}
              value={selectedStatus}
              onChange={(option) => onStatusChange(task, option.value)}
            />

            {isEditing ? (
              <input
                type="text"
                className="w-full rounded-lg border border-(--secondary)/20 bg-white px-3 py-2 text-sm text-(--text-color) focus:outline-none"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave()
                  if (e.key === 'Escape') setIsEditing(false)
                }}
                autoFocus
              />
            ) : (
              <p
                className={`min-w-0 text-sm ${isComplete ? 'line-through text-(--text-color)/60' : 'text-(--text-color)'}`}
              >
                {task.desc}
              </p>
            )}
          </div>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-(--secondary)/20 bg-(--milk) text-(--text-color) transition hover:bg-(--secondary)/10"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
          >
            <span className="sr-only">Task options</span>
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute right-0 z-10 mt-2 min-w-35 overflow-hidden rounded-lg border border-(--secondary)/20 bg-white shadow-lg dark:bg-slate-900/80">
              <button
                type="button"
                className="block w-full px-4 py-2 text-left text-sm text-(--text-color) transition hover:bg-(--secondary)/10"
                onClick={() => {
                  setIsEditing(true)
                  setMenuOpen(false)
                }}
              >
                Edit
              </button>
              <button
                type="button"
                className="block w-full px-4 py-2 text-left text-sm text-(--text-color) transition hover:bg-(--secondary)/10"
                onClick={() => {
                  onDelete(task)
                  setMenuOpen(false)
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
