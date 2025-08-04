import React, { useRef, useState } from 'react'
import { PlusIcon, MinusIcon, ChevronRight, TextSearch } from 'lucide-react'
import { set } from 'es-toolkit/compat'
import { twMerge } from 'tailwind-merge'
import { relicCategoryEntries } from '~/data/relics'
import { Checkbox } from './Checkbox'
import { Toggle } from './Toggle'

type Props = {
	defaultValue?: { [id: string]: { count: string } }
}

/**
 * 遺物効果を選択するためのコンボボックスコンポーネント
 *
 * @param props - {@link Props}
 */
export const RelicEffectSelector: React.FC<Props> = ({ defaultValue }) => {
	const [filteredText, setFilteredText] = useState('')
	const [showSelectedOnly, setShowSelectedOnly] = useState(false)
	const [effectCountMap, setEffectCountMap] = useState(() => {
		if (!defaultValue) return {}
		return Object.entries(defaultValue).reduce<Record<string, { count: number }>>(
			(acc, [key, { count }]) => set(acc, key, { count: Number(count) }),
			{},
		)
	})

	const isComposingRef = useRef(false)

	return (
		<fieldset>
			<legend className="text-[15px] text-gray-300">遺物効果</legend>

			<div className="flex items-end justify-between">
				<Checkbox
					disabled={!Object.keys(effectCountMap).length}
					label="選択した効果のみ表示"
					checked={showSelectedOnly}
					onChange={(event) => setShowSelectedOnly(event.target.checked)}
				/>

				<label className="flex items-center gap-2">
					<TextSearch aria-label="効果名で絞り込む" />

					<input
						type="text"
						className="border border-white/50 py-1 px-2 rounded"
						placeholder="効果名で絞り込む"
						onChange={(event) => {
							if (isComposingRef.current) return
							setFilteredText(event.target.value.trim())
						}}
						onCompositionStart={() => (isComposingRef.current = true)}
						onCompositionEnd={(event) => {
							isComposingRef.current = false
							setFilteredText(event.currentTarget.value.trim())
						}}
					/>
				</label>
			</div>

			<div className="flex flex-col gap-4 mt-4">
				{relicCategoryEntries.map(({ name, children = [] }) => {
					const filteredChildren = children.filter((relic) => {
						if (showSelectedOnly) {
							if (effectCountMap[relic.id] == null) return false
						}
						if (filteredText === '') return true
						return relic.name.includes(filteredText)
					})

					return (
						<Toggle.Root key={name} storage={name}>
							<div
								className={twMerge(
									'group border bg-zinc-800 border-gray-700 rounded-lg',
									filteredChildren.length === 0 && 'sr-only',
								)}
								aria-hidden={filteredChildren.length === 0}
							>
								<Toggle.Button className="w-full p-3 leading-0 flex items-center rounded-tr-lg rounded-tl-lg not-[:open]:rounded-br-lg not-[:open]:rounded-bl-lg">
									{({ open }) => (
										<>
											<span className="text-[15px] text-white">{name}</span>
											<span className="ml-auto" aria-hidden={true}>
												{open ? <MinusIcon /> : <PlusIcon />}
											</span>
										</>
									)}
								</Toggle.Button>
								<Toggle.Content className="p-3 max-h-80 overflow-y-scroll bg-zinc-900 rounded-br-lg rounded-bl-lg">
									{filteredChildren.map((effect) => (
										<Toggle.Root key={effect.id} storage={effect.id}>
											<div key={effect.id} className="grid grid-cols-[1fr_auto_theme(spacing.6)] gap-4">
												<Checkbox
													value={effect.id}
													label={effect.name}
													checked={effectCountMap[effect.id] != null}
													onChange={(event) => {
														const toBeChecked = event.target.checked

														setEffectCountMap((prev) => {
															if (toBeChecked) {
																return { ...prev, [effect.id]: { count: 1 } }
															}

															const { [effect.id]: _, ...rest } = prev

															return { ...rest }
														})
													}}
												/>

												<input
													type="number"
													name={`effects.${effect.id}.count`}
													className="disabled:text-gray-500/50"
													disabled={effectCountMap[effect.id] == null}
													min={1}
													max={effect.stackable ? 3 : 1}
													value={effectCountMap[effect.id]?.count ?? 1}
													onChange={(event) => {
														const value = event.target.valueAsNumber

														setEffectCountMap((prev) =>
															prev[effect.id] == null ? prev : { ...prev, [effect.id]: { count: value } },
														)
													}}
												/>

												{!!effect.children && (
													<Toggle.Button>
														{({ open }) => (
															<ChevronRight
																role="img"
																aria-label={`${effect.name}の詳細指定を${open ? '閉じる' : '開く'}`}
																className={twMerge('transition-transform duration-200', open && 'rotate-90')}
															/>
														)}
													</Toggle.Button>
												)}
											</div>

											<Toggle.Content>
												<ul className="pl-4">
													{effect.children?.map((item) => (
														<li key={item.id} className="flex justify-between">
															<Checkbox label={item.name} disabled={true} />
															<input
																type="number"
																className="disabled:text-gray-500/50"
																disabled={true}
																min={1}
																max={3}
																defaultValue={1}
															/>
														</li>
													))}
												</ul>
											</Toggle.Content>
										</Toggle.Root>
									))}
								</Toggle.Content>
							</div>
						</Toggle.Root>
					)
				})}
			</div>
		</fieldset>
	)
}
