import { Form, Link } from 'react-router'
import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithValibot } from '@conform-to/valibot'
import * as v from 'valibot'
import { Boss, day1Bosses, day2Bosses, events } from '../_app.bosses/data'
import { ExternalLink } from 'lucide-react'

const schema = v.object({
  day1Boss: v.string(),
  day2Boss: v.string(),
  event1: v.string(),
  event2: v.string(),
})

export default function Route() {
  const [form, fields] = useForm({
    onValidate: ({ formData }) => parseWithValibot(formData, { schema }),
  })

  const pBossDay1 = day1Bosses.find(([boss]) => boss === form.value?.day1Boss)?.[1]
  const pBossDay2 = day2Bosses.find(([boss]) => boss === form.value?.day2Boss)?.[1]
  const pEvent1 = events.find(([event]) => event === form.value?.event1)?.[1]

  const array = [pBossDay1, pBossDay2, pEvent1].filter((x): x is ReadonlySet<Boss> => x !== undefined)
  const day3boss = array.length > 0 ? array.reduce((x, y) => x.intersection(y)) : undefined

  return (
    <div className="flex flex-col gap-y-8">
      <Form
        className={`
          mt-8 flex flex-col gap-y-6 rounded-sm border border-zinc-800 p-4
        `}
        {...getFormProps(form)}
      >
        {
          ([
            ['1日目ボス', day1Bosses, fields.day1Boss],
            ['2日目ボス', day2Bosses, fields.day2Boss],
            ['発生イベント / 襲撃イベント', [['なし'], ...events], fields.event1],
          ] as const).map(([label, options, meta]) => (
            <fieldset key={label} className="">
              <legend className="font-semibold text-accent-light">{label}</legend>
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                {
                  options.map(([value]) => (
                    <label key={value} className="flex gap-x-1">
                      <input {...getInputProps(meta, { type: 'radio', value: value })} />
                      {value}
                    </label>
                  ))
                }
              </div>
            </fieldset>
          ))
        }
      </Form>

      <div className="rounded-sm border border-zinc-800 p-4">
        <h2 className="mb-4 text-lg font-semibold">3日目ボス予測結果</h2>
        {day3boss
          ? Array.from(day3boss).map((boss) => (
              <Link
                key={boss}
                to={`../?q=${boss}`}
                className="mr-4 mb-2 font-semibold"
              >
                {boss}
              </Link>
            ))
          : '一致結果なし'}
      </div>

      <a
        href="https://www.nightreignmap.com/"
        rel="noreferrer"
        target="_blank"
        className={`
          ml-auto inline-flex gap-x-2 underline
          hover:no-underline
        `}
      >
        Nightreign Map
        <ExternalLink />
      </a>
    </div>
  )
}
