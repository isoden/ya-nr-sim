import * as v from 'valibot'

const CharIdRequired = 'キャラクター(献器)を選択してください'
const EffectsRequired = '効果は1つ以上選択してください'

export type FormSchema = v.InferOutput<typeof FormSchema>
export const FormSchema = v.object(
	{
		charId: v.string(CharIdRequired),
		effects: v.pipe(
			v.record(
				v.string(),
				v.object({
					count: v.pipe(v.string(), v.transform(Number), v.integer(), v.minValue(1), v.maxValue(3)),
				}),
			),
			v.check((value) => Object.keys(value).length > 0, EffectsRequired),
		),
	},
	(issue) => (issue.expected === '"effects"' && issue.received === 'undefined' ? EffectsRequired : issue.message),
)
