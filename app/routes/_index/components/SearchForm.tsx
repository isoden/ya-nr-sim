import { Button, ComboBox, Item, NumberField, Picker, Text } from '@adobe/react-spectrum'
import DeleteIcon from '@spectrum-icons/workflow/Delete'
import { useState } from 'react'
import { Form } from 'react-router'
import { relicEffectMap } from '~/data/relics'
import { ImportDialog } from './ImportDialog'

type Props = {
	relicsCount: number
	defaultValues?: {
		character: string
		effects: { id: number; amount: number }[]
	}
}

export const SearchForm: React.FC<Props> = ({ defaultValues, relicsCount }) => {
	const [listState, setListState] = useState<{ id: number | null; amount: number }[]>(
		() => defaultValues?.effects ?? [{ id: null, amount: 1 }],
	)

	return (
		<section className="bg-black/10 p-6 border border-gray-500/10 rounded-lg">
			<Form method="GET">
				<h2 className="text-xl font-bold">条件選択</h2>

				<div className="flex justify-end">
					<ImportDialog relicsCount={relicsCount} />
				</div>

				<div className="flex flex-col gap-6">
					<Picker
						label="キャラクター"
						name="character"
						defaultSelectedKey={defaultValues?.character ?? characterItems[0].name}
						items={characterItems}
					>
						{(item) => <Item key={item.name}>{item.name}</Item>}
					</Picker>

					<div className="grid grid-cols-[1fr_repeat(2,min-content)] gap-4">
						{listState.map((item, i) => {
							return (
								<div key={i} className="grid grid-cols-subgrid col-span-full items-end">
									<ComboBox
										name={`effects[${i}][id]`}
										label={i === 0 ? '遺物効果' : undefined}
										aria-label={i === 0 ? undefined : '遺物効果'}
										selectedKey={item.id}
										onSelectionChange={(id) => {
											setListState(listState.with(i, { ...item, id: id as number | null }))
										}}
										formValue="key"
										defaultItems={effectItems}
										width="100%"
									>
										{(item) => <Item>{item.name}</Item>}
									</ComboBox>
									<NumberField
										name={`effects[${i}][amount]`}
										label={i === 0 ? '数量' : undefined}
										aria-label={i === 0 ? undefined : '数量'}
										value={item.amount}
										onChange={(value) => {
											setListState(listState.with(i, { ...item, amount: value }))
										}}
										minValue={1}
										maxValue={3}
										width="size-1600"
									/>
									<Button
										aria-label="削除"
										type="button"
										variant="negative"
										onPress={() => {
											setListState(listState.toSpliced(i, 1))
										}}
										isDisabled={listState.length === 1}
									>
										<DeleteIcon />
									</Button>
								</div>
							)
						})}
					</div>

					<Button
						type="button"
						variant="primary"
						onPress={() => {
							setListState(listState.concat({ id: null, amount: 1 }))
						}}
					>
						<Text>遺物効果を追加</Text>
					</Button>
				</div>

				<div className="mt-8">
					<Button variant="accent" type="submit">
						検索
					</Button>
				</div>
			</Form>
		</section>
	)
}

const effectItems = Object.entries(relicEffectMap).map(([id, name]) => ({
	id: Number(id),
	name,
}))

const characterItems = [
	{ name: '追跡者' },
	{ name: '守護者' },
	{ name: '鉄の目' },
	{ name: 'レディ' },
	{ name: '無頼漢' },
	{ name: '復讐者' },
	{ name: '隠者' },
	{ name: '執行者' },
]
