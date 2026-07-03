import React from 'react'
import { useLocation } from 'react-router-dom'
import Timer from '../components/Timer.component.jsx'
import TodoList from '../components/TodoList.jsx'

export default function FocusPage({
    item = {
        item: 'Iced Matcha',
        assetLink: '/iced-matcha.png',
    },
    settings = {
        focusDuration: 25 * 60,
        breakDuration: 5 * 60,
    }
}) {
    const location = useLocation()
    const passedSettings = location.state?.settings
    const resolvedItem = location.state?.item ?? item
    const resolvedSettings = {
        focusDuration: passedSettings?.focusDuration ?? settings.focusDuration,
        breakDuration: passedSettings?.breakDuration ?? settings.breakDuration,
        numSessions: passedSettings?.numSessions ?? 4,
    }

    return (
        <div className="space-y-8">
            <section className="space-y-8">
                <div className="rounded-3xl border border-[color:var(--secondary)]/20 bg-white p-6 shadow-lg dark:bg-slate-900/50">
                    <Timer
                        item={resolvedItem}
                        focusDuration={resolvedSettings.focusDuration}
                        breakDuration={resolvedSettings.breakDuration}
                        numSessions={resolvedSettings.numSessions}
                    />
                </div>
                <div className="rounded-3xl border border-[color:var(--secondary)]/20 bg-white p-6 shadow-lg dark:bg-slate-900/50">
                    <TodoList />
                </div>
            </section>
        </div>
    )
}