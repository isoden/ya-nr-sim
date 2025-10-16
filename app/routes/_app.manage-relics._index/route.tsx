import { useId, useMemo, useState } from 'react'
import { Form } from 'react-router'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { Button } from '~/components/forms/Button'
import { RelicInfo } from '~/components/RelicInfo/RelicInfo'
import { Relic, RelicColorBase } from '~/data/relics'
import { useRelicsStore } from '~/store/relics'
import { usePersistedState } from '~/hooks/usePersistedState'

const gridColumns = 6
const baseVolume = gridColumns * 4
const volumes = [baseVolume, baseVolume * 2, baseVolume * 4, baseVolume * 6]

export default function Page() {
  const id = useId()
  const { relics: rawRelics } = useRelicsStore()
  const relics = useMemo(() => (rawRelics).map((r) => Relic.new(r)), [rawRelics])

  const [page, setPage] = useState(1)
  const [volume, setVolume] = usePersistedState('_app.manage-relics._index/volume', volumes[0])
  const [color, setColor] = useState<'all' | RelicColorBase>('all')
  const [type, setType] = useState<'all' | typeof Relic.prototype.type>('all')

  const filteredRelics = useMemo(() => {
    return relics.reduce<Relic[]>((acc, r) => {
      if ((color === 'all' || r.color === color) && (type === 'all' || (type === 'depths' ? r.dn : !r.dn))) {
        return [...acc, r]
      }

      return acc
    }, [])
  }, [relics, color, type])

  return (
    <section aria-labelledby={id} className="flex min-h-0 flex-col">
      <h3 id={id} className="sr-only">遺物一覧</h3>

      <Form>
        <select
          name="color"
          value={color}
          onChange={(e) => {
            setColor(e.target.value as 'all' | RelicColorBase)
            setPage(1)
          }}
        >
          <option value="all">全て</option>
          {[RelicColorBase.Red, RelicColorBase.Blue, RelicColorBase.Green, RelicColorBase.Yellow].map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>

        <select
          name="type"
          value={type}
          onChange={(e) => {
            setType(e.target.value as 'all' | 'normal' | 'depths')
            setPage(1)
          }}
        >
          <option value="all">全て</option>
          <option value="normal">通常</option>
          <option value="depths">深層</option>
        </select>
      </Form>

      <ol className="mt-4 grid grid-cols-6 gap-4 overflow-y-auto">
        {filteredRelics.slice((page - 1) * volume, page * volume).map((relic) => (
          <li
            key={relic.id}
            className="contents"
          >
            <RelicInfo relic={relic} />
          </li>
        ))}
      </ol>

      <div className="mt-4 flex items-center gap-2">
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
