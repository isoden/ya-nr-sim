import { type Relic } from '~/data/relics'
import { RelicEffectsList } from '~/components/RelicEffectsList/RelicEffectsList'
import { RelicIcon } from '../RelicIcon/RelicIcon'

type Props = {
  relic: Relic
}

export const RelicInfo: React.FC<Props> = ({ relic }) => {
  return (
    <section className="rounded-sm border border-zinc-800 p-4 text-sm">
      <header className={`
        relative mb-2 flex items-center justify-between gap-2 border-b
        border-zinc-800 pb-2
      `}
      >
        <h4>{relic.name}</h4>
        <RelicIcon
          relic={relic}
          className="absolute top-1/2 right-0 size-8 -translate-y-2/3"
        />
      </header>

      <RelicEffectsList relic={relic} />

    </section>
  )
}
