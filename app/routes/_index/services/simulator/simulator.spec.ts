import { expect, test, describe } from 'vitest'
import { vesselsByCharacterMap } from '~/data/vessels'
import { Relic, RelicColor } from '~/data/relics'
import { simulate } from './simulator'

describe("マッチするパターン", () => {
	test('マッチするパターン', async () => {
		const vessels = vesselsByCharacterMap['revenant']
		const relics = [
			mockRelic({ color: RelicColor.Red, effects: [7082600] }),
		]

		const result = await simulate({
			vessels,
			relics,
			requiredEffects: {
				[7082600]: 1,
			},
		})

		// assert: マッチするパターン
		expect(result).toEqual({
			success: true,
			data: [
				{
					vessel: vessels.find(v => v.name.includes("復讐者の盃")),
					relics: [relics[0]]
				},
			]
		})
	})

	describe("ビルドの遺物の並び順", () => {
		test('遺物を献器のスロットの色順に並べ替える', async () => {
			const vessels = vesselsByCharacterMap['ironeye']
				// 赤青黄の順の献器
				.filter(v => v.name.includes("鉄の目の盃"))
			const blue = mockRelic({ color: RelicColor.Blue, effects: [7126000] })
			const yellow = mockRelic({ color: RelicColor.Yellow, effects: [7126000] })
			const red = mockRelic({ color: RelicColor.Red, effects: [7126000] })
			const relics = [blue, yellow, red]

			const result = await simulate({
				vessels,
				relics,
				requiredEffects: { [7126000]: 3 },
			})

			// assert: 献器の色スロットの順番に並べ替える
			expect(result).toEqual({
				success: true,
				data: [
					{
						vessel: vessels[0],
						relics: [red, blue, yellow]
					},
				]
			})
		})

		test('自由枠は最後に並べ替える', async () => {
			const vessels = vesselsByCharacterMap['ironeye']
				// 赤緑白の順の献器
				.filter(v => v.name.includes("鉄の目の高杯"))
			const green = mockRelic({ color: RelicColor.Green, effects: [7126000] })
			const yellow = mockRelic({ color: RelicColor.Yellow, effects: [7126000] })
			const red = mockRelic({ color: RelicColor.Red, effects: [7126000] })
			const relics = [green, yellow, red]

			const result = await simulate({
				vessels,
				relics,
				requiredEffects: { [7126000]: 3 },
			})

			// assert: 自由枠は最後に並べ替える
			expect(result).toEqual({
				success: true,
				data: [
					{
						vessel: vessels[0],
						relics: [red, green, yellow]
					},
				]
			})
		})

		test('同じ色の遺物はID順に並べ替える', async () => {
			const vessels = vesselsByCharacterMap['ironeye']
				// 赤青黄の順の献器
				.filter(v => v.name.includes("黄金樹の聖杯"))
			const yellow1 = mockRelic({ id: '1', color: RelicColor.Yellow, effects: [7126000] })
			const yellow2 = mockRelic({ id: '2', color: RelicColor.Yellow, effects: [7126000] })
			const yellow3 = mockRelic({ id: '3', color: RelicColor.Yellow, effects: [7126000] })
			const relics = [yellow3, yellow1, yellow2]

			const result = await simulate({
				vessels,
				relics,
				requiredEffects: { [7126000]: 3 },
			})

			// assert: 遺物をID順に並べ替える
			expect(result).toEqual({
				success: true,
				data: [
					{
						vessel: vessels[0],
						relics: [yellow1, yellow2, yellow3]
					},
				]
			})
		})
	})
})

describe("マッチしないパターン", () => {
	test.each([2, 3])('同じ遺物を%d個選ぶと失敗する', async (count) => {
		const { vessels, relics, effectId } = setup()
		const result = await simulate({
			vessels,
			relics,
			requiredEffects: {
				[effectId]: count,
			},
		})

		expect(result.success).toBe(false)
	})

	function setup() {
		const effectId = 7126000
		const vessels = vesselsByCharacterMap['revenant']
		const relics = [
			mockRelic({ color: RelicColor.Blue, effects: [effectId] }),
		]

		return { vessels, relics, effectId }
	}
})

function mockRelic({
	id = Math.random().toString(36).substring(2, 15),
	color,
	effects,
	itemId = 1,
}: {
	id?: string
	color: RelicColor
	effects: number[]
	itemId?: number
}) {
	return Relic.new({
		id: `relic-${id}`,
		color,
		effects,
		itemId,
	})
}

