import React from 'react'

const priorityLabel = (p) => (p === 1 ? 'Low' : p === 2 ? 'Medium' : 'High')

export default function Task({ task }) {
  if (!task) return null
  return (
    <div className="rounded-xl border border-[color:var(--secondary)]/20 bg-[var(--milk)] p-3 shadow-sm dark:bg-slate-700/40">
      <label className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-3">
          <input type="checkbox" aria-label={`complete ${task.desc}`} className="h-4 w-4 rounded border-[color:var(--secondary)]/40" />
          <span className="text-[var(--text-color)]">{task.desc}</span>
        </span>
        <span className="rounded-full bg-[var(--secondary)]/10 px-2.5 py-1 text-xs font-medium text-[var(--secondary)]">
          {priorityLabel(task.priority)}
        </span>
      </label>
    </div>
  )
}
