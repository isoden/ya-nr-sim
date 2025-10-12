import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { RelicEffectsList } from '~/components/RelicEffectsList/RelicEffectsList'
import { Button } from '~/components/forms/Button'
import { Toggle } from '~/components/Toggle'
import type { Relic } from '~/data/relics'

/**
 * 除外済み遺物のリスト表示コンポーネント
 */
export const IgnoredRelicsList: React.FC<{
  ignoredRelicIds: string[]
  relics: Relic[]
  onUnignore: (relicId: string) => void
}> = ({ ignoredRelicIds, relics, onUnignore }) => {
  const [open, setOpen] = useState(false)

  if (ignoredRelicIds.length === 0) return null

  return (
    <Toggle.Root open={open} onOpenChange={setOpen}>
      <div className={`
        flex max-h-[inherit] flex-col rounded-lg border border-zinc-700
        bg-zinc-800
      `}
      >
        <Toggle.Button className={`
          flex w-full items-center py-2 pr-2 pl-4 text-left text-sm
          text-zinc-200
        `}
        >
          除外済み遺物(
          {ignoredRelicIds.length}
          )
          <ChevronRight className={twMerge(`
            ml-auto inline transition-transform duration-200
          `, open && 'rotate-90',
          )}
          />
        </Toggle.Button>
        <Toggle.Content className="overflow-auto px-4 pb-2">
          <ul className="space-y-3 text-sm">
            {ignoredRelicIds.map((id) => {
              const relic = relics.find((r) => r.id === id)
              if (relic == null) return null

              return (
                <li
                  key={id}
                  className="rounded border border-zinc-700 bg-zinc-900/50 p-3"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h5 className="font-medium text-zinc-200">
                      {relic.name}
                      <span className="text-zinc-400">
                        (
                        {relic.colorExtended}
                        )
                      </span>
                    </h5>
                    <Button
                      variant="secondary"
                      size="sm"
                      type="button"
                      onClick={() => onUnignore(id)}
                    >
                      除外解除
                    </Button>
                  </div>
                  <RelicEffectsList relic={relic} />
                </li>
              )
            })}
          </ul>
        </Toggle.Content>
      </div>
    </Toggle.Root>
  )
}
