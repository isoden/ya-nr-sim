import { solve, type Coefficients, type Constraint } from 'yalps'
import { Relic } from '~/data/relics'
import { type Vessel } from '~/data/vessels'
import { createExclusionConstraints, createConstraints } from './constraints'
import { createExclusionVariables, createVariables } from './variables'
import { createBuild } from './createBuild'
import type { Args, Result, Build } from './types'

/**
 * 検索パラメーターに合致する器と遺物の組み合わせを検索する
 *
 * 整数線形計画法を使用して、以下の制約を満たすビルドを見つける：
 * - 器は1つだけ選択
 * - 遺物は最大3つまで装備
 * - 遺物は器のスロットの色と一致するか、Freeスロットに装備
 * - 指定された効果を指定された数以上持つ遺物を装備
 * - 同じ遺物は1つしか装備できない
 * - 重複するビルドは除外
 *
 * @param vessels - 器の一覧
 * @param relics - 所持遺物一覧（JSON形式）
 * @param requiredEffects - 必要な効果とその数
 * @param [volume=5] - 検索するビルド数
 */
export async function simulate({ vessels, relics: relicsJSON, requiredEffects, volume = 5 }: Args): Promise<Result> {
  try {
    const relics = relicsJSON.map((relic) => Relic.new(relic))
    const variables = createVariables(vessels, relics, requiredEffects)
    const constraints = createConstraints(vessels, relics, requiredEffects)
    const builds = solveRecursively({
      remaining: volume,
      variables,
      constraints,
      vessels,
      relics,
    })

    return {
      success: true,
      data: builds,
    }
  } catch (error) {
    return {
      success: false,
      error: error as Error,
    }
  }
}

/**
 * solverを再帰的に呼び出す（スコアベース最適化対応）
 * 各再帰呼び出しで：
 * 1. 現在の制約でスコア最大化の最適解を見つける
 * 2. 見つかったビルドを結果に追加
 * 3. 重複排除の制約を追加して再帰呼び出し
 * 4. 解が見つからなくなるまで(or remainingが0になるまで)繰り返す
 */
function solveRecursively({
  builds = [],
  remaining,
  variables,
  constraints,
  vessels,
  relics,
}: {
  builds?: Build[]
  remaining: number
  variables: Map<string, Coefficients>
  constraints: Map<string, Constraint>
  vessels: Vessel[]
  relics: Relic[]
}): Build[] {
  if (remaining === 0) return builds

  const result = solve({
    direction: 'maximize',
    objective: 'score',
    constraints,
    variables,
    integers: true,
  })

  if (result.status === 'optimal') {
    const build = createBuild(result.variables, vessels, relics)

    // 重複排除の制約を追加（remainingをビルドIDとして使用）
    // 既存の変数と制約に新しい制約を追加
    const updatedVariables = createExclusionVariables(variables, build.relics, remaining)
    const updatedConstraints = createExclusionConstraints(constraints, build.relics, remaining)

    return solveRecursively({
      builds: [...builds, build],
      remaining: remaining - 1,
      variables: updatedVariables,
      constraints: updatedConstraints,
      vessels,
      relics,
    })
  } else if (result.status === 'infeasible') {
    if (builds.length > 0) return builds
  }

  throw new Error('No solution found')
}
