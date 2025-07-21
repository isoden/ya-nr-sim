import type { Route } from './+types/route'
import { BuildList } from './components/BuildList'
import { SearchForm } from './components/SearchForm'
import { simulate } from './services/simulator'
import { parseQuerySchema } from './schema/QuerySchema'
import { Relic } from '~/data/relics'

export function meta({}: Route.MetaArgs) {
	return [{ title: 'YA-NR SIM' }]
}

export const clientLoader = async ({ request }: Route.ClientLoaderArgs) => {
	const url = new URL(request.url)
	const params = parseQuerySchema(url.search.slice(1))

	// FIXME: 型安全にする
	const relics = (JSON.parse(localStorage.getItem('relics') ?? '[]') as any[]).map((item: any) => Relic.new(item))
	const result = await simulate(params, { relics })

	return { params, result, relicsCount: relics.length }
}

export default function Home({ loaderData: { params, result, relicsCount } }: Route.ComponentProps) {
	return (
		<div className="max-w-4xl px-4 mx-auto pb-20">
			<h1 className="text-2xl font-bold py-10">ナイトレインビルドシミュレーター</h1>
			<SearchForm defaultValues={params} relicsCount={relicsCount} />
			{result.success && <BuildList builds={result.data} />}
		</div>
	)
}
