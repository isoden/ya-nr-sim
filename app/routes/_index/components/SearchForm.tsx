import { Button, ComboBox, Item, NumberField, Picker, Text } from '@adobe/react-spectrum'
import DeleteIcon from '@spectrum-icons/workflow/Delete'
import { getFormProps, useForm } from '@conform-to/react'
import { parseWithValibot } from '@conform-to/valibot'
import { Form } from 'react-router'
import { invariant } from 'es-toolkit'
import { characterMap } from '~/data/characters'
import { relicEffectMap } from '~/data/relics'
import { FormSchema } from '../schema/FormSchema'

type Props = {
	defaultValues?: {
		charId: string
		effects: { id: number; count: number }[]
	}
}

export const SearchForm: React.FC<Props> = ({ defaultValues }) => {
	const [form, fields] = useForm({
		defaultValue: { ...defaultValues, effects: defaultValues?.effects ?? [{ id: 0, count: 1 }] },
		onValidate: ({ formData }) => parseWithValibot(formData, { schema: FormSchema }),
	})

	const effects = fields.effects.getFieldList()

	return (
		<section className="overflow-y-auto row-start-2 col-start-1">
			<Form method="GET" replace={true} {...getFormProps(form)}>
				<h2 className="text-lg font-semibold">条件選択</h2>

				<div className="flex flex-col gap-4 mt-4">
					<Picker
						isInvalid={!!fields.charId.errors?.length}
						name={fields.charId.name}
						label="キャラクター(献器)"
						defaultSelectedKey={fields.charId.defaultValue}
						items={characterItems}
						errorMessage={fields.charId.errors?.[0]}
					>
						{(item) => <Item>{item.name}</Item>}
					</Picker>

					<div className="grid grid-cols-[1fr_repeat(2,min-content)] gap-4">
						{effects.map((effect, i) => {
							const effectField = effect.getFieldset()

							return (
								<div key={effect.id} className="grid grid-cols-subgrid col-span-full items-end">
									<ComboBox
										name={effectField.id.name}
										label={i === 0 ? '遺物効果' : undefined}
										aria-label={i === 0 ? undefined : '遺物効果'}
										selectedKey={optionalNumber(effectField.id.value) ?? null}
										onSelectionChange={(key) => {
											form.update({
												name: effectField.id.name,
												value: key as number,
											})
										}}
										formValue="key"
										defaultItems={effectItems}
										width="100%"
										validationState={!!fields.effects.errors?.length ? 'invalid' : undefined}
									>
										{(item) => <Item>{item.name}</Item>}
									</ComboBox>
									<NumberField
										name={effectField.count.name}
										label={i === 0 ? '個数' : undefined}
										aria-label={i === 0 ? undefined : '個数'}
										value={strictNumber(effectField.count.value)}
										onChange={(value) => {
											form.update({
												name: effectField.count.name,
												value,
											})
										}}
										minValue={1}
										maxValue={3}
										isDisabled={!relicEffectMap[strictNumber(effectField.id.value)]?.stackable}
										width="size-1600"
									/>
									<Button
										aria-label={`${i + 1}番目の遺物効果を削除する`}
										type="submit"
										variant="negative"
										formMethod="POST"
										{...form.remove.getButtonProps({
											name: fields.effects.name,
											index: i,
										})}
										isDisabled={effects.length === 1}
									>
										<DeleteIcon />
									</Button>
								</div>
							)
						})}
					</div>

					<Button
						type="submit"
						variant="primary"
						formMethod="POST"
						{...form.insert.getButtonProps({
							name: fields.effects.name,
							defaultValue: { id: 0, count: 1 },
						})}
					>
						<Text>遺物効果を追加</Text>
					</Button>
					{fields.effects.errors?.length ? <p className="text-red-500">{fields.effects.errors[0]}</p> : null}
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

function optionalNumber(input: string | undefined): number | undefined {
	if (input === undefined || input === '') return undefined
	const parsed = Number(input)
	return Number.isNaN(parsed) ? undefined : parsed
}

function strictNumber(input: string | undefined): number {
	const numbered = optionalNumber(input)
	invariant (numbered !== undefined,'This field is required')
	return numbered
}
