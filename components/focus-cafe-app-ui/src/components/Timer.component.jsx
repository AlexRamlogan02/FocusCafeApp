import React, { useEffect, useState } from 'react'
import { api } from '../api'
import Dropdown from './Dropdown.component.jsx'

const getPresetDurations = (preset) => {
    switch (preset) {
        case 1:
            return { focus: 25 * 60, break: 5 * 60 }
        case 2:
            return { focus: 50 * 60, break: 10 * 60 }
        case 3:
            return { focus: 60 * 60, break: 20 * 60 }
        default:
            return { focus: 25 * 60, break: 5 * 60 }
    }
}

export default function Timer({
    item = {
        item: 'Iced Matcha',
        assetLink: '/iced-matcha.png',
    },
    focusDuration,
    breakDuration,
    numSessions = 4,
}) {
    const [session, setSession] = useState(null)
    const [timeLeft, setTimeLeft] = useState(focusDuration ?? 25 * 60)
    const [phase, setPhase] = useState('focus')
    const [isRunning, setIsRunning] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true

        api.startSession()
            .then((sessionData) => {
                if (!mounted) return
                setSession(sessionData)
                const durations = focusDuration != null && breakDuration != null
                    ? { focus: focusDuration, break: breakDuration }
                    : getPresetDurations(sessionData?.preset)
                setPhase('focus')
                setTimeLeft(durations.focus)
            })
            .finally(() => {
                if (mounted) setLoading(false)
            })

        return () => {
            mounted = false
        }
    }, [focusDuration, breakDuration])

    useEffect(() => {
        if (!isRunning || timeLeft === null) return

        const durations = focusDuration != null && breakDuration != null
            ? { focus: focusDuration, break: breakDuration }
            : getPresetDurations(session?.preset)
        const intervalId = window.setInterval(() => {
            setTimeLeft((current) => {
                if (current <= 1) {
                    const nextPhase = phase === 'focus' ? 'break' : 'focus'
                    setPhase(nextPhase)
                    return nextPhase === 'focus' ? durations.focus : durations.break
                }
                return current - 1
            })
        }, 1000)

        return () => window.clearInterval(intervalId)
    }, [isRunning, timeLeft, phase, session, focusDuration, breakDuration])

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const handleStartPause = () => {
        if (timeLeft === null) return
        setIsRunning((current) => !current)
    }

    const handleReset = () => {
        const durations = focusDuration != null && breakDuration != null
            ? { focus: focusDuration, break: breakDuration }
            : getPresetDurations(session?.preset)
        setPhase('focus')
        setTimeLeft(durations.focus)
        setIsRunning(false)
    }

    if (loading) {
        return <div className="rounded-3xl border border-[color:var(--secondary)]/20 bg-white p-8 text-center shadow-sm dark:bg-slate-900/50">Loading timer…</div>
    }

    return (
        <div className="mx-auto max-w-2xl rounded-3xl border border-[color:var(--secondary)]/20 bg-white p-8 text-center shadow-lg backdrop-blur dark:bg-slate-900/50">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--secondary)]">
                {phase === 'break' ? 'Break' : 'Focus'} session
            </p>
            <h1 className="mt-3 text-7xl font-semibold tracking-tight text-[var(--text-color)] sm:text-8xl">
                {formatTime(timeLeft)}
            </h1>
            <div className="mt-6 flex justify-center gap-3">
                <button
                    type="button"
                    onClick={handleStartPause}
                    className="rounded-full bg-[var(--secondary)] px-5 py-2.5 text-sm font-semibold text-[var(--milk)] transition hover:opacity-90"
                >
                    {isRunning ? 'Pause' : 'Start'}
                </button>
                {!isRunning && (
                    <button
                        type="button"
                        onClick={handleReset}
                        className="rounded-full border border-[color:var(--secondary)]/30 px-5 py-2.5 text-sm font-semibold text-[var(--text-color)] transition hover:bg-[var(--secondary)]/10"
                    >
                        Reset
                    </button>
                )}
            </div>
        </div>
    )
}
