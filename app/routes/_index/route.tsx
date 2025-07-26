import type { Route } from './+types/route'
import { vesselsByCharacterMap } from '~/data/vessels'
import { ImportDialog } from './components/ImportDialog'
import { BuildList } from './components/BuildList'
import { SearchForm } from './components/SearchForm'
import { parseStringifiedRelicsSchema } from './schema/StringifiedRelicsSchema'
import { parseQuerySchema } from './schema/QuerySchema'
import { simulate } from './services/simulator'

export function meta({}: Route.MetaArgs) {
	return [{ title: 'YA-NR SIM' }]
}

export const clientLoader = async ({ request }: Route.ClientLoaderArgs) => {
	const url = new URL(request.url)
	const params = parseQuerySchema(url.search.slice(1))

	const relics = parseStringifiedRelicsSchema(localStorage.getItem('relics'))

	if (!params) return { params: undefined, result: undefined, relicsCount: relics.length }

	const vessels = vesselsByCharacterMap[params.charId]
	const requiredEffects = Object.fromEntries(params.effects.map((effect) => [effect.id, effect.amount]))

	const resultPromise = simulate({
		vessels,
		relics,
		requiredEffects,
		volume: 50,
	})

	return { params, result: resultPromise, relicsCount: relics.length }
}

export default function Home({ loaderData: { params, result, relicsCount } }: Route.ComponentProps) {
	return (
		<div className="bg-zinc-900 h-screen gap-6 p-8 grid grid-cols-2 grid-rows-[auto_1fr]">
			<header className="col-start-1 row-start-1 flex justify-between items-center">
				<h1 className="text-xl font-bold">ナイトレインビルドシミュレーター</h1>
				<ImportDialog relicsCount={relicsCount} />
			</header>
			<SearchForm defaultValues={params} />
			<BuildList resultKey={JSON.stringify(params)} result={result} />
		</div>
	)
}
