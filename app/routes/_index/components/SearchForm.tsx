import { Button, Item, NumberField, Picker, Text } from '@adobe/react-spectrum'
import DeleteIcon from '@spectrum-icons/workflow/Delete'
import { getFormProps, useForm } from '@conform-to/react'
import { parseWithValibot } from '@conform-to/valibot'
import { Form } from 'react-router'
import { invariant } from 'es-toolkit'
import { RelicEffectSelector } from '~/components/RelicEffectSelector'
import { characterList, characterMap, type CharId } from '~/data/characters'
import { relicEffectMap } from '~/data/relics'
import { FormSchema } from '../schema/FormSchema'

type Props = {
	defaultValues?: FormSchema
}

export const SearchForm: React.FC<Props> = ({ defaultValues }) => {
	const [form, fields] = useForm({
		defaultValue: { ...defaultValues, effects: defaultValues?.effects ?? [defaultEffect()] },
		onValidate: ({ formData }) => parseWithValibot(formData, { schema: FormSchema }),
	})

	const effects = fields.effects.getFieldList()

	// 選択したキャラクター以外の固有遺物効果を非表示にするための配列
	const excludeIds = fields.charId.value
		? uniqueEffectIds.flatMap(([charId, effectIds]) => (charId === fields.charId.value ? [] : effectIds))
		: []

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
						{effects.map((effect, index) => {
							const effectField = effect.getFieldset()

							return (
								<div key={effect.id} className="grid grid-cols-subgrid col-span-full items-end">
									<RelicEffectSelector
										name={effectField.id.name}
										label={index === 0 ? '遺物効果' : undefined}
										aria-label={index === 0 ? undefined : '遺物効果'}
										selectedKey={optionalNumber(effectField.id.value) ?? null}
										onSelectionChange={(key) => {
											form.update({ name: effectField.id.name, value: key as number })
										}}
										validationState={!!fields.effects.errors?.length ? 'invalid' : undefined}
										excludeIds={excludeIds}
									/>
									<NumberField
										name={effectField.count.name}
										label={index === 0 ? '個数' : undefined}
										aria-label={index === 0 ? undefined : '個数'}
										value={strictNumber(effectField.count.value)}
										onChange={(value) => {
											form.update({ name: effectField.count.name, value })
										}}
										minValue={1}
										maxValue={3}
										isDisabled={!relicEffectMap[strictNumber(effectField.id.value)]?.stackable}
										width="size-1600"
									/>
									<Button
										aria-label={`${index + 1}番目の遺物効果を削除する`}
										type="submit"
										variant="negative"
										formMethod="POST"
										{...form.remove.getButtonProps({ name: fields.effects.name, index })}
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
						{...form.insert.getButtonProps({ name: fields.effects.name, defaultValue: defaultEffect() })}
						isDisabled={effects.length >= 9}
					>
						<Text>遺物効果を追加</Text>
					</Button>
					{fields.effects.errors?.length ? <p className="text-orange-700">{fields.effects.errors[0]}</p> : null}
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
	invariant(numbered !== undefined, 'This field is required')
	return numbered
}

function defaultEffect(): FormSchema['effects'][number] {
	return { id: 0, count: 1 }
}

const uniqueEffectIds = Object.entries(
	Object.entries(relicEffectMap).reduce<Record<CharId, number[]>>((acc, [id, effect]) => {
		characterList.some((character) => {
			if (effect.name.startsWith(`[${character.name}]`)) {
				acc[character.id] ??= []
				acc[character.id].push(Number(id))
				return true
			}
		})

		return acc
	}, Object.create(null)),
)
