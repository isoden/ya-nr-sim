import { getFormProps, getSelectProps, useForm } from '@conform-to/react'
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
		<section className="overflow-y-auto row-start-2 col-start-1">
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
					<div className="flex gap-4 flex-wrap">
						<label htmlFor={fields.charId.id} className="text-[15px] text-gray-300">
							キャラクター(献器)
						</label>
						<select {...getSelectProps(fields.charId)} className="border border-zinc-600 p-1 rounded">
							{characterItems.map((item) => (
								<option key={item.id} value={item.id}>
									{item.name}
								</option>
							))}
						</select>
						{fields.charId.errors && <p className="text-orange-700 w-full">{fields.charId.errors[0]}</p>}
					</div>

					<RelicEffectSelector defaultValue={fields.effects.value as unknown as RelicEffectSelectorDefaultValue} />

					{fields.effects.errors?.length ? <p className="text-orange-700">{fields.effects.errors[0]}</p> : null}
				</div>

				<div className="pt-4 bg-zinc-900 sticky bottom-0 flex items-center gap-4">
					<button type="submit" className="bg-blue-500 text-white rounded px-4 py-2" disabled={isAutoSearchEnabled}>
						検索
					</button>
					<Checkbox className="text-sm mr-auto" checked={isAutoSearchEnabled} onChange={setIsAutoSearchEnabled}>
						自動検索をON
					</Checkbox>

					<button
						type="button"
						// TODO: フォームのリセットボタンを押したときの処理を実装する
						// type="submit"
						// formMethod="POST"
						// {...form.reset.getButtonProps()}
						// onPress={() => {
						// 	// フォームのリセットボタンを押したときの処理
						// 	submit(new FormData(), { replace: true, method: 'GET' })
						// }}
						className="bg-gray-500 text-white rounded px-4 py-2"
						onClick={() => location.assign('/')}
					>
						リセット
					</button>
				</div>
			</Form>
		</section>
	)
}

const characterItems = Object.entries(characterMap).map(([id, { name }]) => ({
	id,
	name,
}))
