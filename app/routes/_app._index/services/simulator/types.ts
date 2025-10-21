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
  /** シミュレーションから深層の遺物を除外するかどうか */
  excludeDepthsRelics: boolean
  /** ビルド数 */
  volume?: number
}

export type Result
  = | {
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
  weights?: number[] // effectIds に対応する重み（降順: 高効果 > 低効果）
}[]

// 後方互換性のため
export type WeightedRequiredEffects = RequiredEffects
