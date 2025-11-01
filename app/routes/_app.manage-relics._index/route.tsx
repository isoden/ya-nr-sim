import { useId, useMemo } from 'react'
import { Form, useSearchParams, useSubmit } from 'react-router'
import { ChevronRight, ChevronLeft, Ellipsis } from 'lucide-react'
import { Button } from '~/components/forms/Button'
import { CheckboxGroup } from '~/components/forms/Checkbox'
import { RelicInfo } from '~/components/RelicInfo/RelicInfo'
import { EffectSelectionPanel } from '~/components/EffectSelectionPanel/EffectSelectionPanel'
import { Relic, RelicColorBase } from '~/data/relics'
import { useRelicsStore } from '~/store/relics'
import { usePersistedState } from '~/hooks/usePersistedState'
import { Menu, MenuItem, MenuTrigger, Popover } from 'react-aria-components'
import type { Route } from './+types/route'
import { parseLoaderSchema } from './schema'

const gridColumns = 6
const baseVolume = gridColumns * 4
const volumes = [baseVolume, baseVolume * 2, baseVolume * 4, baseVolume * 6]

export const clientLoader = ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url)
  const data = parseLoaderSchema({
    color: url.searchParams.getAll('color'),
    type: url.searchParams.getAll('type'),
    size: url.searchParams.getAll('size'),
    effectIds: url.searchParams.getAll('effectIds'),
    page: url.searchParams.get('page'),
  })

  return data
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const id = useId()
  const { relics: rawRelics, setRelics } = useRelicsStore()
  const relics = useMemo(() => (rawRelics).map((r) => Relic.new(r)), [rawRelics])
  const submit = useSubmit()
  const [, setSearchParams] = useSearchParams()

  console.log(loaderData)

  const [volume, setVolume] = usePersistedState('_app.manage-relics._index/volume', volumes[0])

  const filteredRelics = useMemo(() => {
    return relics.reduce<Relic[]>((acc, r) => {
      const colorCond = (loaderData.color.length === 0 || loaderData.color.includes(r.color))
      const sizeCond = (loaderData.size.length === 0 || loaderData.size.includes(r.size))
      const typeCond = (loaderData.type.length === 0 || (loaderData.type.includes('depths') ? r.dn : !r.dn))
      const effectCond = loaderData.effectIds.length === 0 || loaderData.effectIds.some((effectIds) => effectIds.split(',').some((id) => r.normalizedEffectIds.includes(Number(id))))

      if (colorCond && sizeCond && typeCond && effectCond) {
        return [...acc, r]
      }

      return acc
    }, [])
  }, [relics, loaderData])

  return (
    <section
      aria-labelledby={id}
      className="flex h-full min-h-0 flex-col gap-y-4"
    >
      <h3 id={id} className="sr-only">遺物一覧</h3>

      <Form
        className="mt-4"
        method="GET"
        onChange={(event) => {
          const formData = new FormData(event.currentTarget)

          formData.delete('page')

          submit(formData, { method: 'GET' })
        }}
      >
        <div className="flex items-end gap-x-8">
          <CheckboxGroup
            label="特色"
            name="color"
            defaultValue={loaderData.color}
            items={[
              { label: '赤色', value: RelicColorBase.Red },
              { label: '青色', value: RelicColorBase.Blue },
              { label: '黄色', value: RelicColorBase.Yellow },
              { label: '緑色', value: RelicColorBase.Green },
            ]}
          />

          <CheckboxGroup
            label="種別"
            name="type"
            defaultValue={loaderData.type}
            items={[
              { label: '通常', value: 'normal' },
              { label: '深層', value: 'depths' },
            ]}
          />

          <CheckboxGroup
            label="大きさ"
            name="size"
            defaultValue={loaderData.size}
            items={[
              { label: '小', value: 'small' },
              { label: '中', value: 'medium' },
              { label: '大', value: 'large' },
            ]}
          />

          <EffectSelectionPanel
            key={loaderData.effectIds.join(',')}
            defaultValue={loaderData.effectIds}
            onChange={(effectIds) => {
              setSearchParams((prev) => {
                prev.delete('effectIds')
                prev.delete('page')
                effectIds.forEach((id) => {
                  prev.append('effectIds', String(id))
                })
                return prev
              })
            }}
          />

          <Button
            type="reset"
            variant="outline"
            size="sm"
            onClick={() => submit(null, { method: 'GET' })}
          >
            リセット
          </Button>
        </div>
      </Form>

      <ol className="grid h-full grid-cols-6 gap-4 overflow-y-auto">
        {filteredRelics.slice((loaderData.page - 1) * volume, loaderData.page * volume).map((relic) => (
          <li
            key={relic.id}
            className="contents"
          >
            <RelicInfo
              relic={relic}
              renderEffectItem={({ item }) => (
                <button
                  className="text-left"
                  onClick={() => {
                    const formData = new FormData()
                    formData.append('color', relic.color)
                    formData.append('type', relic.dn ? 'depths' : 'normal')
                    formData.append('effectIds', String(item.id))
                    submit(formData, { method: 'GET' })
                  }}
                  type="button"
                >
                  {item.name}
                </button>
              )}
              actionNode={(
                <MenuTrigger>
                  <Button
                    className="isolate z-10 ml-auto border-none"
                    variant="outline"
                    size="square-sm"
                    type="button"

                  >
                    <Ellipsis className="size-4 fill-white" />
                  </Button>
                  <Popover
                    className={`
                      w-32 overflow-auto rounded-md bg-zinc-800 p-1 text-sm
                      shadow-lg ring-1 ring-black/5
                    `}
                    placement="bottom right"
                  >
                    <Menu className="outline-hidden">
                      <MenuItem
                        className="p-1"
                        onAction={() => {
                          if (!window.confirm('Are you sure?')) return

                          setRelics(rawRelics.filter((r) => r.id !== relic.id))
                        }}
                      >
                        削除
                      </MenuItem>
                    </Menu>
                  </Popover>
                </MenuTrigger>
              )}
            />
          </li>
        ))}
      </ol>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => {
            setSearchParams((prev) => {
              const nextPage = Math.max(loaderData.page - 1, 1)

              if (nextPage === 1) {
                prev.delete('page')
              } else {
                prev.set('page', String(nextPage))
              }

              return prev
            })
          }}
          isDisabled={loaderData.page === 1}
          aria-label="前のページ"
        >
          <ChevronLeft />
        </Button>
        {`${(loaderData.page - 1) * volume + 1}-${Math.min(loaderData.page * volume, filteredRelics.length)} / ${filteredRelics.length}`}
        <select
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="bg-black"
        >
          {volumes.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => {
            setSearchParams((prev) => ({ ...prev, page: Math.min(loaderData.page + 1, Math.ceil(filteredRelics.length / volume)) }))
          }}
          isDisabled={loaderData.page === Math.ceil(filteredRelics.length / volume)}
          aria-label="次のページ"
        >
          <ChevronRight />
        </Button>
      </div>
    </section>
  )
}
