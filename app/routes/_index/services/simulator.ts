import { equalTo, greaterEq, lessEq, solve, type Coefficients, type Constraint } from 'yalps'
import { RelicColor, type Relic } from '~/data/relics'
import { SlotColor, type Vessel } from '~/data/vessels'

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
 * 変数を作成する
 *
 * 整数線形計画の変数を定義：
 * - 器の変数: どの器を選択するか（0 or 1）
 * - 遺物の変数: どの遺物を装備するか（0 or 1）
 *
 * 各変数は制約を表現する係数を持つ：
 * - 器の変数: スロット制約の係数（負の値）
 * - 遺物の変数: スロット制約の係数（正の値）、効果制約の係数
 */
function createVariables(vessels: Vessel[], relics: Relic[]): Map<string, Coefficients> {
	const variables = new Map<string, Coefficients>()

	// 器の変数を作成
	// 各器について、選択された場合の制約を定義
	for (const vessel of vessels) {
		const vesselVars: Record<string, number> = {
			vessel: 1, // 器の選択制約用
		}

		// 各色のスロット数をカウント
		// Freeスロットは独立した制約として扱う
		const redSlots = vessel.slots.filter((slot) => slot === SlotColor.Red).length
		const blueSlots = vessel.slots.filter((slot) => slot === SlotColor.Blue).length
		const greenSlots = vessel.slots.filter((slot) => slot === SlotColor.Green).length
		const yellowSlots = vessel.slots.filter((slot) => slot === SlotColor.Yellow).length
		const freeSlots = vessel.slots.filter((slot) => slot === SlotColor.Free).length

		// 各色のスロット制約を設定
		// 器が選択された場合、その色のスロット数分だけ負の係数を設定
		if (redSlots > 0) {
			vesselVars[`slot.${RelicColor.Red}`] = -redSlots
		}
		if (blueSlots > 0) {
			vesselVars[`slot.${RelicColor.Blue}`] = -blueSlots
		}
		if (greenSlots > 0) {
			vesselVars[`slot.${RelicColor.Green}`] = -greenSlots
		}
		if (yellowSlots > 0) {
			vesselVars[`slot.${RelicColor.Yellow}`] = -yellowSlots
		}

		// Freeスロット制約を設定
		// Freeスロットは独立した制約として扱い、どの色の遺物でも装備可能
		if (freeSlots > 0) {
			vesselVars[`freeSlot.${vessel.id}`] = -freeSlots
		}

		variables.set(`vessel.${vessel.id}`, vesselVars)
	}

	// 遺物の変数を作成
	// 各遺物について、装備された場合の制約を定義
	for (const relic of relics) {
		const relicVars: Record<string, number> = {
			relic: 1, // 遺物の選択制約用
			[`relic.${relic.id}`]: 1, // 同じ遺物の重複防止用
		}

		// 色スロット制約（該当する色のスロットがある場合のみ）
		// 遺物の色と一致するスロットがある器が選択された場合のみ装備可能
		const hasMatchingSlot = vessels.some((vessel) => vessel.slots.includes(relic.color))
		if (hasMatchingSlot) {
			relicVars[`slot.${relic.color}`] = 1
		}

		// Freeスロット制約（色スロットがない場合のみ）
		// 遺物の色と一致するスロットがない場合、Freeスロットに装備可能
		if (!hasMatchingSlot) {
			for (const vessel of vessels) {
				const freeSlotCount = vessel.slots.filter((slot) => slot === SlotColor.Free).length
				if (freeSlotCount > 0) {
					relicVars[`freeSlot.${vessel.id}`] = 1
				}
			}
		}

		// 効果制約
		// 遺物が持つ効果を制約に反映
		for (const effectId of relic.normalizedEffectIds) {
			// 遺物に同じ効果が複数設定されている場合もあるため、 0 初期化してから加算する
			relicVars[`effect.${effectId}`] ??= 0
			relicVars[`effect.${effectId}`] += 1
		}

		variables.set(`relic.${relic.id}`, relicVars)
	}

	return variables
}

/**
 * 制約を作成する
 *
 * 整数線形計画の制約を定義：
 * - 器の選択制約: 1つの器のみ選択
 * - 遺物数制約: 最大3つまで装備
 * - スロット制約: 各色のスロット数制限
 * - Freeスロット制約: Freeスロット数制限
 * - 効果制約: 指定された効果を指定された数以上
 * - 重複防止制約: 同じ遺物は1つしか装備できない
 */
function createConstraints(
	vessels: Vessel[],
	relics: Relic[],
	requiredEffects: RequiredEffects,
): Map<string, Constraint> {
	const constraints = new Map<string, Constraint>()

	// 器の選択制約（1つの器のみ選択）
	constraints.set('vessel', equalTo(1))

	// 遺物数制約（最大3つまで）
	constraints.set('relic', lessEq(3))

	// 各色のスロット制約
	// 各色の遺物数 ≤ その色のスロット数
	constraints.set(`slot.${RelicColor.Red}`, lessEq(0))
	constraints.set(`slot.${RelicColor.Blue}`, lessEq(0))
	constraints.set(`slot.${RelicColor.Green}`, lessEq(0))
	constraints.set(`slot.${RelicColor.Yellow}`, lessEq(0))

	// Freeスロット制約
	// Freeスロットに装備された遺物数 ≤ Freeスロット数
	for (const vessel of vessels) {
		const freeSlotCount = vessel.slots.filter((slot) => slot === SlotColor.Free).length
		if (freeSlotCount > 0) {
			constraints.set(`freeSlot.${vessel.id}`, lessEq(0))
		}
	}

	// 効果制約（指定された数以上）
	// 各効果について、その効果を持つ遺物の合計 ≥ 指定された数
	for (const [effectId, count] of Object.entries(requiredEffects)) {
		constraints.set(`effect.${effectId}`, greaterEq(count))
	}

	// 同じ遺物は1つしか装備できない
	for (const relic of relics) {
		constraints.set(`relic.${relic.id}`, lessEq(1))
	}

	return constraints
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

/**
 * 現在のビルドに含まれる遺物を除外するための変数を作成する
 *
 * 重複排除のため、既に選択された遺物の組み合わせを除外する制約を追加
 *
 * @param variables - 既存の変数Map
 * @param relics - 選択された遺物
 * @param buildId - ビルドID（重複排除の識別子）
 */
function createExclusionVariables(
	variables: Map<string, Coefficients>,
	relics: Relic[],
	buildId: number,
): Map<string, Coefficients> {
	const nextVariables = new Map(variables)

	// 選択された遺物にbuildIdを追加
	// この遺物が選択された場合、buildId制約にカウントされる
	for (const relic of relics) {
		const relicVariable = nextVariables.get(`relic.${relic.id}`)!

		nextVariables.set(`relic.${relic.id}`, {
			...relicVariable,
			[`buildId.${buildId}`]: 1,
		})
	}

	return nextVariables
}

/**
 * 現在のビルドに含まれる遺物を除外するための制約を作成する
 *
 * 重複排除のため、既に選択された遺物の組み合わせ全体を除外する制約を追加
 *
 * @param constraints - 既存の制約Map
 * @param relics - 選択された遺物
 * @param buildId - ビルドID（重複排除の識別子）
 */
function createExclusionConstraints(
	constraints: Map<string, Constraint>,
	relics: Relic[],
	buildId: number,
): Map<string, Constraint> {
	const nextConstraints = new Map(constraints)

	// このビルドで使用した遺物の組み合わせを除外
	// buildId制約の合計 ≤ 遺物数 - 1 により、全ての遺物が同時に選択されることを防ぐ
	nextConstraints.set(`buildId.${buildId}`, lessEq(relics.length - 1))

	return nextConstraints
}
