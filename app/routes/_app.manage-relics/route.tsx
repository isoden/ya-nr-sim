import { useMemo } from 'react'
import { useRelicsStore } from '~/store/relics'
import { usePersistedState } from '~/hooks/usePersistedState'
import { demeritDepthsRelicEffectMap, normalizeEffectId, Relic, RelicColorBase, uniqItemNameMap } from '~/data/relics'
import type { Route } from './+types/route'
import { ImportDialog, EffectFilterPanel, IgnoredRelicsList, RedundantRelicCard } from './components'

export const meta: Route.MetaFunction = () => [{
  title: '遺物管理 - YA-ナイトレインビルドシミュレーター',
}]

export default function Page() {
  const { relics: rawRelics, setRelics } = useRelicsStore()
  const [ignoredEffectIdsMap, setIgnoredEffectIdsMap] = usePersistedState<Record<string, boolean>>(`_app.manage-relics/ignored_effect_ids`, {})
  const [ignoredRelicIds, setIgnoredRelicIds] = usePersistedState<string[]>(`_app.manage-relics/ignored_relic_ids`, [])

  const relics = useMemo(() => rawRelics.map((r) => Relic.new(r)), [rawRelics])
  const ignoredEffectIds = useMemo(() => Object.keys(ignoredEffectIdsMap).filter((id) => ignoredEffectIdsMap[id]).map(Number), [ignoredEffectIdsMap])
  const redundantRelicsMap = useMemo(() => findRedundantRelics(relics, { ignoredRelicIds, ignoredEffectIds }), [relics, ignoredRelicIds, ignoredEffectIds])

  const handleToggleEffect = (effectId: string, checked: boolean) => {
    setIgnoredEffectIdsMap((ids) => ({ ...ids, [effectId]: checked }))
  }

  const handleRemoveRelic = (relicId: string) => {
    setRelics(rawRelics.filter((r) => r.id !== relicId))
  }

  const handleIgnoreRelic = (relicId: string) => {
    setIgnoredRelicIds((ids) => [...ids, relicId])
  }

  const handleUnignoreRelic = (relicId: string) => {
    setIgnoredRelicIds((ids) => ids.filter((id) => id !== relicId))
  }

  return (
    <main className="space-y-6 overflow-auto p-6">
      <header className={`
        flex items-end justify-between border-b border-zinc-600 pb-4
      `}
      >
        <h2 className="text-2xl font-semibold text-accent-light">
          遺物管理
        </h2>
        <ImportDialog />
      </header>

      <section className="space-y-4">
        <p className="text-sm text-zinc-400">
          効果が重複している遺物が
          <span className="font-semibold text-accent-light">{redundantRelicsMap.size}</span>
          件見つかりました
        </p>

        <div className="grid max-h-[50vh] grid-cols-2 items-start gap-6">
          <EffectFilterPanel
            ignoredEffectIds={ignoredEffectIdsMap}
            onToggleEffect={handleToggleEffect}
          />

          <IgnoredRelicsList
            ignoredRelicIds={ignoredRelicIds}
            relics={relics}
            onUnignore={handleUnignoreRelic}
          />
        </div>

        {redundantRelicsMap.size > 0 && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-zinc-200">冗長な遺物</h4>
            <div className="space-y-4">
              {Array.from(redundantRelicsMap).map(([redundantRelic, superiorRelics]) => (
                <RedundantRelicCard
                  key={redundantRelic.id}
                  redundantRelic={redundantRelic}
                  superiorRelics={superiorRelics}
                  ignoredEffectIds={ignoredEffectIds}
                  onRemove={handleRemoveRelic}
                  onIgnore={handleIgnoreRelic}
                />
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

const uniqueItemNames = Object.entries(uniqItemNameMap).reduce<Record<string, true>>((acc, [, name]) => {
  acc[name] = true
  return acc
}, {})

function findRedundantRelics(relics: Relic[], options: {
  ignoredRelicIds: string[]
  ignoredEffectIds: number[]
}) {
  const ignoredRelicIdsSet = new Set(options.ignoredRelicIds)
  const ignoredEffectIdsSet = new Set(options.ignoredEffectIds)

  const redundantRelicsMap: Map<Relic, Relic[]> = new Map()
  const relicsByColor: Record<Relic['color'], Relic[]> = {
    [RelicColorBase.Red]: [],
    [RelicColorBase.Blue]: [],
    [RelicColorBase.Green]: [],
    [RelicColorBase.Yellow]: [],
  }
  const relicEffectsCache = new Map<Relic['id'], number[]>()

  // prepare
  for (const relic of relics) {
    relicsByColor[relic.color].push(relic)

    relicEffectsCache.set(relic.id, extractNormalizedEffects(relic.effects))
  }

  for (const checkingRelic of relics) {
    // ユニークアイテムは売却できないため比較対象外
    // 除外するIDの遺物は除外
    if (uniqueItemNames[checkingRelic.name] || ignoredRelicIdsSet.has(checkingRelic.id)) continue

    const checkingEffects = relicEffectsCache.get(checkingRelic.id)!.filter((id) => !ignoredEffectIdsSet.has(id))
    const superiorRelics: Relic[] = []

    for (const comparedRelic of relicsByColor[checkingRelic.color]) {
      // 異なるIDの遺物同士で行う
      if (checkingRelic.id === comparedRelic.id) continue

      const comparedEffects = relicEffectsCache.get(comparedRelic.id)!

      if (checkingEffects.length > comparedEffects.length) continue

      if (checkingEffects.every((effect) => comparedEffects.includes(effect))) {
        superiorRelics.push(comparedRelic)
      }
    }

    if (superiorRelics.length > 0) {
      redundantRelicsMap.set(checkingRelic, superiorRelics)
    }
  }

  return redundantRelicsMap
}

function extractNormalizedEffects(relic: number[]) {
  return relic.map(normalizeEffectId).filter((effectId) => demeritDepthsRelicEffectMap[effectId] == null)
}
