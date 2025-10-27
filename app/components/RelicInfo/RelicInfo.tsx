import { type Relic } from '~/data/relics'
import { RelicEffectsList, type RenderEffect } from '~/components/RelicEffectsList/RelicEffectsList'
import { RelicIcon } from '../RelicIcon/RelicIcon'

type Props = {
  relic: Relic
  actionNode?: React.ReactNode
  renderEffectItem?: RenderEffect
}

export const RelicInfo: React.FC<Props> = ({ relic, actionNode, renderEffectItem }) => {
  return (
    <section className="rounded-sm border border-zinc-800 text-sm">
      <header className={`
        relative flex items-center gap-2 border-b border-zinc-800 px-3 py-2
      `}
      >
        <RelicIcon
          relic={relic}
          className="size-8 shrink-0"
        />
        <h4 className="mr-auto truncate">{relic.name}</h4>
        {actionNode}
      </header>

      <RelicEffectsList relic={relic} className="p-3" renderEffect={renderEffectItem} />

    </section>
  )
}
