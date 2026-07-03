import React, { useEffect, useState } from 'react'
import { api } from '../api'
import Task from './Task.component.jsx'

const statusOptions = [
  { label: 'Not Started', value: 'notStarted' },
  { label: 'In Progress', value: 'inProgress' },
  { label: 'Complete', value: 'complete' },
]

const normalizeTask = (task) => ({
  status: task.status ?? 'notStarted',
  ...task,
})

export default function TodoList() {
  const [tasks, setTasks] = useState([])
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  const saveSessionTasks = async (updatedTasks) => {
    setTasks(updatedTasks)
    const updatedSession = session ? { ...session, taskList: updatedTasks } : { taskList: updatedTasks }
    setSession(updatedSession)
    await api.saveSession(updatedSession)
  }

  const onDelete = (task) => {
    const updatedTasks = tasks.filter((t) => t !== task)
    saveSessionTasks(updatedTasks)
  }

  const onEdit = (task, newDesc) => {
    const updatedTasks = tasks.map((t) => (t === task ? { ...t, desc: newDesc } : t))
    saveSessionTasks(updatedTasks)
  }

  const onStatusChange = (task, status) => {
    const updatedTasks = tasks.map((t) => (t === task ? { ...t, status } : t))
    saveSessionTasks(updatedTasks)
  }

  useEffect(() => {
    let mounted = true
    setLoading(true)
    api
      .startSession()
      .then((sessionData) => {
        if (!mounted) return
        setSession(sessionData)
        setTasks((sessionData?.taskList || []).map(normalizeTask))
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
    <section id="todo" className="rounded-2xl border border-(--secondary)/20 bg-white p-6 shadow-sm backdrop-blur dark:bg-slate-900/50">
      <h2 className="mb-4 text-xl font-semibold text-(--text-color)">Today's Tasks</h2>
      {loading ? (
        <p className="text-(--text-color)/80">Loading…</p>
      ) : tasks.length === 0 ? (
        <p className="text-(--text-color)/80">No tasks for today.</p>
      ) : (
        <div className="space-y-3">
          {tasks.map((t, i) => (
            <Task
              key={t.id ?? i}
              task={t}
              onDelete={onDelete}
              onEdit={onEdit}
              onStatusChange={onStatusChange}
              statusOptions={statusOptions}
            />
          ))}
        </div>
      )}
    </section>
  )
}
