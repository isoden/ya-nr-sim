import { useMemo, useRef } from 'react'
import { relicCategories } from '~/data/generated/relicCategories'
import { relicEffectMap } from '~/data/relics'
import { Checkbox } from '~/components/forms/Checkbox'
import { Button } from '~/components/forms/Button'

type Props = {
  effectIds: string[]
  onChange: (payload: { effectIds: string; checked: boolean }) => void
}

/**
 * 遺物効果選択コンポーネント
 */
export const EffectSelectionPanel: React.FC<Props> = ({ effectIds, onChange }) => {
  const ref = useRef<HTMLDialogElement>(null)

  const dialog = useMemo(() => ({
    open: () => ref.current?.showModal(),
    close: () => ref.current?.close(),
  }), [ref])

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => dialog.open()}>
        遺物効果を選択 (
        {effectIds.length}
        )
      </Button>
      <dialog
        ref={ref}
        // eslint-disable-next-line react/no-unknown-property
        closedby="any"
        className={`
          fixed inset-0 m-auto max-h-[40vh] w-full max-w-2xl overflow-y-auto
          rounded border border-zinc-800 bg-primary-dark p-6 text-white
          shadow-lg
          backdrop:backdrop-blur-xs
        `}
        onClose={() => dialog.close()}
      >
        {relicCategories.map(({ category: mainCategory, children }) => (
          <div key={mainCategory} className="mb-4">
            {children.map(({ category: subCategory, children }) => (
              <div key={subCategory} className="mb-3">
                <h5 className="mb-2 text-sm font-semibold text-zinc-300">{subCategory}</h5>
                <ul className="space-y-1 pl-2">
                  {children.map(({ id, name, children: effectChildren }) => {
                    return (
                      <li key={id}>
                        <Checkbox
                          name={id}
                          checked={effectIds.includes(id)}
                          onChange={(checked) => onChange({ effectIds: id, checked })}
                        >
                          {name}
                        </Checkbox>
                        {!!effectChildren?.length && (
                          <ul className="mt-1 space-y-1 pl-4">
                            {effectChildren.map(({ id: childId }) => {
                              const childEffect = relicEffectMap[Number(childId)]
                              if (childEffect == null) return null

                              return (
                                <li key={childId}>
                                  <Checkbox
                                    name={childId}
                                    checked={effectIds.includes(childId)}
                                    onChange={(checked) => onChange({ effectIds: childId, checked })}
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
      </dialog>
    </>
  )
}
