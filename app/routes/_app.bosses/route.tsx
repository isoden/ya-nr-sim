import { NavLink, Outlet } from 'react-router'
import type { Route } from './+types/route'

export const meta: Route.MetaFunction = () => [{
  title: 'ボス情報 - YA-ナイトレインビルドシミュレーター',
}]

const childRoutes = [
  { path: '.', label: '弱点早見表' },
  { path: './prediction', label: '3日目ボス予測' },
]

export default function Page() {
  return (
    <main className="flex min-h-0 flex-col">
      <header className="flex items-end border-b border-zinc-600 pb-4">
        <div className="mr-auto flex items-center gap-4">
          <h2 className="text-lg font-semibold text-accent-light">
            ボス情報
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
      </header>

      <Outlet />
    </main>
  )
}
