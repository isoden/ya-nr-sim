import { equalTo, greaterEq, lessEq, solve, type Coefficients, type Constraint } from 'yalps'
import { RelicColor, type Relic } from '~/data/relics'
import { vesselsByCharacterMap, type Vessel } from '~/data/vessels'

export type Build = {
  vessel: Vessel
  relics: Relic[]
}

type Result = {
  success: true
  data: Build[]
} | {
  success: false
  error: Error
}

/**
 * 検索パラメーターに合致する器と遺物の組み合わせを検索する
 *
 * @param params - 検索パラメーター
 * @param relics - 所持遺物一覧
 */
export async function simulate(params: {
  character: string
  effects: { id: number; amount: number }[]
}, { relics }: { relics: Relic[] }): Promise<Result> {
  const baseVariables = new Map<string, Coefficients>()
  const baseConstraints = new Map<string, Constraint>()

  const vessels = vesselsByCharacterMap[params.character]!

  for (const vessel of vessels) {
    baseVariables.set(`vessel.${vessel.name}`, {
      vessel: 1,
      ...slotsToVariables(vessel)
    })
  }

  for (const relic of relics) {
    baseVariables.set(`relic.${relic.id}`, {
      relic: 1,
      [`relic.${relic.id}`]: 1,
      [`slot.${relic.color}`]: 1,
      ...relic.normalizedEffectIds.reduce<Record<string, number>>((acc, effectId) => {
        acc[`effectId.${effectId}`] ??= 0
        acc[`effectId.${effectId}`] += 1

        return acc
      }, {}),
    })

    // 仕様上の制約
    // - 同じ遺物は1つしか装備できない
    baseConstraints.set(`relic.${relic.id}`, lessEq(1))
  }

  // 検索対象の遺物効果の数を満たす制約
  for (const effect of params.effects) {
    baseConstraints.set(`effectId.${effect.id}`, greaterEq(effect.amount))
  }

  /**
   * 仕様上の制約
   * - 一度に選択できる器は1つまで
   * - 器に装備できる遺物は3つまで
   * - 器に装備できる遺物は、器のスロットの色と一致する遺物のみ
   */
  baseConstraints.set('vessel', equalTo(1))
  baseConstraints.set('relic', lessEq(3))
  baseConstraints.set(`slot.${RelicColor.Red}`, lessEq(0))
  baseConstraints.set(`slot.${RelicColor.Blue}`, lessEq(0))
  baseConstraints.set(`slot.${RelicColor.Green}`, lessEq(0))
  baseConstraints.set(`slot.${RelicColor.Yellow}`, lessEq(0))

  try {
    const builds = solveRecursively({
      remaining: 5,
      variables: baseVariables,
      constraints: baseConstraints,
      vessels,
      relics,
    })

    return {
      success: true,
      data: builds
    }
  } catch (error) {
    return {
      success: false,
      error: error as Error
    }
  }
}

/**
 * solverを再帰的に呼び出して、検索パラメーターに合致する器と遺物の組み合わせを検索する
 *
 * @param builds - 既に見つかったビルドの配列
 * @param remaining - 残りの検索回数
 * @param variables - 制約ソルバー用の変数
 * @param constraints - 制約ソルバー用の制約
 * @param vessels - 器一覧
 * @param relics - 所持遺物一覧
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

  const result = solve({ variables, constraints, integers: true })

  if (result.status === 'optimal') {
    const build = createBuild(result.variables, vessels, relics)
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
  }

  throw new Error('No solution found')
}
/**
 * solverの結果の変数を実際のデータにマッピングしてビルドを作成する
 *
 * @param variables - solveの結果の変数
 * @param vessels - 器
 * @param relics - 所持遺物
 */
function createBuild(variables: [string, number][], vessels: Vessel[], relics: Relic[]): Build {
  const solveData: Build = { vessel: null!, relics: [] }

  for (const [key] of variables) {
    const [type, id] = key.split('.')

    switch (type) {
      case 'vessel':
        solveData.vessel = vessels.find(vessel => vessel.name === id)!
        break
      case 'relic':
        solveData.relics.push(relics.find(relic => relic.id === id)!)
        break
      default:
        throw new Error(`Unknown variable: ${key}`)
    }
  }

  return solveData
}

/**
 * 現在のビルドに含まれる遺物を除外するための変数を作成する
 *
 * @param variables - 変数
 * @param relics - 遺物
 * @param buildId - ビルドID(実際には検索のインデックスが渡される)
 */
function createExclusionVariables(variables: Map<string, Coefficients>, relics: Relic[], buildId: number) {
  const nextVariables = new Map(variables)
  for (const relic of relics) {
    const relicVariables = nextVariables.get(`relic.${relic.id}`)!

    nextVariables.set(`relic.${relic.id}`, {
      ...relicVariables,
      [`buildId.${buildId}`]: 1,
    })
  }

  return nextVariables
}

/**
 * 現在のビルドに含まれる遺物を除外するための制約を作成する
 *
 * @param constraints - 制約
 * @param relics - 遺物
 * @param buildId - ビルドID(実際には検索のインデックスが渡される)
 */
function createExclusionConstraints(constraints: Map<string, Constraint>, relics: Relic[], buildId: number) {
  const nextConstraints = new Map(constraints)
  nextConstraints.set(`buildId.${buildId}`, lessEq(relics.length - 1))
  return nextConstraints
}

/**
 * 器のスロットを変数用のオブジェクトに変換する
 *
 * @param vessel - 器
 */
function slotsToVariables(vessel: Vessel): Coefficients {
  const obj = {
    [`slot.${RelicColor.Red}`]: 0,
    [`slot.${RelicColor.Blue}`]: 0,
    [`slot.${RelicColor.Green}`]: 0,
    [`slot.${RelicColor.Yellow}`]: 0,
  }

  vessel.slots.forEach(color => {
    // 自由枠のスロットは全ての色を選択できる扱いにする
    if (color === RelicColor.Free) {
      obj[`slot.${RelicColor.Red}`] -= 1
      obj[`slot.${RelicColor.Blue}`] -= 1
      obj[`slot.${RelicColor.Green}`] -= 1
      obj[`slot.${RelicColor.Yellow}`] -= 1
    }

    // それ以外のスロットはその色の遺物のみ選択できる
    else {
      obj[`slot.${color}`] -= 1
    }
  })

  return obj
}
