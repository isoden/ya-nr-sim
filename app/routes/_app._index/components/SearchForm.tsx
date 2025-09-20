import { getFormProps, getSelectProps, useForm } from '@conform-to/react'
import { parseWithValibot } from '@conform-to/valibot'
import { Form, useSubmit } from 'react-router'
import { RelicEffectSelector } from '~/components/RelicEffectSelector'
import { Checkbox } from '~/components/forms/Checkbox'
import { Button } from '~/components/forms/Button'
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
    <section className="min-h-0">
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
        className="flex h-full min-h-0 flex-col gap-6"
        {...getFormProps(form)}
      >
        <h2 className="text-lg font-semibold">条件選択</h2>

        <div className="flex min-h-0 flex-col gap-y-5">
          <div className="flex flex-wrap gap-x-3">
            <label htmlFor={fields.charId.id} className={`
              text-[15px] text-gray-300
            `}>
              キャラクター(献器)
            </label>
            <select {...getSelectProps(fields.charId)} className={`
              rounded border border-zinc-600 p-1
            `}>
              {characterItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            {fields.charId.errors && <p className="w-full text-orange-700">{fields.charId.errors[0]}</p>}
          </div>

          <RelicEffectSelector defaultValue={fields.effects.value as unknown as RelicEffectSelectorDefaultValue} />

          {fields.effects.errors?.length ? <p className="text-orange-700">{fields.effects.errors[0]}</p> : null}
        </div>

        <div className="flex items-center gap-4">
          <Button variant="primary" type="submit" isDisabled={isAutoSearchEnabled}>
            検索
          </Button>
          <Checkbox className="mr-auto text-sm" checked={isAutoSearchEnabled} onChange={setIsAutoSearchEnabled}>
            自動検索をON
          </Checkbox>
          <Checkbox className="text-sm" checked readOnly>
            深層の遺物を含む
          </Checkbox>
          <Button
            variant="secondary"
            type="button"
            // TODO: フォームのリセットボタンを押したときの処理を実装する
            // type="submit"
            // formMethod="POST"
            // {...form.reset.getButtonProps()}
            // onPress={() => {
            // 	// フォームのリセットボタンを押したときの処理
            // 	submit(new FormData(), { replace: true, method: 'GET' })
            // }}
            onPress={() => location.assign('/')}
          >
            リセット
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
