import { RelicColor, relicEffectMap } from '~/data/relics'
import type { Build } from '../services/simulator'

export const BuildList: React.FC<{ builds: Build[] }> = ({ builds }) => {
	return (
		<section className="bg-black/10 p-6 border border-gray-500/10 rounded-lg mt-12">
			<h2 className="text-xl font-bold">検索結果</h2>

			<div className="flex flex-col gap-8 mt-10">
				{builds.map((item, i) => {
					return (
						<div key={`${item.vessel.name}.${i}`}>
							<header className="flex gap-2 items-center">
								<h3 className="font-bold">{item.vessel.name}</h3>
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
				})}
			</div>
		</section>
	)
}

const bgColorMap = {
	[RelicColor.Red]: 'bg-red-700',
	[RelicColor.Blue]: 'bg-blue-700',
	[RelicColor.Green]: 'bg-green-700',
	[RelicColor.Yellow]: 'bg-yellow-700',
	[RelicColor.Free]: 'bg-gray-700',
}
