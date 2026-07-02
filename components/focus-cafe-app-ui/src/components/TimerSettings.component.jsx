export default function TimerSettings(
    { 
        onCloseSettings,
    }
) {
    return (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="relative rounded-2xl border border-[color:var(--secondary)] bg-white p-6 dark:bg-white-900/20">
                <div className="absolute right-4 top-4 flex items-center gap-2">
                    <button
                        className="rounded-full border border-[color:var(--secondary)]/30 bg-[var(--secondary)] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[var(--secondary-dark)]"
                        onClick={onCloseSettings}
                    >
                        X
                    </button>
                </div>
                <h2 className="mb-4 text-xl font-semibold text-[var(--text-color)]">Timer Settings</h2>
                <p className="text-[var(--text-color)]/80">Here you can adjust the timer settings for your focus and break sessions.</p>
                <div className="space-y-4">
                    <div className="flex items-center justify-between gap-4 rounded-2xl border border-[color:var(--secondary)]/10 bg-[var(--secondary)]/5 p-3">
                        <div className="flex items-center gap-3">
                            <input id="music-checkbox" type="checkbox" className="h-4 w-4 rounded border-[color:var(--secondary)] text-[var(--secondary)] focus:ring-[var(--secondary)]" />
                            <label htmlFor="music-checkbox" className="text-sm font-medium text-[var(--text-color)]">Music</label>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-[var(--text-color)]/70">0</span>
                            <input type="range" min="0" max="100" defaultValue="50" className="h-2 w-48 cursor-pointer appearance-none rounded-full bg-[var(--secondary)]/30 accent-[var(--secondary)]" />
                            <span className="text-xs text-[var(--text-color)]/70">100</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-4 rounded-2xl border border-[color:var(--secondary)]/10 bg-[var(--secondary)]/5 p-3">
                        <div className="flex items-center gap-3">
                            <input id="white-noise-checkbox" type="checkbox" className="h-4 w-4 rounded border-[color:var(--secondary)] text-[var(--secondary)] focus:ring-[var(--secondary)]" />
                            <label htmlFor="white-noise-checkbox" className="text-sm font-medium text-[var(--text-color)]">White Noise</label>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-[var(--text-color)]/70">0</span>
                            <input type="range" min="0" max="100" defaultValue="50" className="h-2 w-48 cursor-pointer appearance-none rounded-full bg-[var(--secondary)]/30 accent-[var(--secondary)]" />
                            <span className="text-xs text-[var(--text-color)]/70">100</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-4 rounded-2xl border border-[color:var(--secondary)]/10 bg-[var(--secondary)]/5 p-3">
                        <div className="flex items-center gap-3">
                            <input id="ambient-sounds-checkbox" type="checkbox" className="h-4 w-4 rounded border-[color:var(--secondary)] text-[var(--secondary)] focus:ring-[var(--secondary)]" />
                            <label htmlFor="ambient-sounds-checkbox" className="text-sm font-medium text-[var(--text-color)]">Cafe Ambience</label>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-[var(--text-color)]/70">0</span>
                            <input type="range" min="0" max="100" defaultValue="50" className="h-2 w-48 cursor-pointer appearance-none rounded-full bg-[var(--secondary)]/30 accent-[var(--secondary)]" />
                            <span className="text-xs text-[var(--text-color)]/70">100</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-4 rounded-2xl border border-[color:var(--secondary)]/10 bg-[var(--secondary)]/5 p-3">
                        <div className="flex items-center gap-3">
                            <input id="rain-sounds-checkbox" type="checkbox" className="h-4 w-4 rounded border-[color:var(--secondary)] text-[var(--secondary)] focus:ring-[var(--secondary)]" />
                            <label htmlFor="rain-sounds-checkbox" className="text-sm font-medium text-[var(--text-color)]">Rain</label>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-[var(--text-color)]/70">0</span>
                            <input type="range" min="0" max="100" defaultValue="50" className="h-2 w-48 cursor-pointer appearance-none rounded-full bg-[var(--secondary)]/30 accent-[var(--secondary)]" />
                            <span className="text-xs text-[var(--text-color)]/70">100</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}