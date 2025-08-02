import type { Relic } from '~/data/relics'

/**
 * 上位互換遺物の効果IDとその下位互換の効果IDのマッピング
 */
const upperRelicEffectMap: Record<number, number[]> = {
	// // 生命力
	// [7000002]: [7000001, 7000000],
	// [7000001]: [7000000],
	// // 精神力
	// [7000102]: [7000101, 7000100],
	// [7000101]: [7000100],
	// // 持久力
	// [7000202]: [7000201, 7000200],
	// [7000201]: [7000200],
	// // 筋力
	// [7000302]: [7000301, 7000300],
	// [7000301]: [7000300],
	// // 技量
	// [7000402]: [7000401, 7000400],
	// [7000401]: [7000400],
	// // 知力
	// [7000502]: [7000501, 7000500],
	// [7000501]: [7000500],
	// // 信仰
	// [7000602]: [7000601, 7000600],
	// [7000601]: [7000600],
	// // 神秘
	// [7000702]: [7000701, 7000700],
	// [7000701]: [7000700],
	// // スキルクールタイム軽減
	// [7000802]: [7000801, 7000800],
	// [7000801]: [7000800],
	// // アーツゲージ蓄積増加
	// 7000902: [7000901, 7000900],
	// 7000901: [7000900],
}

/**
 * 渡された遺物のリストから互換性のある遺物の組み合わせを見つけ、
 * 上位互換遺物とその下位互換遺物のリストをエントリー形式で返す。
 *
 * ## 互換性の定義
 * 下位互換遺物を A、上位互換遺物を B とする。
 * - A と B は同じ色である
 * - A の効果は B の効果のサブセットまたは等しい
 * - upperRelicEffectMap で定義された上位互換効果も考慮される
 * - ignoreEffectIds に含まれる効果は比較から除外される
 * - ignoreRelicIds に含まれる遺物は下位互換候補から除外される
 *
 * ## 例
 * ### ケース1: 基本的な下位互換
 * - A: RelicColor.Red, effectIds [1, 3]
 * - B: RelicColor.Red, effectIds [1, 2, 3]
 * - 結果: A は B の下位互換
 *
 * ### ケース2: ignoreEffectIds あり
 * - A: RelicColor.Red, effectIds [1, 3]
 * - B: RelicColor.Red, effectIds [1, 2, 3]
 * - ignoreEffectIds: [2]
 * - 結果: A は B の下位互換（効果2は無視される）
 *
 * ### ケース3: upperRelicEffectMap を使用した互換性
 * - A: RelicColor.Red, effectIds [7000000] (生命力+1)
 * - B: RelicColor.Red, effectIds [7000002] (生命力+3)
 * - 結果: A は B の下位互換（upperRelicEffectMapで7000002が[7000001, 7000000]を含むため）
 *
 * @param relics - 遺物のリスト
 * @param options - オプション
 * @param options.ignoreEffectIds - 比較から除外する効果IDのリスト
 * @param options.ignoreRelicIds - 下位互換候補から除外する遺物IDのリスト
 * @returns 互換性のある遺物のエントリー配列。各エントリーは[0]に下位互換遺物、[1]に上位互換遺物を含む
 */
export function findCompatibleRelics(
	relics: Relic[],
	{
		ignoreEffectIds = [],
		ignoreRelicIds = [],
	}: {
		ignoreEffectIds?: number[]
		ignoreRelicIds?: string[]
	} = {},
): [Relic, Relic][] {
	const compatibleMap: Map<string, Relic> = new Map()

	// 各遺物について、他の遺物との互換性をチェック
	for (let i = 0; i < relics.length; i++) {
		const lowerCandidate = relics[i]

		// ignoreRelicIds に含まれる遺物はスキップ
		if (ignoreRelicIds.includes(lowerCandidate.id)) continue

		for (let j = 0; j < relics.length; j++) {
			if (i === j) continue // 同じ遺物はスキップ

			const upperCandidate = relics[j]

			// 同じ色でない場合はスキップ
			if (lowerCandidate.color !== upperCandidate.color) continue

			// lowerCandidateがupperCandidateの下位互換性があるかチェック
			if (isCompatible(lowerCandidate, upperCandidate, ignoreEffectIds)) {
				// 既に登録されている上位互換よりも効果数が多い場合は更新
				const currentUpper = compatibleMap.get(lowerCandidate.id)
				if (!currentUpper || upperCandidate.normalizedEffectIds.length > currentUpper.normalizedEffectIds.length) {
					compatibleMap.set(lowerCandidate.id, upperCandidate)
				}
			}
		}
	}

	// [下位互換遺物, 上位互換遺物] のペア配列に変換
	return Array.from(compatibleMap.entries()).map(([lowerId, upperRelic]) => {
		const lowerRelic = relics.find((r) => r.id === lowerId)!
		return [lowerRelic, upperRelic]
	})
}

/**
 * relicAがrelicBの下位互換かどうかをチェックする
 *
 * @param relicA - 下位互換候補の遺物
 * @param relicB - 上位互換候補の遺物
 * @param ignoreEffectIds - 比較から除外する効果IDのリスト
 * @returns relicAがrelicBの下位互換の場合true
 */
function isCompatible(relicA: Relic, relicB: Relic, ignoreEffectIds: number[]): boolean {
	// 正規化された効果IDを取得
	const effectsA = relicA.normalizedEffectIds.filter((id) => !ignoreEffectIds.includes(id))
	const effectsB = relicB.normalizedEffectIds.filter((id) => !ignoreEffectIds.includes(id))

	// relicAの全ての効果がrelicBに含まれているか、またはupperRelicEffectMapで互換性があるかチェック
	return (
		effectsA.length <= effectsB.length &&
		effectsA.every((effectId) => {
			// 直接含まれている場合
			if (effectsB.includes(effectId)) {
				return true
			}

			// upperRelicEffectMapで上位互換効果があるかチェック
			return effectsB.some((upperEffectId) => {
				const lowerEffects = upperRelicEffectMap[upperEffectId as keyof typeof upperRelicEffectMap]
				return lowerEffects && lowerEffects.includes(effectId)
			})
		})
	)
}
