import * as v from 'valibot'

export const FormSchema = v.looseObject({
	charId: v.string('キャラクター(献器)は必須です'),
	effects: v.pipe(
		v.array(
			v.object({
				id: v.number(),
				count: v.number(),
			}),
		),
		v.transform((effects) => effects.filter((effect) => effect.id !== 0)),
		v.minLength(1, '遺物効果は1つ以上選択してください'),
	),
})
