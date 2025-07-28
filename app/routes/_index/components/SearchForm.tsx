import { Button, ComboBox, Item, NumberField, Picker, Text } from '@adobe/react-spectrum'
import DeleteIcon from '@spectrum-icons/workflow/Delete'
import { useState } from 'react'
import { Form } from 'react-router'
import { characterMap } from '~/data/characters'
import { relicEffectMap } from '~/data/relics'

type Props = {
	defaultValues?: {
		charId: string
		effects: { id: number; count: number }[]
	}
}

export const SearchForm: React.FC<Props> = ({ defaultValues }) => {
	const [listState, setListState] = useState<{ id: number | null; count: number }[]>(
		() => defaultValues?.effects ?? [{ id: null, count: 1 }],
	)

	return (
		<section className="overflow-y-auto row-start-2 col-start-1">
			<Form method="GET" replace={true}>
				<h2 className="text-lg font-semibold">条件選択</h2>

				<div className="flex flex-col gap-4 mt-4">
					<Picker
						label="キャラクター(献器)"
						name="charId"
						defaultSelectedKey={defaultValues?.charId ?? characterItems[0].name}
						items={characterItems}
					>
						{(item) => <Item>{item.name}</Item>}
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
											setListState(listState.with(i, { ...item, id: id as number | null, count: 1 }))
										}}
										formValue="key"
										defaultItems={effectItems}
										width="100%"
									>
										{(item) => <Item>{item.name}</Item>}
									</ComboBox>
									<NumberField
										name={`effects[${i}][count]`}
										label={i === 0 ? '個数' : undefined}
										aria-label={i === 0 ? undefined : '個数'}
										value={item.count}
										onChange={(value) => {
											setListState(listState.with(i, { ...item, count: value }))
										}}
										minValue={1}
										maxValue={3}
										isDisabled={!relicEffectMap[item.id!]?.stackable}
										width="size-1600"
									/>
									<Button
										aria-label={`${i + 1}番目の遺物効果を削除する`}
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
							setListState(listState.concat({ id: null, count: 1 }))
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

const effectItems = Object.entries(relicEffectMap).map(([id, { name }]) => ({
	id: Number(id),
	name,
}))

const characterItems = Object.entries(characterMap).map(([id, { name }]) => ({
	id,
	name,
}))
