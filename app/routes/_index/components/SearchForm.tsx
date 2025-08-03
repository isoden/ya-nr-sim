import { Button, Item, Picker } from '@adobe/react-spectrum'
import { getFormProps, useForm } from '@conform-to/react'
import { parseWithValibot } from '@conform-to/valibot'
import { Form } from 'react-router'
import { RelicEffectSelector } from '~/components/RelicEffectSelector'
import { characterMap } from '~/data/characters'
import { FormSchema } from '../schema/FormSchema'

type Props = {
	defaultValues?: FormSchema
}

type RelicEffectSelectorDefaultValue = React.ComponentProps<typeof RelicEffectSelector>['defaultValue']

export const SearchForm: React.FC<Props> = ({ defaultValues }) => {
	const [form, fields] = useForm({
		defaultValue: defaultValues,
		onValidate: ({ formData }) => parseWithValibot(formData, { schema: FormSchema }),
	})

	return (
		<section className="overflow-y-auto row-start-2 col-start-1 pr-4">
			<Form method="GET" replace={true} {...getFormProps(form)}>
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

				<div className="mt-8 sticky bottom-0">
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
