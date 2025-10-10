import type { Relic } from '~/data/relics'

/**
 * 遺物の効果リストを表示するコンポーネント
 */
export const RelicEffectsList: React.FC<{
  relic: Relic
  ignoredEffectIds?: number[]
}> = ({ relic, ignoredEffectIds = [] }) => {
  return (
    <ul className="list-disc space-y-1 pl-6">
      {relic.pairedEffects.map(([mainEffect, subEffects], index) => (
        <li key={`${mainEffect.id}.${index}`}>
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
