import { NavLink, Outlet } from 'react-router'
import { invariant } from 'es-toolkit'
import type { Route } from './+types/route'
import { depthsRelicEffectMap, negativeDepthsRelicEffectMap, normalizeEffectId, relicEffectMap } from '~/data/relics'

// FIX: consider import path
import { parseStringifiedRelicsSchema } from '../_app._index/schema/StringifiedRelicsSchema'

export function clientLoader() {
  const relics = parseStringifiedRelicsSchema(localStorage.getItem('relics'))

  assertRelics(relics)

  return { relicsCount: relics.length }
}

function assertRelics(relics: ReturnType<typeof parseStringifiedRelicsSchema>): asserts relics {
  const invalidEffectIds = relics
    .flatMap((relic) => relic.effects.map(normalizeEffectId))
    .filter(
      (effectId): effectId is number =>
        (relicEffectMap[effectId] || depthsRelicEffectMap[effectId] || negativeDepthsRelicEffectMap[effectId]) == null,
    )

  if (invalidEffectIds.length > 0) {
    invariant(false, `invalidEffectIds: ${[...new Set(invalidEffectIds).values()].join(', ')}`)
  }
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
            <NavLink key={link.href} to={link.href} className="nav-link text-sm pb-1">
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <Outlet />
    </div>
  )
}
