import { useId, useMemo } from 'react'
import { demeritDepthsRelicEffectMap, normalizeEffectId, Relic, RelicColorBase, uniqItemNameMap } from '~/data/relics'
import { usePersistedState } from '~/hooks/usePersistedState'
import { useRelicsStore } from '~/store/relics'
import { EffectFilterPanel, IgnoredRelicsList, RedundantRelicCard } from './components'

export default function Page() {
  const id = useId()
  const { relics: rawRelics, setRelics } = useRelicsStore()
  const [ignoredEffectIdsMap, setIgnoredEffectIdsMap] = usePersistedState<Record<string, boolean>>(`_app.manage-relics/ignored_effect_ids`, {})
  const [ignoredRelicIds, setIgnoredRelicIds] = usePersistedState<string[]>(`_app.manage-relics/ignored_relic_ids`, [])

  const relics = useMemo(() => rawRelics.map((r) => Relic.new(r)), [rawRelics])
  const ignoredEffectIds = useMemo(() => Object.keys(ignoredEffectIdsMap).filter((id) => ignoredEffectIdsMap[id]).map(Number), [ignoredEffectIdsMap])
  const redundantRelicsMap = useMemo(() => findRedundantRelics(relics, { ignoredRelicIds, ignoredEffectIds }), [relics, ignoredRelicIds, ignoredEffectIds])
  const ignoredEffectIdsOrder = useMemo(() => Object.keys(ignoredEffectIdsMap).filter((id) => ignoredEffectIdsMap[id]).map(Number), [ignoredEffectIdsMap])

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
    <section
      aria-labelledby={id}
      className="flex min-h-0 flex-col gap-y-4 overflow-y-auto"
    >
      <h3 id={id} className="sr-only">遺物最適化</h3>

      <p className="mt-4 text-sm text-zinc-400">
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
          {
            Array.from(redundantRelicsMap)
              .toSorted(([relicA], [relicB]) => {
              // ignoredEffectIdsOrder の順序に基づいてソート
                const normalizedEffectsA = extractNormalizedEffects(relicA.effects)
                const normalizedEffectsB = extractNormalizedEffects(relicB.effects)

                // 各遺物が ignoredEffectIdsOrder のどの位置に最初にマッチするかを取得
                const indexA = ignoredEffectIdsOrder.findIndex((effectId) => normalizedEffectsA.includes(effectId))
                const indexB = ignoredEffectIdsOrder.findIndex((effectId) => normalizedEffectsB.includes(effectId))

                // どちらも無効な効果を持たない場合は順序を変えない
                if (indexA === -1 && indexB === -1) return 0

                // 片方だけが無効な効果を持つ場合、持つ方を優先
                if (indexA === -1) return 1
                if (indexB === -1) return -1

                // 両方が無効な効果を持つ場合、ignoredEffectIdsOrder の順序に従う
                return indexA - indexB
              })
              .map(([redundantRelic, superiorRelics]) => (
                <RedundantRelicCard
                  key={redundantRelic.id}
                  redundantRelic={redundantRelic}
                  superiorRelics={superiorRelics}
                  ignoredEffectIds={ignoredEffectIds}
                  onRemove={handleRemoveRelic}
                  onIgnore={handleIgnoreRelic}
                />
              ))
          }
        </div>
      )}
    </section>
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
