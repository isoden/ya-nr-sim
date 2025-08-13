import type { Route } from './+types/route'
import { vesselsByCharacterMap } from '~/data/vessels'
import { BuildList } from './components/BuildList'
import { SearchForm } from './components/SearchForm'
import { parseStringifiedRelicsSchema } from './schema/StringifiedRelicsSchema'
import { parseQuerySchema } from './schema/QuerySchema'
import { simulate } from './services/simulator'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'YA-ナイトレインビルドシミュレーター' }]
}

export const clientLoader = async ({ request }: Route.ClientLoaderArgs) => {
  const url = new URL(request.url)
  const params = parseQuerySchema(url.search.slice(1))

  const relics = parseStringifiedRelicsSchema(localStorage.getItem('relics'))

  if (!params) return { params: undefined, result: undefined }

  const vessels = vesselsByCharacterMap[params.charId]
  const requiredEffects = Object.entries(params.effects).map(([id, { count }]) => ({
    effectIds: id.split(',').map(Number),
    count,
  }))

  const resultPromise = simulate({
    vessels,
    relics,
    requiredEffects,
    volume: 50,
  })

  return { params, result: resultPromise }
}

export default function Home({ loaderData: { params, result } }: Route.ComponentProps) {
  return (
    <main className="grid grid-cols-2 min-h-0 gap-6">
      <SearchForm defaultValues={params} />
      <BuildList resultKey={JSON.stringify(params)} result={result} />
    </main>
  )
}
