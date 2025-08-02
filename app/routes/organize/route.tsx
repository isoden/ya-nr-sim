import { Form, useSubmit } from 'react-router'
import { getFormProps, useForm } from '@conform-to/react'
import { Relic, RelicColor, relicEffectMap, uniqItemNameMap } from '~/data/relics'
import { SlotColor } from '~/data/vessels'
import { parseStringifiedRelicsSchema } from '../_index/schema/StringifiedRelicsSchema'
import type { Route } from './+types/route'
import { findCompatibleRelics } from './usecase/findCompatibleRelics'

const ignoreItemIds = [
	// 小壺商人
	[1260, 1270, 1180, 1190],
	[1200, 1210, 1220, 1230],
	[1240, 1250, 1120, 1130],
	[1140, 1150, 1160, 1170],
	[1060, 1070, 1080, 1090],
	[1100, 1110, 1000, 1010],
	[1020, 1030, 1040, 1050],

	// コレクターの看板
	[1400, 1410, 1420, 1430],
	[1440, 1450, 1460, 1470],
	[1480, 1490, 1500, 1510],
	[1520],

	...Object.values(uniqItemNameMap).map(Number),
].flat()

export function clientLoader({ request }: Route.LoaderArgs) {
	const url = new URL(request.url)
	const searchParams = new URLSearchParams(url.search)

	const allUserRelics = parseStringifiedRelicsSchema(localStorage.getItem('relics')).map((relic) => Relic.new(relic))
	const ignoreEffectIds = searchParams.getAll('effects').map(Number)
	const ignoreRelicIds = allUserRelics.filter((relic) => ignoreItemIds.includes(relic.itemId)).map((relic) => relic.id)
	const compatibleRelics = findCompatibleRelics(allUserRelics, { ignoreEffectIds, ignoreRelicIds })

	return { compatibleRelics, ignoreEffectIds }
}

export default function Component({ loaderData }: Route.ComponentProps) {
	const submit = useSubmit()
	const [form, fields] = useForm({
		defaultValue: {
			effects: loaderData.ignoreEffectIds,
		},
	})

	const { ignored, required } = Object.groupBy(Object.entries(relicEffectMap), ([key, item]) => {
		return loaderData.ignoreEffectIds.includes(Number(key)) ? 'ignored' : 'required'
	})

	return (
		<div className="container mx-auto p-4">
			<Form
				method="GET"
				onChange={(event) => {
					submit(event.currentTarget, {
						preventScrollReset: true,
					})
				}}
				replace={true}
				preventScrollReset={true}
				{...getFormProps(form)}
			>
				<div className=" grid grid-cols-2">
					<fieldset className="max-h-80 overflow-y-auto">
						<legend>不要な遺物効果</legend>
						{ignored?.map(([id, effect]) => (
							<div key={id} className="form-control">
								<label className="label cursor-pointer">
									<input
										type="checkbox"
										name={fields.effects.name}
										value={id}
										className="checkbox checkbox-primary"
										checked={true}
									/>
									<span className="label-text">{effect.name}</span>
								</label>
							</div>
						))}
					</fieldset>
					<fieldset className="max-h-80 overflow-y-auto">
						<legend>必要な遺物効果</legend>
						{required?.map(([id, effect]) => (
							<div key={id} className="form-control">
								<label className="label cursor-pointer">
									<input
										type="checkbox"
										name={fields.effects.name}
										value={id}
										className="checkbox checkbox-primary"
										checked={false}
									/>
									<span className="label-text">{effect.name}</span>
								</label>
							</div>
						))}
					</fieldset>
				</div>

				<button type="submit" className="btn btn-primary mt-4">
					更新
				</button>
			</Form>
			<h1>不要遺物チェッカー</h1>
			<p>{loaderData.compatibleRelics.length} 個の不要な遺物が見つかりました。</p>
			<ul className="space-y-4 divide-y">
				{loaderData.compatibleRelics.map(([lowerRelic, upperRelic], index) => (
					<li key={lowerRelic.id}>
						<em className="font-bold">
							#{index + 1}. {lowerRelic.name}
						</em>
						<span className={'inline-block size-5 ' + bgColorMap[lowerRelic.color]}></span>
						<ul>
							{lowerRelic.normalizedEffectIds.map((effectId, i) => (
								<li key={i}>{relicEffectMap[effectId].name}</li>
							))}
						</ul>
						<ul className="pl-8 mt-4">
							<li key={upperRelic.id} data-relic-id={upperRelic.id}>
								<em className="font-bold">{upperRelic.name}</em>
								<ul>
									{upperRelic.normalizedEffectIds.map((effectId, j) => (
										<li key={j}>{relicEffectMap[effectId].name}</li>
									))}
								</ul>
							</li>
						</ul>
					</li>
				))}
			</ul>
		</div>
	)
}

const bgColorMap = {
	[RelicColor.Red]: 'bg-red-700',
	[SlotColor.Blue]: 'bg-blue-700',
	[SlotColor.Green]: 'bg-green-700',
	[SlotColor.Yellow]: 'bg-yellow-700',
}
