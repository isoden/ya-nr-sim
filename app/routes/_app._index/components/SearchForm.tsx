import { useState } from 'react'
import { getFormProps, getInputProps, getSelectProps, useForm } from '@conform-to/react'
import { parseWithValibot } from '@conform-to/valibot'
import { Form, useSubmit } from 'react-router'
import { Checkbox } from '~/components/forms/Checkbox'
import { Button } from '~/components/forms/Button'
import { characterList } from '~/data/characters'
import { usePersistedState } from '~/hooks/usePersistedState'
import { FormSchema } from '../schema/FormSchema'
import { BuildCriteria } from './BuildCriteria'
import type { CheckedEffects } from './types/forms'

type Props = {
  defaultValues?: FormSchema
}

export const SearchForm: React.FC<Props> = ({ defaultValues }) => {
  const submit = useSubmit()
  const [form, fields] = useForm({
    defaultValue: defaultValues,
    onValidate: ({ formData }) => parseWithValibot(formData, { schema: FormSchema }),
  })
  const [isAutoSearchEnabled, setIsAutoSearchEnabled] = usePersistedState('SearchForm.isAutoSearchEnabled', false)
  const [checkedEffects, setCheckedEffects] = useState(() => Object.entries((fields.effects.value || {})).reduce<CheckedEffects>(
    (acc, [key]) => ({ ...acc, [key]: true }),
    {},
  ))

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
        className="flex h-full flex-col gap-6"
        {...getFormProps(form)}
      >
        <h2 className="text-lg font-semibold text-accent-light">条件選択</h2>

        <div className="flex h-full min-h-0 flex-col gap-y-5">
          <div className="flex flex-wrap gap-x-3">
            <label
              htmlFor={fields.charId.id}
              className="text-[15px] text-accent-light"
            >
              キャラクター(献器)
            </label>
            <select
              {...getSelectProps(fields.charId)}
              className="rounded border border-zinc-600 p-1"
            >
              {characterList.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            {fields.charId.errors && <p className="w-full text-orange-700">{fields.charId.errors[0]}</p>}
          </div>

          <BuildCriteria
            meta={fields.effects}
            selectedCharId={fields.charId.value ?? characterList[0].id}
            checkedEffects={checkedEffects}
            setCheckedEffects={setCheckedEffects}
          />

          {fields.effects.errors?.length ? <p className="text-orange-700">{fields.effects.errors[0]}</p> : null}
        </div>

        <div className="flex items-center gap-4">
          <Button variant="primary" type="submit" isDisabled={isAutoSearchEnabled}>
            検索
          </Button>
          <Checkbox className="mr-auto text-sm" checked={isAutoSearchEnabled} onChange={setIsAutoSearchEnabled}>
            自動検索をON
          </Checkbox>
          <Checkbox className="text-sm" {...getInputProps(fields.excludeDepthsRelics, { type: 'checkbox' })}>
            深層の遺物を除外する
          </Checkbox>
          <Button
            variant="outline"
            type="submit"
            formMethod="GET"
            {...form.reset.getButtonProps()}
            onPress={() => {
              // 遺物効果の選択状態をリセット
              setCheckedEffects({})

              // URL のクエリパラメータをクリア
              submit(new FormData(), { replace: true, method: 'GET' })
            }}
          >
            リセット
          </Button>
        </div>
      </Form>
    </section>
  )
}
