import { expect, test, describe } from 'vitest'
import { vesselsByCharacterMap } from '~/data/vessels'
import { Relic, RelicColor } from '~/data/relics'
import { simulate } from './simulator'

describe("マッチするパターン", () => {
	test('マッチするパターン', async () => {
		const vessels = vesselsByCharacterMap['revenant']
		const relics = [
			mockRelic({ id: '1', color: RelicColor.Red, effects: [7082600] }),
			mockRelic({ id: '2', color: RelicColor.Blue, effects: [7126000, 7126001, 7126002] }),
		]

		const result = await simulate({
			vessels,
			relics,
			requiredEffects: {
				[7082600]: 1,
				[7126000]: 3,
			},
		})

		expect(result).toEqual({
			success: true,
			data: [
				{
					vessel: vessels.find(v => v.name.includes("復讐者の高杯")),
					relics: [relics[0], relics[1]]
				},
			]
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

function mockRelic({ id = '1', color, effects, itemId = 1 }: { id?: string, color: RelicColor, effects: number[], itemId?: number }) {
	return Relic.new({
		id: `relic-${id}`,
		color,
		effects,
		itemId,
	})
}

