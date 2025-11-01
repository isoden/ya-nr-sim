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
    <section className={`
      flex flex-col rounded-sm border border-zinc-800 bg-brand-dark-100 text-sm
    `}
    >
      <header className="relative flex items-center gap-2 px-3 py-2">
        <RelicIcon
          relic={relic}
          className="size-8 shrink-0"
        />
        <h4 className="mr-auto truncate">{relic.name}</h4>
        {actionNode}
      </header>

      <RelicEffectsList relic={relic} className="h-full bg-brand-dark-200 p-3" renderEffect={renderEffectItem} />
    </section>
  )
}
