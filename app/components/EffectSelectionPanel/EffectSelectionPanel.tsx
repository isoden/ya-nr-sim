import { useMemo, useRef, useState } from 'react'
import { relicCategories } from '~/data/generated/relicCategories'
import { relicEffectMap } from '~/data/relics'
import { Checkbox } from '~/components/forms/Checkbox'
import { Button } from '~/components/forms/Button'

type Props = {
  defaultValue: string[]
  onChange?: (value: string[]) => void
}

/**
 * 遺物効果選択コンポーネント
 */
export const EffectSelectionPanel: React.FC<Props> = ({ defaultValue, onChange }) => {
  const ref = useRef<HTMLDialogElement>(null)

  const [effectIds, setEffectIds] = useState(() => new Set(defaultValue))

  const dialog = useMemo(() => ({
    open: () => ref.current?.showModal(),
    close: () => ref.current?.close(),
  }), [ref])

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => dialog.open()}>
        遺物効果を選択 (
        {defaultValue.length}
        )
      </Button>
      <dialog
        ref={ref}
        // eslint-disable-next-line react/no-unknown-property
        closedby="any"
        className={`
          fixed inset-0 m-auto w-full max-w-2xl rounded border border-zinc-800
          bg-primary-dark text-white shadow-lg
          backdrop:backdrop-blur-xs
        `}
        onClose={() => dialog.close()}
        onChange={(event) => event.stopPropagation()}
      >
        <header className="border-b border-zinc-800 bg-brand-dark-100">
          <h4 className="px-4 py-3 font-semibold">
            遺物効果を選択 (
            {effectIds.size}
            )
          </h4>
        </header>
        <div className={`
          max-h-[60vh] overflow-y-auto bg-brand-dark-200 px-4 py-3
        `}
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
                            name="effectIds"
                            value={id}
                            checked={effectIds.has(id)}
                            onChange={() => setEffectIds(toggleSet(effectIds, id))}
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
                                      name="effectIds"
                                      value={childId}
                                      checked={effectIds.has(childId)}
                                      onChange={() => setEffectIds(toggleSet(effectIds, childId))}
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
        </div>
        <footer className={`
          flex gap-x-3 border-t border-zinc-800 bg-brand-dark-100 px-4 py-3
        `}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              ref.current?.close()}
          >
            キャンセル
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto"
            onClick={() =>
              setEffectIds(new Set())}
          >
            全て解除
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onChange?.(Array.from(effectIds))
              ref.current?.close()
            }}
          >
            選択完了
          </Button>
        </footer>
      </dialog>
    </>
  )
}

function toggleSet<T>(set: Set<T>, value: T) {
  const cloned = new Set(set)

  if (cloned.has(value)) {
    cloned.delete(value)
  } else {
    cloned.add(value)
  }

  return cloned
}
