import type { Route } from './+types/route'
import { BuildList } from './components/BuildList'
import { SearchForm } from './components/SearchForm'
import { simulate } from './services/simulator'
import { parseQuerySchema } from './schema/QuerySchema'
import { Relic } from '~/data/relics'
import { ImportDialog } from './components/ImportDialog'

export function meta({}: Route.MetaArgs) {
	return [{ title: 'YA-NR SIM' }]
}

export const clientLoader = async ({ request }: Route.ClientLoaderArgs) => {
	const url = new URL(request.url)
	const params = parseQuerySchema(url.search.slice(1))

	// FIXME: 型安全にする
	const relics = (JSON.parse(localStorage.getItem('relics') ?? '[]') as any[]).map((item: any) => Relic.new(item))

	if (!params) return { params: undefined, result: undefined, relicsCount: relics.length }

	const result = await simulate(params, { relics })

	return { params, result, relicsCount: relics.length }
}

export default function Home({ loaderData: { params, result, relicsCount } }: Route.ComponentProps) {
	return (
		<div className="bg-zinc-900 h-screen gap-6 p-8 grid grid-cols-2 grid-rows-[auto_1fr]">
			<header className="col-start-1 row-start-1 flex justify-between items-center">
				<h1 className="text-xl font-bold">ナイトレインビルドシミュレーター</h1>
				<ImportDialog relicsCount={relicsCount} />
			</header>
			<SearchForm defaultValues={params} />
			<BuildList result={result} />
		</div>
	)
}
