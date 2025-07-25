import { expect, test } from 'vitest'
import { parseQuerySchema } from './QuerySchema'
import { characterMap } from '~/data/characters'

test.each([
	[
		`charId=${characterMap.wylder.id}&effects[0][id]=7126000&effects[0][amount]=2&effects[1][id]=7082600&effects[1][amount]=1`,
		{
			charId: characterMap.wylder.id,
			effects: [
				{ id: 7126000, amount: 2 },
				{ id: 7082600, amount: 1 },
			],
		},
	],
])('%# パースに成功する', (input, expected) => {
	expect(parseQuerySchema(input)).toEqual(expected)
})
