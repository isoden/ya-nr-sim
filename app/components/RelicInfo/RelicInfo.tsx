import { RelicColorExtended, type Relic } from '~/data/relics'

type Props = {
  relic: Relic
}

export const RelicInfo: React.FC<Props> = ({ relic }) => {
  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold">{relic.name}</span>
        <span
          className={`
            relative size-5
            ${bgColorMap[relic.colorExtended]}
          `}
        />
      </div>
      <ul className="mt-2 flex flex-col gap-y-2 text-sm">
        {relic.pairedEffects.map(([effect, demeritEffects], i) => (
          <li key={`${effect.id}.${i}`} className="mt-1">
            {effect.name}

            {demeritEffects.length > 0 && (
              <ul className="mt-1 text-xs text-red-400">
                {demeritEffects.map((effect) => (
                  <li key={effect.id}>{effect.name}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

const bgColorMap = {
  [RelicColorExtended.Red]: 'bg-red-500',
  [RelicColorExtended.Blue]: 'bg-blue-500',
  [RelicColorExtended.Green]: 'bg-green-500',
  [RelicColorExtended.Yellow]: 'bg-yellow-500',
  [RelicColorExtended.DeepRed]: 'bg-red-800',
  [RelicColorExtended.DeepBlue]: 'bg-blue-800',
  [RelicColorExtended.DeepGreen]: 'bg-green-800',
  [RelicColorExtended.DeepYellow]: 'bg-yellow-800',
}
