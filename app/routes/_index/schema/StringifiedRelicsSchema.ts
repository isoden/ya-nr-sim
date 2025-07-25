import z from 'zod'
import { RelicColor } from '~/data/relics'

export const StringifiedRelicsSchema = z
	.string()
	.transform((value) => JSON.parse(value))
	.pipe(
		z.array(
			z.object({
				id: z.string(),
				color: z.enum([RelicColor.Red, RelicColor.Blue, RelicColor.Green, RelicColor.Yellow]),
				effects: z.array(z.number().int()).min(1).max(3),
				itemId: z.number().int(),
			}),
		),
	)
	.catch(() => [])

export const parseStringifiedRelicsSchema = (value: string | null) => {
	return StringifiedRelicsSchema.parse(value)
}
