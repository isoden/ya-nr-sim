import { useState } from 'react'
import { Button } from '~/components/forms/Button'
import type { Relic } from '~/data/relics'
import { RelicEffectsList } from '../RelicEffectsList/RelicEffectsList'

/**
 * 冗長な遺物を表示するカードコンポーネント
 */
export const RedundantRelicCard: React.FC<{
  redundantRelic: Relic
  superiorRelics: Relic[]
  ignoredEffectIds: number[]
  onRemove: (relicId: string) => void
  onIgnore: (relicId: string) => void
}> = ({ redundantRelic, superiorRelics, ignoredEffectIds, onRemove, onIgnore }) => {
  const threshold = 2
  const [truncated, setTruncated] = useState(superiorRelics.length > threshold)

  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-800/50 p-4">
      <header className="mb-3 flex items-center gap-2">
        <h4 className="font-semibold text-zinc-100">
          {redundantRelic.name}
          <span className="text-sm text-zinc-400">
            (
            {redundantRelic.colorExtended}
            )
          </span>
        </h4>

        <Button
          className="ml-auto"
          variant="danger"
          size="sm"
          type="button"
          onClick={() => onRemove(redundantRelic.id)}
        >
          削除
        </Button>
        <Button
          variant="secondary"
          size="sm"
          type="button"
          onClick={() => onIgnore(redundantRelic.id)}
        >
          除外
        </Button>
      </header>

      <RelicEffectsList relic={redundantRelic} ignoredEffectIds={ignoredEffectIds} />

      <div className="mt-4 space-y-3">
        <h5 className="text-sm font-medium text-zinc-400">
          上位互換の遺物 (
          {superiorRelics.length}
          )
        </h5>
        {superiorRelics.slice(0, truncated ? threshold : superiorRelics.length).map((superiorRelic) => (
          <div
            key={superiorRelic.id}
            className="rounded border border-zinc-700 bg-zinc-900/50 p-3"
          >
            <h6 className="mb-2 font-medium text-zinc-200">
              {superiorRelic.name}
              <span className="text-sm text-zinc-400">
                (
                {superiorRelic.colorExtended}
                )
              </span>
            </h6>
            <RelicEffectsList relic={superiorRelic} ignoredEffectIds={ignoredEffectIds} />
          </div>
        ))}
        {truncated && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              type="button"
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
