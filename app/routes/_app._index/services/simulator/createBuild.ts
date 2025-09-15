import type { Relic } from '~/data/relics'
import { SlotColor, type Vessel } from '~/data/vessels'
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
            // 実際のスロットタイプを判定する
            // 色スロットとして指定されているが、献器にその色がない場合はFreeスロットとして扱う
            let actualSlotType = slotType
            if (slotType === 'color' && build.vessel && !build.vessel.slots.includes(relic.colorExtended)) {
              actualSlotType = 'free'
            }
            relicSlotMap.set(relicId, actualSlotType)
          }
        }
        break
    }
  }

  // 色スロットの遺物の献器内でのインデックスを取得
  const getColorSlotIndex = (relic: Relic) => build.vessel.slots.indexOf(relic.colorExtended)

  // Freeスロットのインデックスを取得
  const getFreeSlotIndex = () => build.vessel.slots.indexOf(SlotColor.Free)

  // 遺物を器のスロット順に並べ替える
  build.relics.sort((a, b) => {
    const aSlotType = relicSlotMap.get(a.id)
    const bSlotType = relicSlotMap.get(b.id)

    if (aSlotType === 'color' && bSlotType === 'color') {
      // 両方とも色スロットの場合、器のスロット順に並べる
      const aIndex = getColorSlotIndex(a)
      const bIndex = getColorSlotIndex(b)
      const diff = aIndex - bIndex

      if (diff !== 0) return diff
    } else if (aSlotType === 'color' && bSlotType === 'free') {
      // 色スロットとFreeスロットを比較
      const aIndex = getColorSlotIndex(a)
      const bIndex = getFreeSlotIndex()

      return aIndex - bIndex
    } else if (aSlotType === 'free' && bSlotType === 'color') {
      // Freeスロットと色スロットを比較
      const aIndex = getFreeSlotIndex()
      const bIndex = getColorSlotIndex(b)

      return aIndex - bIndex
    }

    // - 同じ色スロットの場合は遺物ID順
    // - 両方ともFreeスロットの場合は遺物ID順
    // - それ以外はID順
    return a.id.localeCompare(b.id)
  })

  return build
}
