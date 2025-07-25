import { expect, test } from 'vitest'
import { simulate } from './simulator'

test('should work', async () => {
	const result = await simulate({
		vessels: [],
		relics: [],
		requiredEffects: [],
	})

	expect(result).toBeDefined()
})
