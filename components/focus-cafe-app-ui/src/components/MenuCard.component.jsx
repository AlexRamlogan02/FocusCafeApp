import React from 'react'

export default function MenuCard({ title, description, onClick, imgSrc }) {
  return (
    <button
      type="button"
      onClick={() => onClick({ title, description, imgSrc })}
      className="w-full max-w-2xl rounded-3xl border border-[color:var(--secondary)]/20 bg-[color:var(--milk)] p-8 text-center shadow-lg transition hover:scale-[1.01] hover:shadow-xl dark:bg-slate-900/50"
    >
      <h1 className="text-3xl font-bold text-[var(--text-color)]">{title}</h1>
      <p className="mt-2 text-base text-[var(--text-color)]/80">{description}</p>
      {imgSrc && <img src={imgSrc} alt={title} className="mx-auto my-4" />}
    </button>
  )
}