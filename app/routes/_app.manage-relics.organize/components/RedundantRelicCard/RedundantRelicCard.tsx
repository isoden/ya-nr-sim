import { useState } from 'react'
import { Minus } from 'lucide-react'
import { RelicEffectsList } from '~/components/RelicEffectsList/RelicEffectsList'
import { RelicInfo } from '~/components/RelicInfo/RelicInfo'
import { Button } from '~/components/forms/Button'
import type { Relic } from '~/data/relics'

type Props = {
  redundantRelic: Relic
  superiorRelics: Relic[]
  ignoredEffectIds: number[]
  onRemove: (relicId: string) => void
}

/**
 * 冗長な遺物を表示するカードコンポーネント
 */
export const RedundantRelicCard: React.FC<Props> = ({
  redundantRelic,
  superiorRelics,
  ignoredEffectIds,
  onRemove,
}) => {
  const threshold = 1
  const [truncated, setTruncated] = useState(superiorRelics.length > threshold)

  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-800/50 p-3">
      <header className="mb-3 flex items-center gap-2">
        <h4 className="text-sm font-semibold text-zinc-100">
          {redundantRelic.name}
          <span className="text-zinc-400">
            (
            {redundantRelic.colorExtended}
            )
          </span>
        </h4>

        <Button
          className="ml-auto"
          variant="danger"
          size="square-sm"
          type="button"
          onClick={() => window.confirm('Are you sure?') && onRemove(redundantRelic.id)}
        >
          <Minus className="size-4 fill-white" />
        </Button>
      </header>

      <RelicEffectsList className="text-sm" relic={redundantRelic} ignoredEffectIds={ignoredEffectIds} />

      <div className="mt-4 space-y-3">
        <h5 className="text-sm font-medium text-zinc-400">
          上位互換の遺物 (
          {superiorRelics.length}
          )
        </h5>
        {superiorRelics.slice(0, truncated ? threshold : superiorRelics.length).map((superiorRelic) => (
          <RelicInfo key={superiorRelic.id} relic={superiorRelic} />
        ))}
        {truncated && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              type="button"
              size="sm"
              className="w-full"
              onClick={() => setTruncated(false)}
            >
              もっと見る
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
