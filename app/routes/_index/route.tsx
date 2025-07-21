import type { Route } from './+types/route'
import { BuildList } from './components/BuildList'
import { SearchForm } from './components/SearchForm'

export function meta({}: Route.MetaArgs) {
	return [{ title: 'YA-NR SIM' }]
}

export const clientLoader = async ({ request }: Route.ClientLoaderArgs) => {
	const url = new URL(request.url)
	const sarchParams = new URLSearchParams(url.search)

	console.log(sarchParams)

	return [] as { vessel: { name: string; relics: { name: string }[] } }[]
}

export default function Home({ loaderData }: Route.ComponentProps) {
	return (
		<div className="max-w-4xl px-4 mx-auto pb-20">
			<h1 className="text-2xl font-bold py-6">ナイトレインビルドシミュレーター</h1>
			<SearchForm />
			<BuildList />
		</div>
	)
}
