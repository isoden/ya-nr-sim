import { solve, type Coefficients, type Constraint } from 'yalps'
import { type Relic } from '~/data/relics'
import { type Vessel } from '~/data/vessels'
import { createExclusionConstraints, createConstraints } from './constraints'
import { createExclusionVariables, createVariables } from './variables'


export type Build = {
	vessel: Vessel
	relics: Relic[]
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

export type RequiredEffects = Record<number, number>

/**
 * 検索パラメーターに合致する器と遺物の組み合わせを検索する
 *
 * TODO: Worker で実行する
 *
 * 整数線形計画法を使用して、以下の制約を満たすビルドを見つける：
 * - 器は1つだけ選択
 * - 遺物は最大3つまで装備
 * - 遺物は器のスロットの色と一致するか、Freeスロットに装備
 * - 指定された効果を指定された数以上持つ遺物を装備
 * - 同じ遺物は1つしか装備できない
 * - 重複するビルドは除外
 *
 * @param params - 検索パラメーター
 * @param relics - 所持遺物一覧
 */
export async function simulate({
	vessels,
	relics,
	requiredEffects,
	volume = 5,
}: {
	vessels: Vessel[]
	relics: Relic[]
	requiredEffects: RequiredEffects
	volume?: number
}): Promise<Result> {
	try {
		const variables = createVariables(vessels, relics)
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
 * solverを再帰的に呼び出す
 * 各再帰呼び出しで：
 * 1. 現在の制約で最適解を見つける
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

	const result = solve({ variables, constraints, integers: true })

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

/**
 * solverの結果の変数を実際のデータにマッピングしてビルドを作成する
 *
 * solverが返す変数の値（0 or 1）から、実際の器と遺物の組み合わせを作成
 */
function createBuild(variables: [string, number][], vessels: Vessel[], relics: Relic[]): Build {
	const build: Build = { vessel: null!, relics: [] }

	for (const [key, value] of variables) {
		if (value === 0) continue

		const [type, id] = key.split('.')

		switch (type) {
			case 'vessel':
				if (value === 1) {
					build.vessel = vessels.find((vessel) => vessel.id === id)!
				}
				break
			case 'relic':
				if (value === 1) {
					build.relics.push(relics.find((relic) => relic.id === id)!)
				}
				break
		}
	}

	return build
}
