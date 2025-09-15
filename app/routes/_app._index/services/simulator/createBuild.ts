import type { Relic } from '~/data/relics'
import type { Vessel } from '~/data/vessels'
import type { Build } from './types'

/**
 * solverの結果の変数を実際のデータにマッピングしてビルドを作成する
 *
 * solverが返す変数の値（0 or 1）から、実際の器と遺物の組み合わせを作成
 */
export function createBuild(variables: [string, number][], vessels: Vessel[], relics: Relic[]): Build {
  const build: Build = { vessel: null!, relics: [] }

  // 遺物とそのスロットタイプの情報を収集
  const relicSlotMap = new Map<Relic['id'], 'color' | 'free'>()

  for (const [key, value] of variables) {
    if (value === 0) continue

    const parts = key.split('.')

    switch (parts[0]) {
      case 'vessel':
        if (value === 1) {
          build.vessel = vessels.find((vessel) => vessel.id === parts[1])!
        }
        break
      case 'relic':
        if (value === 1 && parts.length >= 3) {
          // relic.{id}.color or relic.{id}.free
          const relicId = parts[1]
          const slotType = parts[2] as 'color' | 'free'
          const relic = relics.find((r) => r.id === relicId)
          if (relic && !build.relics.some((r) => r.id === relicId)) {
            build.relics.push(relic)
            relicSlotMap.set(relicId, slotType)
          }
        }
        break
    }
  }

  // 遺物を器のスロット順に並べ替える
  build.relics.sort((a, b) => {
    const aSlotType = relicSlotMap.get(a.id)
    const bSlotType = relicSlotMap.get(b.id)

    // 色スロットに装備された遺物を先に配置
    if (aSlotType === 'color' && bSlotType === 'free') return -1
    if (aSlotType === 'free' && bSlotType === 'color') return 1

    if (aSlotType === 'color' && bSlotType === 'color') {
      // 両方とも色スロットの場合、器のスロット順に並べる
      const aIndex = build.vessel.slots.indexOf(a.color)
      const bIndex = build.vessel.slots.indexOf(b.color)

      const diff = aIndex - bIndex
      if (diff !== 0) return diff
    }

    // - 同じ色スロットの場合は遺物ID順
    // - 両方ともFreeスロットの場合は遺物ID順
    // - それ以外はID順
    return a.id.localeCompare(b.id)
  })

  return build
}
