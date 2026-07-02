import { useNavigate } from 'react-router-dom'
import Timer from '../components/Timer.component.jsx'
import TodoList from '../components/TodoList'

export default function HomePage() {
    const navigate = useNavigate()

    return (
        <div className="space-y-8">
            <section className="rounded-3xl border border-[color:var(--secondary)]/20 bg-white p-8 shadow-lg dark:bg-slate-900/50">
                <div className="space-y-3 text-center">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--secondary)]">Welcome</p>
                    <h1 className="text-4xl font-semibold text-[var(--text-color)]">PomoCha Focus Cafe</h1>
                    <p className="mx-auto max-w-2xl text-base text-[var(--text-color)]/80">
                        Manage your focus sessions and tasks with a relaxed café-style workflow.
                    </p>
                </div>
            </section>

            <button
                type="button"
                onClick={() => navigate('/menu')}
                className="rounded-lg bg-[var(--secondary)] px-4 py-2 text-white transition hover:opacity-80"
            >
                Get Started
            </button>

        </div>
    )
}
