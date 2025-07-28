import * as v from 'valibot'
import { RelicColor } from '~/data/relics'

export const StringifiedRelicsSchema = v.fallback(
	v.pipe(
		v.string(),
		v.transform((value) => JSON.parse(value)),
		v.array(
			v.object({
				id: v.string(),
				color: v.enum(RelicColor),
				effects: v.pipe(v.array(v.pipe(v.number(), v.integer())), v.minLength(1), v.maxLength(3)),
				itemId: v.pipe(v.number(), v.integer()),
			}),
		),
	),
	[],
)

export const parseStringifiedRelicsSchema = (value: string | null) => {
	return v.parse(StringifiedRelicsSchema, value)
}
