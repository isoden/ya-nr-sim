import * as v from 'valibot'
import { set } from 'es-toolkit/compat'
import { characterMap } from '~/data/characters'

const QuerySchema = v.object({
	charId: v.picklist([
		characterMap.wylder.id,
		characterMap.guardian.id,
		characterMap.ironeye.id,
		characterMap.duchess.id,
		characterMap.raider.id,
		characterMap.revenant.id,
		characterMap.recluse.id,
		characterMap.executor.id,
	]),
	effects: v.pipe(
		v.array(
			v.object({
				id: v.pipe(v.string(), v.transform(Number), v.number(), v.integer()),
				count: v.pipe(v.string(), v.transform(Number), v.number(), v.integer(), v.minValue(1), v.maxValue(3)),
			}),
		),
		v.transform((effects) => effects.filter((effect) => effect.id !== 0)),
	),
})

export const parseQuerySchema = (search: string) => {
	try {
		const parsed = Array.from(new URLSearchParams(search)).reduce(
			(acc, [key, value]) => set(acc, key, value),
			Object.create(null),
		)
		return v.parse(QuerySchema, parsed)
	} catch {
		return undefined
	}
}
