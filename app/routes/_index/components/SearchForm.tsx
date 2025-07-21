import { Button, ComboBox, Item, NumberField, Picker } from '@adobe/react-spectrum'
import AddIcon from '@spectrum-icons/workflow/Add'
import DeleteIcon from '@spectrum-icons/workflow/Delete'
import { useState } from 'react'
import { Form } from 'react-router'
import { relicEffectMap } from '~/data/relics'

export const SearchForm: React.FC = () => {
	const [listState, setListState] = useState<{ effectId: number | null; amount: number }[]>([
		{ effectId: null, amount: 1 },
	])

	return (
		<Form method="GET">
			<h2>条件選択</h2>

			<Picker label="キャラクター" name="character" defaultSelectedKey={characterItems[0].name} items={characterItems}>
				{(item) => <Item key={item.name}>{item.name}</Item>}
			</Picker>

			<div>
				<div className="grid grid-cols-[1fr_repeat(2,min-content)] gap-4">
					{listState.map((item, i) => {
						return (
							<div key={i} className="grid grid-cols-subgrid col-span-full items-end">
								<ComboBox
									name={`effects[${i}].effectId`}
									label={i === 0 ? '遺物効果' : undefined}
									aria-label={i === 0 ? undefined : '遺物効果'}
									selectedKey={item.effectId}
									onSelectionChange={(effectId) => {
										setListState(listState.with(i, { ...item, effectId: effectId as number }))
									}}
									formValue="key"
									defaultItems={effectItems}
									width="100%"
								>
									{(item) => <Item key={item.id}>{item.name}</Item>}
								</ComboBox>
								<NumberField
									name={`effects[${i}].amount`}
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
					aria-label="追加"
					type="button"
					variant="primary"
					onPress={() => {
						setListState(listState.concat({ effectId: null, amount: 1 }))
					}}
				>
					<AddIcon />
				</Button>
			</div>

			<Button variant="accent" type="submit">
				検索
			</Button>
		</Form>
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
