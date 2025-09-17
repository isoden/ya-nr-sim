import { NavLink, Outlet } from 'react-router'
import { parseStringifiedRelicsSchema } from '~/schema/StringifiedRelicsSchema'
import type { Route } from './+types/route'

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
    <div className="grid h-screen grid-rows-[min-content_1fr] gap-8 p-8">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold">ナイトレインビルドシミュレーター</h1>
        <nav className="ml-auto flex gap-6" aria-label="メインナビゲーション">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={`
              nav-link pb-1 text-sm
            `}
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
