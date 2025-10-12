import { RelicColorExtended, uniqItemNameMap, type Relic } from '~/data/relics'

type Props = {
  relic: Relic
}

export const RelicIcon: React.FC<Props> = ({ relic }) => {
  if (relic.itemId in uniqItemNameMap) {
    // TODO: ユニークアイテムのアイコンを表示する
  }

  const bgColor = {
    [RelicColorExtended.Red]: 'bg-red-500',
    [RelicColorExtended.Blue]: 'bg-blue-500',
    [RelicColorExtended.Green]: 'bg-green-500',
    [RelicColorExtended.Yellow]: 'bg-yellow-500',
    [RelicColorExtended.DeepRed]: 'bg-red-800',
    [RelicColorExtended.DeepBlue]: 'bg-blue-800',
    [RelicColorExtended.DeepGreen]: 'bg-green-800',
    [RelicColorExtended.DeepYellow]: 'bg-yellow-800',
  }[relic.colorExtended]

  return (
    <span
      className={`
        relative size-5
        ${bgColor}
      `}
    />
  )
}
