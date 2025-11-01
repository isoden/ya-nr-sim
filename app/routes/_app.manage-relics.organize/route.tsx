import { useCallback, useId, useMemo } from 'react'
import { EffectSelectionPanel } from '~/components/EffectSelectionPanel/EffectSelectionPanel'
import { demeritDepthsRelicEffectMap, normalizeEffectId, Relic, RelicColorBase, RelicColorExtended } from '~/data/relics'
import { usePersistedState } from '~/hooks/usePersistedState'
import { useRelicsStore } from '~/store/relics'
import { RedundantRelicCard } from './components'

/** 重複遺物のエントリー型 */
type RedundantRelicEntry = [redundantRelic: Relic, superiorRelics: Relic[]]

/** 色別にグループ化された重複遺物の型 */
type GroupedRedundantRelics = [colorExtended: RelicColorExtended, entries: RedundantRelicEntry[]][]

export default function Page() {
  const id = useId()
  const { relics: rawRelics, setRelics } = useRelicsStore()
  const [effectIdsList, setEffectIdsList] = usePersistedState<string[]>(`_app.manage-relics/ignored_effect_ids.1`, [])

  const flattenEffectIds = useMemo(() => effectIdsList.flatMap((ids) => ids.split(',').map((id) => Number(id))), [effectIdsList])
  const relics = useMemo(() => rawRelics.map((r) => Relic.new(r)), [rawRelics])
  const redundantRelicsMap = useMemo(
    () => findRedundantRelics(relics, { ignoredEffectIds: flattenEffectIds }),
    [relics, flattenEffectIds],
  )

  const handleToggleEffect = useCallback((effectIds: string[]) => {
    setEffectIdsList(effectIds)
  }, [setEffectIdsList])

  const handleRemoveRelic = useCallback((relicId: string) => {
    setRelics(rawRelics.filter((r) => r.id !== relicId))
  }, [rawRelics, setRelics])

  const groupedRedundantRelics = useMemo<GroupedRedundantRelics>(() => {
    const grouped = Object.groupBy(
      Array.from(redundantRelicsMap),
      ([relic]) => relic.colorExtended,
    )

    if (flattenEffectIds.length > 0) {
      for (const entries of Object.values(grouped)) {
        entries?.sort((entryA, entryB) =>
          compareRedundantRelics(entryA[0], entryB[0], flattenEffectIds),
        )
      }
    }

    return [
      RelicColorExtended.Red,
      RelicColorExtended.Blue,
      RelicColorExtended.Yellow,
      RelicColorExtended.Green,
      RelicColorExtended.DeepRed,
      RelicColorExtended.DeepBlue,
      RelicColorExtended.DeepYellow,
      RelicColorExtended.DeepGreen,
    ]
      .reduce<GroupedRedundantRelics>((acc, color) => {
        const value = grouped[color]
        return (value == null || value.length === 0) ? acc : [...acc, [color, value]]
      }, [])
  }, [flattenEffectIds, redundantRelicsMap])

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
        <EffectSelectionPanel
          defaultValue={effectIdsList}
          onChange={handleToggleEffect}
        />
      </div>

      {groupedRedundantRelics.length > 0 && (
        <div className="space-y-4">
          {
            groupedRedundantRelics
              .map(([colorExtended, relics]) => (
                <div key={colorExtended} className="space-y-4">
                  <h4 className="mb-2 text-lg font-semibold text-zinc-200">
                    {(colorExtended)}
                    の重複遺物
                  </h4>
                  <div className="grid grid-cols-5 gap-3">
                    {relics.map(([redundantRelic, superiorRelics]) => (
                      <RedundantRelicCard
                        key={redundantRelic.id}
                        redundantRelic={redundantRelic}
                        superiorRelics={superiorRelics}
                        ignoredEffectIds={flattenEffectIds}
                        onRemove={handleRemoveRelic}
                      />
                    ))}
                  </div>
                </div>
              ))
          }
        </div>
      )}
    </section>
  )
}

/**
 * 遺物の効果IDリストから正規化された効果を抽出する
 *
 * @param effects - 遺物の効果IDリスト
 * @returns デメリット効果を除外した正規化済み効果IDリスト
 */
function extractNormalizedEffects(effects: number[]): number[] {
  return effects
    .map(normalizeEffectId)
    .filter((effectId) => demeritDepthsRelicEffectMap[effectId] == null)
}

/**
 * 遺物を比較してソート順を決定する
 *
 * ソート優先順位:
 * 1. 効果数が少ない順（デメリット効果を除く）
 * 2. 無視された効果の順序
 *
 * @param relicA - 比較対象の遺物A
 * @param relicB - 比較対象の遺物B
 * @param ignoredEffectIds - 無視する効果IDのリスト（順序を保持）
 * @returns ソート用の比較値
 */
function compareRedundantRelics(
  relicA: Relic,
  relicB: Relic,
  ignoredEffectIds: number[],
): number {
  const normalizedEffectsA = extractNormalizedEffects(relicA.effects)
  const normalizedEffectsB = extractNormalizedEffects(relicB.effects)

  // 1. 効果数が少ない順（デメリット効果を除く）
  const effectCountDiff = normalizedEffectsA.length - normalizedEffectsB.length
  if (effectCountDiff !== 0) return effectCountDiff

  // 2. 各遺物が ignoredEffectIds のどの位置に最初にマッチするかを取得
  const indexA = ignoredEffectIds.findIndex((effectId) => normalizedEffectsA.includes(effectId))
  const indexB = ignoredEffectIds.findIndex((effectId) => normalizedEffectsB.includes(effectId))

  // どちらも無効な効果を持たない場合は順序を変えない
  if (indexA === -1 && indexB === -1) return 0

  // 片方だけが無効な効果を持つ場合、持つ方を優先
  if (indexA === -1) return 1
  if (indexB === -1) return -1

  // 両方が無効な効果を持つ場合、ignoredEffectIds の順序に従う
  return indexA - indexB
}

/**
 * 重複する遺物を検出する
 *
 * ある遺物の効果が、別の遺物の効果に完全に含まれている場合、
 * その遺物を「重複」として扱う。
 *
 * @param relics - 検査対象の遺物リスト
 * @param options - 検出オプション
 * @param options.ignoredRelicIds - 検出から除外する遺物IDのリスト
 * @param options.ignoredEffectIds - 比較時に無視する効果IDのリスト
 * @returns 重複遺物とそれらの上位互換遺物のマップ
 */
function findRedundantRelics(
  relics: Relic[],
  options: {
    ignoredEffectIds: number[]
  },
): Map<Relic, Relic[]> {
  const ignoredEffectIdsSet = new Set(options.ignoredEffectIds)

  const redundantRelicsMap = new Map<Relic, Relic[]>()
  const relicsByColorAndType: Record<Relic['color'], Record<Relic['type'], Relic[]>> = {
    [RelicColorBase.Red]: { normal: [], depths: [] },
    [RelicColorBase.Blue]: { normal: [], depths: [] },
    [RelicColorBase.Green]: { normal: [], depths: [] },
    [RelicColorBase.Yellow]: { normal: [], depths: [] },
  }
  const relicEffectsCache = new Map<Relic['id'], number[]>()

  // 前処理: 遺物を色とタイプで分類し、効果をキャッシュ
  for (const relic of relics) {
    relicsByColorAndType[relic.color][relic.type].push(relic)
    relicEffectsCache.set(relic.id, extractNormalizedEffects(relic.effects))
  }

  // 各遺物について重複をチェック
  for (const checkingRelic of relics) {
    // 売却できない遺物は比較対象外
    if (checkingRelic.unsellable) {
      continue
    }

    const checkingEffects = relicEffectsCache
      .get(checkingRelic.id)!
      .filter((id) => !ignoredEffectIdsSet.has(id))
    const superiorRelics: Relic[] = []

    // 同じ色かつ同じタイプの遺物と比較
    for (const comparedRelic of relicsByColorAndType[checkingRelic.color][checkingRelic.type]) {
      // 異なるIDの遺物同士で比較
      if (checkingRelic.id === comparedRelic.id) continue

      const comparedEffects = relicEffectsCache.get(comparedRelic.id)!

      // 比較対象の効果が少ない場合はスキップ
      if (checkingEffects.length > comparedEffects.length) continue

      // チェック中の遺物の効果が、比較対象の遺物に全て含まれる場合
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
