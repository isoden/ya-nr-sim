import { solve, type Coefficients, type Constraint } from 'yalps'
import { Relic } from '~/data/relics'
import { type Vessel } from '~/data/vessels'
import { createExclusionConstraints, createConstraints, normalizeRequiredEffects } from './constraints'
import { createExclusionVariables, createVariables } from './variables'
import { createBuild } from './createBuild'
import { satisfiesCategoryConstraints } from './categoryFilter'
import type { Args, Result, Build, RequiredEffects } from './types'

/**
 * 検索パラメーターに合致する器と遺物の組み合わせを検索する
 *
 * 整数線形計画法を使用して、以下の制約を満たすビルドを見つける：
 * - 器は1つだけ選択
 * - 遺物は3-6つまで装備
 * - 遺物は器のスロットの色と一致するか、Freeスロットに装備
 * - 指定された効果を指定された数以上持つ遺物を装備
 * - 同じ遺物は1つしか装備できない
 * - 重複するビルドは除外
 * さらに、以下の制約をアプリケーション側でチェックする：
 * - カテゴリ制約: 同じカテゴリの効果は左側のスロット優先(戦技など) {@link satisfiesCategoryConstraints}
 *
 * @param vessels - 器の一覧
 * @param relics - 所持遺物一覧（JSON形式）
 * @param requiredEffects - 必要な効果とその数
 * @param notEffects - 装備したくない効果のID一覧
 * @param excludeDepthsRelics - 深層遺物を除外するかどうか
 * @param [volume=5] - 検索するビルド数
 */
export async function simulate({ vessels, relics: relicsJSON, requiredEffects, notEffects, excludeDepthsRelics, volume = 5 }: Args): Promise<Result> {
  try {
    const relics = relicsJSON.reduce<Relic[]>((acc, r) => {
      const relic = Relic.new(r)
      const hasNotEffect = relic.normalizedEffectIds.some((effectId) => notEffects.includes(effectId))

      return (hasNotEffect || (excludeDepthsRelics && r.dn)) ? acc : acc.concat(relic)
    }, [])
    const normalizedRequiredEffects = normalizeRequiredEffects(requiredEffects)
    const variables = createVariables(vessels, relics, normalizedRequiredEffects)
    const constraints = createConstraints(vessels, relics, normalizedRequiredEffects)
    const builds = solveRecursively({
      remaining: volume,
      variables,
      constraints,
      vessels,
      relics,
      requiredEffects: normalizedRequiredEffects,
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
 * 2. 見つかったビルドがカテゴリ制約を満たすかチェック
 * 3. 満たす場合は結果に追加、満たさない場合は除外して次を探す
 * 4. 重複排除の制約を追加して再帰呼び出し
 * 5. 解が見つからなくなるまで(or remainingが0になるまで)繰り返す
 */
function solveRecursively({
  builds = [],
  remaining,
  variables,
  constraints,
  vessels,
  relics,
  requiredEffects,
}: {
  builds?: Build[]
  remaining: number
  variables: Map<string, Coefficients>
  constraints: Map<string, Constraint>
  vessels: Vessel[]
  relics: Relic[]
  requiredEffects: RequiredEffects
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

    // カテゴリ制約をチェック
    const satisfiesCategory = satisfiesCategoryConstraints(build, requiredEffects)

    // 重複排除の制約を追加（remainingをビルドIDとして使用）
    // 既存の変数と制約に新しい制約を追加
    // sortedRelicsからnullを除外して遺物リストを取得
    const buildRelics = build.sortedRelics.filter((r): r is Relic => r !== null)
    const updatedVariables = createExclusionVariables(variables, buildRelics, remaining)
    const updatedConstraints = createExclusionConstraints(constraints, buildRelics, remaining)

    if (satisfiesCategory) {
      // カテゴリ制約を満たす場合、ビルドを追加して次を探す
      return solveRecursively({
        builds: [...builds, build],
        remaining: remaining - 1,
        variables: updatedVariables,
        constraints: updatedConstraints,
        vessels,
        relics,
        requiredEffects,
      })
    } else {
      // カテゴリ制約を満たさない場合、このビルドを除外して次を探す
      // remainingは減らさない（有効なビルド数を確保するため）
      return solveRecursively({
        builds,
        remaining,
        variables: updatedVariables,
        constraints: updatedConstraints,
        vessels,
        relics,
        requiredEffects,
      })
    }
  } else if (result.status === 'infeasible') {
    if (builds.length > 0) return builds
  }

  throw new Error('No solution found')
}
