import React from 'react';
import Switch from './Switch.component.jsx';

export default function Header({ darkMode, onToggleDarkMode }) {
    return (
        <header className="w-full bg-[var(--secondary)] text-[var(--milk)] shadow-sm">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                <div className="text-2xl font-semibold tracking-tight sm:text-3xl">PomoBrew</div>
                <nav className="hidden items-center gap-4 text-sm font-medium sm:flex">
                    <a href="#" className="transition hover:opacity-80">GitHub</a>
                    <a href="#" className="transition hover:opacity-80">Blog</a>
                    <a href="#" className="transition hover:opacity-80">Account</a>
                </nav>
                <Switch
                    isOn={darkMode}
                    onToggle={onToggleDarkMode}
                    onLabel="Dark Mode"
                    offLabel="Light Mode"
                    className="ml-auto"
                />
            </div>
        </header>
    )
}