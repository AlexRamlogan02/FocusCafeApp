import React, { useEffect, useState } from 'react'
import { api } from '../api'
import Task from './Task.component.jsx'

export default function TodoList() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    api
      .startSession()
      .then((session) => {
        if (!mounted) return
        setTasks(session?.taskList || [])
      })
      .catch(() => {
        if (!mounted) return
        setTasks([])
      })
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
    }
  }, [])

  return (
    <section id="todo" className="rounded-2xl border border-[color:var(--secondary)]/20 bg-white p-6 shadow-sm backdrop-blur dark:bg-slate-900/50">
      <h2 className="mb-4 text-xl font-semibold text-[var(--text-color)]">Today's Tasks</h2>
      {loading ? (
        <p className="text-[var(--text-color)]/80">Loading…</p>
      ) : tasks.length === 0 ? (
        <p className="text-[var(--text-color)]/80">No tasks for today.</p>
      ) : (
        <div className="space-y-3">
          {tasks.map((t, i) => (
            <Task key={i} task={t} />
          ))}
        </div>
      )}
    </section>
  )
}
