import { NavLink, Outlet } from 'react-router'
import type { Route } from './+types/route'

// FIX: consider import path
import { parseStringifiedRelicsSchema } from '../_app._index/schema/StringifiedRelicsSchema'

export function clientLoader() {
  const relics = parseStringifiedRelicsSchema(localStorage.getItem('relics'))

  return { relicsCount: relics.length }
}

export default function Layout({ loaderData }: Route.ComponentProps) {
  const navLinks = [
    { href: '/', label: 'シミュレーター' },
    { href: '/manage-relics', label: `遺物管理 (${loaderData.relicsCount})` },
  ]

  return (
    <div className="h-screen gap-8 p-8 grid grid-rows-[min-content_1fr]">
      <header className="flex justify-between items-center">
        <h1 className="text-xl font-bold">ナイトレインビルドシミュレーター</h1>
        <nav className="flex gap-6 ml-auto" aria-label="メインナビゲーション">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className="aria-[current=page]:border-b-pink-600 aria-[current=page]:border-b-2 text-sm pb-1"
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <Outlet />
    </div>
  )
}
