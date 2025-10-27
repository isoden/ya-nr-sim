import { useId, useMemo, useState } from 'react'
import { Form } from 'react-router'
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
  })

  return data
}

export default function Page() {
  const id = useId()
  const { relics: rawRelics, setRelics } = useRelicsStore()
  const relics = useMemo(() => (rawRelics).map((r) => Relic.new(r)), [rawRelics])

  const [volume, setVolume] = usePersistedState('_app.manage-relics._index/volume', volumes[0])

  const [page, setPage] = useState(1)
  const [colors, setColors] = useState<Set<RelicColorBase>>(new Set())
  const [sizes, setSizes] = useState<Set<typeof Relic.prototype.size>>(new Set())
  const [types, setTypes] = useState<Set<typeof Relic.prototype.type>>(new Set())
  const [effectIdsList, setEffectIdsList] = useState<string[]>([])

  const filteredRelics = useMemo(() => {
    return relics.reduce<Relic[]>((acc, r) => {
      const colorCond = (colors.size === 0 || colors.has(r.color))
      const sizeCond = (sizes.size === 0 || sizes.has(r.size))
      const typeCond = (types.size === 0 || (types.has('depths') ? r.dn : !r.dn))
      const effectCond = effectIdsList.length === 0 || effectIdsList.some((effectIds) => effectIds.split(',').some((id) => r.normalizedEffectIds.includes(Number(id))))

      if (colorCond && sizeCond && typeCond && effectCond) {
        return [...acc, r]
      }

      return acc
    }, [])
  }, [relics, colors, sizes, types, effectIdsList])

  return (
    <section
      aria-labelledby={id}
      className="flex h-full min-h-0 flex-col gap-y-4"
    >
      <h3 id={id} className="sr-only">遺物一覧</h3>

      <Form className="mt-4">
        <div className="flex items-end gap-x-8">
          <CheckboxGroup
            label="特色"
            name="color"
            value={colors}
            onChange={(color) => setColors((prev) => toggleSet(prev, color as RelicColorBase))}
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
            value={types}
            onChange={(type) => setTypes((prev) => toggleSet(prev, type as typeof Relic.prototype.type))}
            items={[
              { label: '通常', value: 'normal' },
              { label: '深層', value: 'depths' },
            ]}
          />

          <CheckboxGroup
            label="大きさ"
            name="size"
            value={sizes}
            onChange={(size) => setSizes((prev) => toggleSet(prev, size as typeof Relic.prototype.size))}
            items={[
              { label: '小', value: 'small' },
              { label: '中', value: 'medium' },
              { label: '大', value: 'large' },
            ]}
          />

          <EffectSelectionPanel
            effectIds={effectIdsList}
            onChange={({ effectIds, checked }) => {
              setEffectIdsList((prev) => toggle(prev, effectIds, () => checked))
              setPage(1)
            }}
          />

          <Button
            type="reset"
            variant="outline"
            size="sm"
            onClick={() => {
              setColors(new Set())
              setTypes(new Set())
              setEffectIdsList([])
            }}
          >
            リセット
          </Button>
        </div>
      </Form>

      <ol className="grid h-full grid-cols-6 gap-4 overflow-y-auto">
        {filteredRelics.slice((page - 1) * volume, page * volume).map((relic) => (
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
                    setColors(new Set([relic.color]))
                    setTypes(new Set([relic.dn ? 'depths' : 'normal']))
                    setSizes(new Set())
                    setEffectIdsList([String(item.id)])
                    console.log('clicked effect item', item, relic)
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
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          isDisabled={page === 1}
          aria-label="前のページ"
        >
          <ChevronLeft />
        </Button>
        {`${(page - 1) * volume + 1}-${Math.min(page * volume, filteredRelics.length)} / ${filteredRelics.length}`}
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
          onClick={() => setPage((prev) => Math.min(prev + 1, Math.ceil(filteredRelics.length / volume)))}
          isDisabled={page === Math.ceil(filteredRelics.length / volume)}
          aria-label="次のページ"
        >
          <ChevronRight />
        </Button>
      </div>
    </section>
  )
}

function toggleSet<T>(set: Set<T>, value: T): Set<T> {
  const newSet = new Set(set)
  if (newSet.has(value)) {
    newSet.delete(value)
  } else {
    newSet.add(value)
  }
  return newSet
}

function toggle<T>(array: T[], value: T, cond: () => boolean): T[] {
  if (cond()) {
    return [...array, value]
  } else {
    return array.filter((v) => v !== value)
  }
}
