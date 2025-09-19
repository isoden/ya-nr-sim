import type { Relic, RelicJSON } from '~/data/relics'
import type { Vessel } from '~/data/vessels'

export type Build = {
  vessel: Vessel
  relics: Relic[]
  relicsIndexes: { [id: Relic['id']]: number }
}

export type Args = {
  /** 所持献器一覧 */
  vessels: Vessel[]
  /** 所持遺物一覧 */
  relics: RelicJSON[]
  /** 必要効果 */
  requiredEffects: RequiredEffects
  /** ビルド数 */
  volume?: number
}

export type Result =
  | {
      success: true
      data: Build[]
    }
  | {
      success: false
      error: Error
    }

export type RequiredEffects = {
  effectIds: number[]
  count: number
}[]
