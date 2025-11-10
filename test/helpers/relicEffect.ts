import { invariant } from 'es-toolkit'
import { relicEffectMap } from '~/data/relicEffects'

/**
 * 遺物効果名を効果IDに変換するユーティリティ関数
 *
 * @param exactName - 効果名
 */
export function toEffectId(exactName: TemplateStringsArray): number {
  const name = String.raw({ raw: exactName })
  const result = Object.entries(relicEffectMap).find(([, effect]) => effect.name === name)

  invariant(result, `Effect "${name}" not found`)

  return Number(result[0])
}

// alias
export const $e = toEffectId
