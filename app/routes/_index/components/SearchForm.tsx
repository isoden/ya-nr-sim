import { Button, Item, Picker } from '@adobe/react-spectrum'
import { getFormProps, useForm } from '@conform-to/react'
import { parseWithValibot } from '@conform-to/valibot'
import { Form, useSubmit } from 'react-router'
import { RelicEffectSelector } from '~/components/RelicEffectSelector'
import { Checkbox } from '~/components/forms/Checkbox'
import { characterMap } from '~/data/characters'
import { usePersistedState } from '~/hooks/usePersistedState'
import { FormSchema } from '../schema/FormSchema'

type Props = {
	defaultValues?: FormSchema
}

type RelicEffectSelectorDefaultValue = React.ComponentProps<typeof RelicEffectSelector>['defaultValue']

export const SearchForm: React.FC<Props> = ({ defaultValues }) => {
	const submit = useSubmit()
	const [form, fields] = useForm({
		defaultValue: defaultValues,
		onValidate: ({ formData }) => parseWithValibot(formData, { schema: FormSchema }),
	})
	const [isAutoSearchEnabled, setIsAutoSearchEnabled] = usePersistedState('SearchForm.isAutoSearchEnabled', false)

	return (
		<section className="overflow-y-auto row-start-2 col-start-1 pr-4">
			<Form
				method="GET"
				replace={true}
				onChange={(event) => {
					const form = event.currentTarget
					if (isAutoSearchEnabled) {
						// 自動検索が有効な場合、フォームの変更を検知して即座に送信
						// setTimeout を使用しないと、React の状態更新が完了する前に submit が呼ばれてしまうため、フォームの値が正しく反映されないことがある
						setTimeout(() => submit(form, { replace: true, method: 'GET' }), 0)
					}
				}}
				{...getFormProps(form)}
			>
				<h2 className="text-lg font-semibold">条件選択</h2>

				<div className="flex flex-col gap-8 mt-4">
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

					<RelicEffectSelector defaultValue={fields.effects.value as unknown as RelicEffectSelectorDefaultValue} />

					{fields.effects.errors?.length ? <p className="text-orange-700">{fields.effects.errors[0]}</p> : null}
				</div>

				<div className="pt-4 bg-zinc-900 sticky bottom-0 flex items-center gap-4">
					<Button variant="accent" type="submit" isDisabled={isAutoSearchEnabled}>
						検索
					</Button>
					<Checkbox className="text-sm" checked={isAutoSearchEnabled} onChange={setIsAutoSearchEnabled}>
						自動検索をON
					</Checkbox>
				</div>
			</Form>
		</section>
	)
}

const characterItems = Object.entries(characterMap).map(([id, { name }]) => ({
	id,
	name,
}))
