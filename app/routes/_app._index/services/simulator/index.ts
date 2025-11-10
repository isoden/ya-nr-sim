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
      sortedRelics: build.sortedRelics.map((relic) => (relic ? Relic.new(relic) : null)),
    }))
    return result
  }

  return result
}
