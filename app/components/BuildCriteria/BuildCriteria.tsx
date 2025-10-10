import React, { useEffect, useRef, useState } from 'react'
import type { FieldMetadata } from '@conform-to/react'
import { ChevronRight, TextSearch, CircleXIcon } from 'lucide-react'
import { set } from 'es-toolkit/compat'
import { twMerge } from 'tailwind-merge'
import { usePersistedState } from '~/hooks/usePersistedState'
import { characterList, characterMap } from '~/data/characters'
import { Checkbox } from '../forms/Checkbox'
import { Toggle } from '../Toggle'
import { relicCategories } from './data'

type EffectCountState<Type extends string | number> = {
  [effectIds: string]: { count: Type }
}

type Props = {
  // conform のメタデータ
  meta: FieldMetadata<EffectCountState<number>>

  // 選択中のキャラクター ID
  selectedCharId: string | undefined
}

const characterUniqueEffect = '特定キャラクターのみ'
const characterNames = characterList.reduce<Record<string, boolean>>(
  (memo, character) => ({ ...memo, [character.name]: false }),
  {},
)

/**
 * ビルド条件として要求する遺物効果と必要数を選択するコンポーネント
 *
 * @param props - {@link Props}
 */
export const BuildCriteria: React.FC<Props> = ({ meta, selectedCharId }) => {
  const [filterText, setFilterText] = useState('')
  const [showSelectedOnly, setShowSelectedOnly] = useState(false)
  const [effectCountMap, setEffectCountMap] = useState(() => {
    return Object.entries((meta.value || {}) as EffectCountState<string>).reduce<EffectCountState<number>>(
      (acc, [key, { count }]) => set(acc, key, { count: Number(count) }),
      {},
    )
  })
  const [toggleState, setToggleState] = usePersistedState<Record<string, boolean>>('build-criteria-toggle-state', () =>
    Object.fromEntries(
      relicCategories.flatMap<[string, boolean][]>(({ category, children }) => [
        [category, true],
        ...children.flatMap<[string, boolean]>(({ category, children }) => [
          [category, false],
          ...(children?.map<[string, boolean]>(({ id }) => [id, false]) ?? []),
        ]),
      ]),
    ),
  )
  const [prevSelectedCharId, setPrevSelectedCharId] = useState(selectedCharId)

  if (selectedCharId !== prevSelectedCharId) {
    setToggleState((prevState) => ({ ...prevState, ...characterNames }))
    setPrevSelectedCharId(selectedCharId)
  }

  const getVisibility = (visible: boolean) => {
    const isForceVisible = showSelectedOnly || filterText !== ''
    return isForceVisible ? true : visible
  }

  const shouldHideItem = (item: { id: string; name: string; children?: { id: string; name: string }[] }) => {
    // 子要素がある場合、子要素のいずれかが選択されているかチェック
    const hasSelectedChild = item.children?.some((child) => effectCountMap[child.id] != null)

    // 選択モードの場合、自身または子要素が選択されていなければ非表示
    const isUnselectedInShowMode = showSelectedOnly && effectCountMap[item.id] == null && !hasSelectedChild

    // 検索モードの場合、名前が一致しなければ非表示
    const isFilteredOut = filterText !== '' && !item.name.includes(filterText)

    return isUnselectedInShowMode || isFilteredOut
  }

  const categoriesWithVisibility = relicCategories.map(({ category, children }) => {
    const flattenChildren = children.flatMap((item) => item.children)
    const visibleItems = flattenChildren.filter((item) => !shouldHideItem(item))

    return {
      category,
      children,
      flattenChildren,
      visibleCount: visibleItems.length,
      invisible: visibleItems.length === 0,
    }
  })

  const visibleItemsCount = categoriesWithVisibility.reduce((sum, cat) => sum + cat.visibleCount, 0)

  return (
    <fieldset className="flex h-full min-h-0 flex-col">
      <legend className="text-[15px] text-accent-light">遺物効果</legend>

      <div className="flex items-end justify-between">
        <Checkbox
          disabled={!showSelectedOnly && !Object.keys(effectCountMap).length}
          checked={showSelectedOnly}
          onChange={setShowSelectedOnly}
          className={`
            text-sm
            has-[:disabled]:opacity-60
          `}
        >
          選択した効果のみ表示
        </Checkbox>

        <SearchInput value={filterText} setValue={setFilterText} />
      </div>

      <div
        className={`
          mt-3 flex min-h-0 flex-col overflow-y-auto rounded-md border
          border-zinc-700
        `}
      >
        {visibleItemsCount === 0 && (
          <div
            className={`
              flex flex-col items-center justify-center gap-2 py-12
              text-zinc-500
            `}
          >
            <TextSearch className="size-12" />
            <p className="text-sm">該当する効果が見つかりませんでした</p>
            <p className="text-xs text-zinc-600">検索ワード: &quot;{filterText}&quot;</p>
          </div>
        )}
        {categoriesWithVisibility.map(({ category, children, invisible }) => {
          return (
            <Toggle.Root
              key={category}
              open={getVisibility(toggleState[category])}
              onOpenChange={(open) => setToggleState((prevState) => ({ ...prevState, [category]: open }))}
            >
              {({ open: isCategoryOpen }) => (
                <div
                  className={twMerge(
                    `
                      group relative border-zinc-700 bg-zinc-800 shadow
                      not-[:first-child]:border-t
                    `,
                    invisible && 'collapse-fallback',
                  )}
                  aria-hidden={invisible}
                >
                  <Toggle.Button
                    className={`
                      sticky top-0 z-10 flex w-full items-center bg-inherit px-4
                      py-2 leading-0 shadow-[0_1px_0_0_theme(colors.zinc.700)]
                    `}
                  >
                    <span className="text-sm font-bold" aria-hidden="true">
                      {category}
                    </span>
                    <ChevronRight
                      role="img"
                      aria-label={`${category}の詳細指定を${isCategoryOpen ? '閉じる' : '開く'}`}
                      className={twMerge(`
                        ml-auto transition-transform duration-200
                      `, isCategoryOpen && 'rotate-90')}
                    />
                  </Toggle.Button>
                  <Toggle.Content className={'flex flex-col bg-zinc-700/20'}>
                    {children.map(({ category: subCategory, children }) => (
                      <Toggle.Root
                        key={subCategory}
                        open={getVisibility(toggleState[subCategory])}
                        onOpenChange={(open) => {
                          setToggleState((prevState) => ({ ...prevState, [subCategory]: open }))
                        }}
                      >
                        {({ open: isSubCategoryOpen }) => (
                          <>
                            <Toggle.Button
                              className={twMerge(
                                `
                                  sticky top-10 z-20 flex items-center gap-4
                                  border-t border-t-zinc-700 bg-zinc-800 py-2
                                  pr-4 pl-6
                                  shadow-[0_1px_0_0_theme(colors.zinc.700)]
                                  disabled:text-current/60
                                `,
                                children.filter(shouldHideItem).length === children.length && `
                                  collapse-fallback
                                `,
                              )}
                              disabled={
                                category === characterUniqueEffect &&
                                characterMap[selectedCharId as keyof typeof characterMap]?.name !== subCategory
                              }
                            >
                              <span className="flex-1 text-left text-sm" aria-hidden="true">
                                {subCategory}
                              </span>
                              <ChevronRight
                                role="img"
                                aria-label={`${subCategory}の詳細指定を${isSubCategoryOpen ? '閉じる' : '開く'}`}
                                className={twMerge(
                                  'transition-transform duration-200',
                                  isSubCategoryOpen && 'rotate-90',
                                )}
                              />
                            </Toggle.Button>

                            <Toggle.Content
                              className={twMerge(
                                children.filter(shouldHideItem).length === children.length && `
                                  collapse-fallback
                                `,
                              )}
                            >
                              {
                                <ul
                                  className={`
                                    flex flex-col border-t border-zinc-700
                                  `}
                                >
                                  {children.map((item) => (
                                    <li
                                      key={item.id}
                                      className={twMerge(
                                        `
                                          ml-6 border-zinc-700
                                          not-first-of-type:border-t
                                        `,
                                        !item.children && 'pr-8',
                                        shouldHideItem(item) && `
                                          collapse-fallback
                                        `,
                                      )}
                                    >
                                      <Toggle.Root
                                        open={getVisibility(toggleState[item.id])}
                                        onOpenChange={(open) =>
                                          setToggleState((prevState) => ({ ...prevState, [item.id]: open }))
                                        }
                                      >
                                        {({ open: isOpen }) => (
                                          <>
                                            <div
                                              className={`
                                                flex items-center px-4 py-2
                                              `}
                                            >
                                              <EffectItem
                                                item={item}
                                                effectCountMap={effectCountMap}
                                                setEffectCountMap={setEffectCountMap}
                                              />

                                              {item.children && (
                                                <Toggle.Button className="ml-2">
                                                  <ChevronRight
                                                    role="img"
                                                    aria-label={`${item.name}の詳細指定を${isOpen ? '閉じる' : '開く'}`}
                                                    className={twMerge(
                                                      `
                                                        ml-auto
                                                        transition-transform
                                                        duration-200
                                                      `,
                                                      isOpen && 'rotate-90',
                                                    )}
                                                  />
                                                </Toggle.Button>
                                              )}
                                            </div>

                                            <Toggle.Content key={item.id} className={`
                                              flex flex-col
                                            `}>
                                              <ul
                                                className={`
                                                  border-t border-zinc-700
                                                `}
                                              >
                                                {item.children?.map((item) => (
                                                  <li
                                                    key={item.id}
                                                    className={`
                                                      ml-6 flex items-center
                                                      border-zinc-700 py-2 pr-12
                                                      pl-4
                                                      not-first-of-type:border-t
                                                    `}
                                                  >
                                                    <EffectItem
                                                      item={item}
                                                      effectCountMap={effectCountMap}
                                                      setEffectCountMap={setEffectCountMap}
                                                    />
                                                  </li>
                                                ))}
                                              </ul>
                                            </Toggle.Content>
                                          </>
                                        )}
                                      </Toggle.Root>
                                    </li>
                                  ))}
                                </ul>
                              }
                            </Toggle.Content>
                          </>
                        )}
                      </Toggle.Root>
                    ))}
                  </Toggle.Content>
                </div>
              )}
            </Toggle.Root>
          )
        })}
      </div>
    </fieldset>
  )
}

const EffectItem: React.FC<{
  item: (typeof relicCategories)[number]['children'][number]['children'][number]
  effectCountMap: EffectCountState<number>
  setEffectCountMap: React.Dispatch<React.SetStateAction<EffectCountState<number>>>
}> = ({ item, effectCountMap, setEffectCountMap }) => {
  const hasChildEffectSelected = item.children?.some((child) => !!effectCountMap[child.id])
  const isShowingCount = item.maxStacks > 1 || item.children?.some((child) => child.maxStacks > 1)

  return (
    <>
      <Checkbox
        value={item.id}
        className="flex-1"
        checked={!!effectCountMap[item.id]}
        onChange={() => {
          setEffectCountMap((prev) => toggleRecord(prev, item.id, { count: 1 }))
        }}
        disabled={hasChildEffectSelected}
      >
        <span className="text-sm">{item.name}</span>
      </Checkbox>
      {isShowingCount ? (
        <input
          type="number"
          name={`effects.${item.id}.count`}
          className={`
            ml-auto rounded border border-zinc-600 text-right
            disabled:border-zinc-800 disabled:text-gray-500/50
          `}
          aria-label={`${item.name}の必要効果数`}
          disabled={!effectCountMap[item.id] || hasChildEffectSelected}
          min={1}
          max={item.maxStacks}
          value={effectCountMap[item.id]?.count ?? 1}
          onChange={(event) => {
            const value = event.target.valueAsNumber

            setEffectCountMap((prev) => (prev[item.id] == null ? prev : { ...prev, [item.id]: { count: value } }))
          }}
        />
      ) : (
        <input type="hidden" name={`effects.${item.id}.count`} value="1" disabled={effectCountMap[item.id] == null} />
      )}
    </>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toggleRecord<Key extends keyof any, Value>(
  obj: Record<Key, Value>,
  key: Key,
  value: Value,
): Record<Key, Value> {
  if (obj[key]) {
    const { [key]: _, ...rest } = obj
    return rest as Record<Key, Value>
  } else {
    return { ...obj, [key]: value }
  }
}

type SearchInputProps = {
  value: string
  setValue: (value: string) => void
}

/**
 * 効果名で絞り込むための入力コンポーネント
 *
 * - IME 入力中は入力値を更新しない
 *
 * @param props - {@link SearchInputProps}
 */
const SearchInput: React.FC<SearchInputProps> = (props) => {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const isComposingRef = useRef(false)

  useEffect(() => {
    const controller = new AbortController()

    window.addEventListener(
      'keydown',
      (event) => {
        if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) return
        if (event.key === '/') {
          event.preventDefault()
          inputRef.current?.focus()
        }
      },
      { signal: controller.signal },
    )

    return () => {
      controller.abort()
    }
  }, [])

  return (
    <label className="relative flex items-center gap-2">
      <TextSearch aria-label="効果名で絞り込む" />

      <input
        ref={inputRef}
        type="text"
        className="rounded border border-white/50 px-2 py-1"
        placeholder="効果名で絞り込む"
        value={value}
        onChange={(event) => {
          const value = event.target.value
          setValue(value)
          if (isComposingRef.current) return
          props.setValue(value.trim())
        }}
        onCompositionStart={() => (isComposingRef.current = true)}
        onCompositionEnd={(event) => {
          isComposingRef.current = false
          props.setValue(event.currentTarget.value.trim())
        }}
        data-1p-ignore
      />

      {props.value.length > 0 && (
        <button
          aria-label="入力をクリア"
          type="button"
          onClick={() => {
            setValue('')
            props.setValue('')
          }}
          className={'absolute top-1/2 right-2 -translate-y-1/2 transform'}
        >
          <CircleXIcon className="size-4" />
        </button>
      )}
    </label>
  )
}
