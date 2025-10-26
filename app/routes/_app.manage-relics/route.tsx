import { NavLink, Outlet } from 'react-router'
import type { Route } from './+types/route'
import { ImportDialog } from './components'

export const meta: Route.MetaFunction = () => [{
  title: '遺物管理 - YA-ナイトレインビルドシミュレーター',
}]

const childRoutes = [
  { path: '.', label: '一覧' },
  { path: './organize', label: '最適化' },
]

export default function Page() {
  return (
    <main className="flex min-h-0 flex-col">
      <header className="flex items-end border-b border-zinc-600 pb-4">
        <div className="mr-auto flex items-center gap-4">
          <h2 className="text-lg font-semibold text-accent-light">
            遺物管理
          </h2>
          /
          <div className="flex gap-4">
            {childRoutes.map(({ path, label }) => (
              <NavLink
                key={path}
                to={path}
                className="nav-link text-accent-light"
                end
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>

        <ImportDialog />
      </header>

      <Outlet />
    </main>
  )
}
