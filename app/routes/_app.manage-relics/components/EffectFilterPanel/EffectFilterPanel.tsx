import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { relicCategories } from '~/data/generated/relicCategories'
import { relicEffectMap } from '~/data/relics'
import { Toggle } from '~/components/Toggle'
import { Checkbox } from '~/components/forms/Checkbox'

/**
 * 効果フィルタリングパネルコンポーネント
 */
export const EffectFilterPanel: React.FC<{
  ignoredEffectIds: Record<string, boolean>
  onToggleEffect: (effectId: string, checked: boolean) => void
}> = ({ ignoredEffectIds, onToggleEffect }) => {
  const [open, setOpen] = useState(false)

  return (
    <Toggle.Root open={open} onOpenChange={setOpen}>
      <div className={`
        relative flex max-h-[inherit] flex-col rounded-lg border border-zinc-700
        bg-zinc-800
      `}
      >
        <Toggle.Button className={`
          flex w-full items-center py-2 pr-2 pl-4 text-left text-sm
          text-zinc-200
        `}
        >
          除外する効果 (
          {Object.keys(ignoredEffectIds).filter((id) => ignoredEffectIds[id]).length}
          )
          <ChevronRight className={twMerge(`
            ml-auto inline transition-transform duration-200
          `, open && 'rotate-90',
          )}
          />
        </Toggle.Button>
        <Toggle.Content className="overflow-y-auto px-4 pb-2">
          {relicCategories.map(({ category: mainCategory, children }) => (
            <div key={mainCategory} className="mb-4">
              {children.map(({ category: subCategory, children }) => (
                <div key={subCategory} className="mb-3">
                  <h5 className="mb-2 text-sm font-semibold text-zinc-300">{subCategory}</h5>
                  <ul className="space-y-1 pl-2">
                    {children.map(({ id, children: effectChildren }) => {
                      const effect = relicEffectMap[Number(id)]

                      if (effect == null) {
                        return (
                          <ul key={id} className="space-y-1 pl-4">
                            {effectChildren?.map(({ id: childId }) => {
                              const childEffect = relicEffectMap[Number(childId)]
                              if (childEffect == null) return null

                              return (
                                <li key={childId}>
                                  <Checkbox
                                    name={childId}
                                    checked={ignoredEffectIds[childId] ?? false}
                                    onChange={(checked) => onToggleEffect(childId, checked)}
                                  >
                                    {childEffect.name}
                                  </Checkbox>
                                </li>
                              )
                            })}
                          </ul>
                        )
                      }

                      return (
                        <li key={id}>
                          <Checkbox
                            name={id}
                            checked={ignoredEffectIds[id] ?? false}
                            onChange={(checked) => onToggleEffect(id, checked)}
                          >
                            {effect.name}
                          </Checkbox>
                          {effectChildren && effectChildren.length > 0 && (
                            <ul className="mt-1 space-y-1 pl-4">
                              {effectChildren.map(({ id: childId }) => {
                                const childEffect = relicEffectMap[Number(childId)]
                                if (childEffect == null) return null

                                return (
                                  <li key={childId}>
                                    <Checkbox
                                      name={childId}
                                      checked={ignoredEffectIds[childId] ?? false}
                                      onChange={(checked) => onToggleEffect(childId, checked)}
                                    >
                                      {childEffect.name}
                                    </Checkbox>
                                  </li>
                                )
                              })}
                            </ul>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </Toggle.Content>
      </div>
    </Toggle.Root>
  )
}
