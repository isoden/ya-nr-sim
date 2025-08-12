import { wrap } from 'comlink'
import { Relic } from '~/data/relics'

import { type Args } from './types'
import Worker from './worker?worker'

export async function simulate(args: Args) {
	const simulate = wrap<import('./worker').WorkerAPI>(new Worker())
	const result = await simulate(args)

	if (result.success) {
		result.data = result.data.map((build) => ({
			...build,
			relics: build.relics.map((relic) => Relic.new(relic)),
		}))
		return result
	}

	return result
}
