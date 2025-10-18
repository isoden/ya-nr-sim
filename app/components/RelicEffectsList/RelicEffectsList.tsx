import { twMerge } from 'tailwind-merge'
import type { Relic } from '~/data/relics'

type Props = {
  relic: Relic
  ignoredEffectIds?: number[]
  className?: string
}

/**
 * 遺物の効果リストを表示するコンポーネント
 */
export const RelicEffectsList: React.FC<Props> = ({ relic, ignoredEffectIds = [], className }) => {
  return (
    <ul className={twMerge(`flex flex-col gap-y-2`, className)}>
      {relic.pairedEffects.map(([mainEffect, subEffects], index) => (
        <li key={`${mainEffect.id}.${index}`} className="mt-1">
          <span className={ignoredEffectIds.includes(mainEffect.id)
            ? `text-zinc-200/50`
            : `text-zinc-200`}
          >
            {mainEffect.name}
          </span>

          {subEffects.length > 0 && (
            <ul className="mt-1 space-y-0.5 text-sm text-red-400">
              {subEffects.map((effect, subIndex) => (
                <li key={`${effect.id}.${subIndex}`}>{effect.name}</li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  )
}
