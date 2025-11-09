import { useMemo, useRef, useState } from 'react'
import { relicCategories } from '~/data/generated/relicCategories'
import { relicEffectMap } from '~/data/relics'
import { Checkbox } from '~/components/forms/Checkbox'
import { Button } from '~/components/forms/Button'
import { ChevronRight } from 'lucide-react'

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
  const [selectedMainCategory, setSelectedMainCategory] = useState<string | null>(null)
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null)

  const dialog = useMemo(() => ({
    open: () => ref.current?.showModal(),
    close: () => ref.current?.close(),
  }), [ref])

  const resetNavigation = () => {
    setSelectedMainCategory(null)
    setSelectedSubCategory(null)
  }

  const currentMainCategory = useMemo(
    () => relicCategories.find((cat) => cat.category === selectedMainCategory),
    [selectedMainCategory],
  )

  const currentSubCategory = useMemo(
    () => currentMainCategory?.children.find((cat) => cat.category === selectedSubCategory),
    [currentMainCategory, selectedSubCategory],
  )

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
          fixed top-8 right-0 bottom-auto left-0 m-auto w-full max-w-2xl rounded
          border border-zinc-800 bg-primary-dark text-white shadow-lg
          backdrop:backdrop-blur-xs
        `}
        onClose={() => {
          dialog.close()
          resetNavigation()
        }}
        onChange={(event) => event.stopPropagation()}
      >
        <header className="border-b border-zinc-800 bg-brand-dark-100">
          {/* パンくずリスト */}
          <div className="flex items-center gap-x-2 px-4 py-3 text-sm">
            <button
              type="button"
              className="hover:text-zinc-300"
              onClick={() => resetNavigation()}
            >
              遺物効果を選択
            </button>
            {selectedMainCategory && (
              <>
                <ChevronRight className="h-4 w-4 text-zinc-500" />
                <button
                  type="button"
                  className="hover:text-zinc-300"
                  onClick={() => setSelectedSubCategory(null)}
                >
                  {selectedMainCategory}
                </button>
              </>
            )}
            {selectedSubCategory && (
              <>
                <ChevronRight className="h-4 w-4 text-zinc-500" />
                <span className="text-zinc-300">{selectedSubCategory}</span>
              </>
            )}
            <span className="ml-auto font-semibold">
              (
              {effectIds.size}
              )
            </span>
          </div>
        </header>
        <div className={`
          max-h-[70dvh] overflow-y-auto bg-brand-dark-200 px-4 py-3
        `}
        >
          {/* 大カテゴリ選択 */}
          {!selectedMainCategory && (
            <ul className="space-y-2">
              {relicCategories.map(({ category }) => (
                <li key={category}>
                  <button
                    type="button"
                    className={`
                      hover:bg-brand-dark-50 hover:border-zinc-600
                      w-full rounded border border-zinc-700 bg-brand-dark-100
                      px-4 py-3 text-left text-sm transition-colors
                    `}
                    onClick={() => setSelectedMainCategory(category)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{category}</span>
                      <ChevronRight className="h-5 w-5 text-zinc-500" />
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* サブカテゴリ選択 */}
          {selectedMainCategory && !selectedSubCategory && (
            <ul className="space-y-2">
              {currentMainCategory?.children.map(({ category }) => (
                <li key={category}>
                  <button
                    type="button"
                    className={`
                      hover:bg-brand-dark-50 hover:border-zinc-600
                      w-full rounded border border-zinc-700 bg-brand-dark-100
                      px-4 py-3 text-left text-sm transition-colors
                    `}
                    onClick={() => setSelectedSubCategory(category)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{category}</span>
                      <ChevronRight className="h-5 w-5 text-zinc-500" />
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* 効果一覧 */}
          {selectedSubCategory && currentSubCategory && (
            <ul className="space-y-1">
              {currentSubCategory.children.map(({ id, name, children: effectChildren }) => {
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
          )}
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
