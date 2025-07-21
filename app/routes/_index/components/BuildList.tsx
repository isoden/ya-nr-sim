import React from 'react'
import { RelicColor, relicEffectMap } from '~/data/relics'
import type { Build, Result } from '../services/simulator'

type Props = {
	/** 検索結果 */
	result: Result | undefined
}

/**
 * 検索結果を表示するコンポーネント
 *
 * @param props - {@link Props}
 */
export const BuildList: React.FC<Props> = ({ result }) => {
	return (
		<section className="row-span-full bg-zinc-950/20 p-6 border border-gray-400/10 rounded-lg overflow-y-scroll">
			<h2 className="text-lg font-semibold">検索結果</h2>

			<div className="flex flex-col gap-6 mt-6">
				{!result ? (
					<Idle />
				) : result.success ? (
					<Success builds={result.data} />
				) : (
					<Failure>{result.error.message}</Failure>
				)}
			</div>
		</section>
	)
}

/**
 * 初期表示
 */
function Idle() {
	return <p>条件を指定してください</p>
}

/**
 * 検索結果を表示するコンポーネント
 *
 * @param props
 */
function Success({ builds }: { builds: Build[] }) {
	return builds.map((item, i) => {
		return (
			<div key={`${item.vessel.name}.${i}`}>
				<header className="flex gap-2 items-center">
					<h3 className="font-bold">
						#{i + 1} - {item.vessel.name}
					</h3>
					<ul className="flex gap-2">
						{item.vessel.slots.map((slot, i) => {
							return (
								<li key={`${slot}.${i}`} className={`relative size-5 ${bgColorMap[slot]}`}>
									<span className="sr-only">{slot}</span>
								</li>
							)
						})}
					</ul>
				</header>

				<ul className="grid grid-cols-3 gap-4 mt-4">
					{item.relics.map((relic) => (
						<li key={relic.id}>
							<div className="flex gap-2 items-center">
								<span className="text-sm font-bold">{relic.name}</span>
								<span className={`relative size-4 ${bgColorMap[relic.color]}`} />
							</div>
							<ul className="list-disc list-inside text-sm mt-2">
								{relic.normalizedEffectIds.map((effectId, i) => {
									return (
										<li key={`${effectId}.${i}`} className="mt-1">
											{relicEffectMap[effectId]}
										</li>
									)
								})}
							</ul>
						</li>
					))}
				</ul>
			</div>
		)
	})
}

/**
 * 検索結果が見つからなかった場合の表示
 *
 * @param props
 */
function Failure({ children }: { children: React.ReactNode }) {
	return <p className="text-red-500">{children}</p>
}

const bgColorMap = {
	[RelicColor.Red]: 'bg-red-700',
	[RelicColor.Blue]: 'bg-blue-700',
	[RelicColor.Green]: 'bg-green-700',
	[RelicColor.Yellow]: 'bg-yellow-700',
	[RelicColor.Free]: 'bg-gray-700',
}
