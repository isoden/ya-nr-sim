import type { Route } from './+types/route'
import { vesselsByCharacterMap } from '~/data/vessels'
import { useRelicsStore } from '~/store/relics'
import { BuildList } from './components/BuildList'
import { SearchForm } from './components/SearchForm'
import { parseQuerySchema } from './schema/QuerySchema'
import { simulate } from './services/simulator'

export const meta: Route.MetaFunction = () => {
  return [{ title: 'YA-ナイトレインビルドシミュレーター' }]
}

export const clientLoader = async ({ request }: Route.ClientLoaderArgs) => {
  const url = new URL(request.url)
  const params = parseQuerySchema(url.search.slice(1))

  const relics = useRelicsStore.getState().relics

  if (!params) return { params: undefined, result: undefined }

  const { charId, effects, excludeDepthsRelics } = params

  const vessels = vesselsByCharacterMap[charId]
  const requiredEffects = Object.entries(effects).map(([id, { count }]) => ({
    effectIds: id.split(',').map(Number),
    count,
    weights: id.split(',').map((_, i) => i ** 2 + 1),
  }))

  const resultPromise = simulate({
    vessels,
    relics,
    requiredEffects,
    excludeDepthsRelics,
    volume: 50,
  })

  return { params, result: resultPromise }
}

export default function Home({ loaderData: { params, result } }: Route.ComponentProps) {
  return (
    <main className="grid min-h-0 grid-cols-2 gap-6">
      <SearchForm defaultValues={params} />
      <BuildList resultKey={JSON.stringify(params)} excludeDepthsRelics={params?.excludeDepthsRelics} result={result} />
    </main>
  )
}
