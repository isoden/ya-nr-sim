import { invariant } from 'es-toolkit'
import type { Relic } from '~/data/relics'
import { SlotColor, type Vessel } from '~/data/vessels'
import type { Build } from './types'

const enum SlotType {
  Color = 'color',
  Free = 'free',
}

/**
 * solverの結果の変数を実際のデータにマッピングしてビルドを作成する
 *
 * solverが返す変数の値（0 or 1）から、実際の器と遺物の組み合わせを作成
 */
export function createBuild(variables: [string, number][], vessels: Vessel[], relics: Relic[]): Build {
  const build: Build = { vessel: null!, sortedRelics: [] }

  // 遺物とそのスロットタイプの情報を収集
  const relicSlotMap = new Map<Relic['id'], SlotType>()
  const buildRelics: Relic[] = []

  for (const [key, value] of variables) {
    if (value === 0) continue

    const parts = key.split('.')

    switch (parts[0]) {
      case 'vessel':
        if (value === 1) {
          const vessel = vessels.find((vessel) => vessel.id === parts[1])

          invariant(vessel, `Vessel with id ${parts[1]} not found`)

          build.vessel = vessel
          build.sortedRelics = new Array(vessel.slots.length).fill(null)
        }
        break
      case 'relic':
        if (value === 1 && parts.length >= 3) {
          // relic.{id}.color or relic.{id}.free
          const relicId = parts[1]
          const slotType = parts[2] as SlotType
          const relic = relics.find((r) => r.id === relicId)
          if (relic && !buildRelics.some((r) => r.id === relicId)) {
            buildRelics.push(relic)
            // 実際のスロットタイプを判定する
            // 色スロットとして指定されているが、献器にその色がない場合はFreeスロットとして扱う
            let actualSlotType = slotType
            if (slotType === SlotType.Color && build.vessel && !build.vessel.slots.includes(relic.colorExtended)) {
              actualSlotType = SlotType.Free
            }
            relicSlotMap.set(relicId, actualSlotType)
          }
        }
        break
    }
  }

  // buildRelicsをスロット順にソート
  buildRelics.sort((a, b) => {
    const aSlotType = relicSlotMap.get(a.id)!
    const bSlotType = relicSlotMap.get(b.id)!
    const aColor = aSlotType === SlotType.Free ? SlotColor.Free : a.colorExtended
    const bColor = bSlotType === SlotType.Free ? SlotColor.Free : b.colorExtended

    // スロットインデックスで比較（左から右へ）
    const aSlotIndex = build.vessel.slots.indexOf(aColor)
    const bSlotIndex = build.vessel.slots.indexOf(bColor)

    if (aSlotIndex !== bSlotIndex) {
      return aSlotIndex - bSlotIndex
    }

    // 同じスロット位置の場合はID順
    return a.id.localeCompare(b.id)
  })

  // 各色・Freeスロットのインデックスを追跡
  const colorIndexMap = new Map<SlotColor, number>()

  // ソート済みのbuildRelicsをスロット順に配置
  for (const relic of buildRelics) {
    const slotType = relicSlotMap.get(relic.id)
    const targetColor = slotType === SlotType.Free ? SlotColor.Free : relic.colorExtended

    // その色の次の空きスロットを探す
    const startIndex = colorIndexMap.get(targetColor) ?? 0
    for (let i = startIndex; i < build.vessel.slots.length; i++) {
      if (build.vessel.slots[i] === targetColor && build.sortedRelics[i] === null) {
        build.sortedRelics[i] = relic
        colorIndexMap.set(targetColor, i + 1)
        break
      }
    }
  }

  return build
}
