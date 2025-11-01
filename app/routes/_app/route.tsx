import { NavLink, Outlet } from 'react-router'
import { useRelicsStore } from '~/store/relics'

const formatter = new Intl.NumberFormat('ja-JP')

export default function Layout() {
  const relicsCount = useRelicsStore((state) => state.relics.length)
  const navLinks = [
    { href: '/', label: 'シミュレーター' },
    { href: '/manage-relics', label: `遺物管理 (${formatter.format(relicsCount)})` },
    { href: '/bosses', label: `ボス情報` },
  ]

  return (
    <div className="grid h-screen grid-rows-[min-content_1fr] gap-8 p-8">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-accent-light">ナイトレインビルドシミュレーター</h1>
        <nav className="ml-auto flex gap-6" aria-label="メインナビゲーション">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className="nav-link pb-1 text-sm text-accent-light"
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
