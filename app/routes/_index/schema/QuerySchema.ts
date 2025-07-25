import { parse } from 'qs'
import z from 'zod'
import { characterMap } from '~/data/characters'

const QuerySchema = z.object({
	charId: z.enum([
		characterMap.wylder.id,
		characterMap.guardian.id,
		characterMap.ironeye.id,
		characterMap.duchess.id,
		characterMap.raider.id,
		characterMap.revenant.id,
		characterMap.recluse.id,
		characterMap.executor.id,
	]),
	effects: z
		.array(
			z.object({
				id: z.coerce.number().int(),
				amount: z.coerce.number().int().min(1).max(3),
			}),
		)
		.transform((effects) => effects.filter((effect) => effect.id !== 0)),
})

export const parseQuerySchema = (search: string) => {
	try {
		return QuerySchema.parse(parse(search))
	} catch {
		return undefined
	}
}
