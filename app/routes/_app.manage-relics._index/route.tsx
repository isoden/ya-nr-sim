import { useId, useMemo, useState } from 'react'
import { Form } from 'react-router'
import { ChevronRight, ChevronLeft, Ellipsis } from 'lucide-react'
import { Button } from '~/components/forms/Button'
import { RadioGroup } from '~/components/forms/Radio'
import { RelicInfo } from '~/components/RelicInfo/RelicInfo'
import { EffectSelectionPanel } from '~/components/EffectSelectionPanel/EffectSelectionPanel'
import { Relic, RelicColorBase } from '~/data/relics'
import { useRelicsStore } from '~/store/relics'
import { usePersistedState } from '~/hooks/usePersistedState'
import { Menu, MenuItem, MenuTrigger, Popover } from 'react-aria-components'

const gridColumns = 6
const baseVolume = gridColumns * 4
const volumes = [baseVolume, baseVolume * 2, baseVolume * 4, baseVolume * 6]

export default function Page() {
  const id = useId()
  const { relics: rawRelics, setRelics } = useRelicsStore()
  const relics = useMemo(() => (rawRelics).map((r) => Relic.new(r)), [rawRelics])

  const [effectIdsList, setEffectIdsList] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [volume, setVolume] = usePersistedState('_app.manage-relics._index/volume', volumes[0])
  const [color, setColor] = useState<'all' | RelicColorBase>('all')
  const [type, setType] = useState<'all' | typeof Relic.prototype.type>('all')

  const filteredRelics = useMemo(() => {
    return relics.reduce<Relic[]>((acc, r) => {
      const colorCond = (color === 'all' || r.color === color)
      const typeCond = (type === 'all' || (type === 'depths' ? r.dn : !r.dn))
      const effectCond = effectIdsList.length === 0 || effectIdsList.some((effectIds) => effectIds.split(',').some((id) => r.normalizedEffectIds.includes(Number(id))))

      if (colorCond && typeCond && effectCond) {
        return [...acc, r]
      }

      return acc
    }, [])
  }, [relics, color, type, effectIdsList])

  return (
    <section
      aria-labelledby={id}
      className="flex h-full min-h-0 flex-col gap-y-4"
    >
      <h3 id={id} className="sr-only">遺物一覧</h3>

      <Form className="mt-4">
        <div className="flex items-end gap-x-8">
          <RadioGroup
            label="特色"
            name="color"
            value={color}
            onChange={(color) => {
              setColor(color as 'all' | RelicColorBase)
              setPage(1)
            }}
            items={[
              { label: '全て', value: 'all' },
              { label: '赤色', value: RelicColorBase.Red },
              { label: '青色', value: RelicColorBase.Blue },
              { label: '緑色', value: RelicColorBase.Green },
              { label: '黄色', value: RelicColorBase.Yellow },
            ]}
          />

          <RadioGroup
            label="種別"
            name="type"
            value={type}
            onChange={(type) => {
              setType(type as 'all' | typeof Relic.prototype.type)
              setPage(1)
            }}
            items={[
              { label: '全て', value: 'all' },
              { label: '通常', value: 'normal' },
              { label: '深層', value: 'depths' },
            ]}
          />

          <EffectSelectionPanel
            effectIds={effectIdsList}
            onChange={({ effectIds, checked }) => {
              setEffectIdsList((prev) => toggle(prev, effectIds, () => checked))
              setPage(1)
            }}
          />
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

function toggle<T>(array: T[], value: T, cond: () => boolean): T[] {
  if (cond()) {
    return [...array, value]
  } else {
    return array.filter((v) => v !== value)
  }
}
