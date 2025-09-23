import React, { useRef, useState } from 'react'
import type { FieldMetadata } from '@conform-to/react'
import { ChevronRight, TextSearch, CircleXIcon } from 'lucide-react'
import { set } from 'es-toolkit/compat'
import { twMerge } from 'tailwind-merge'
import { Checkbox } from '../forms/Checkbox'
import { Toggle } from '../Toggle'
import { relicCategories } from './data'

type EffectCountState<Type extends string | number> = {
  [effectIds: string]: { count: Type }
}

type Props = {
  meta: FieldMetadata<EffectCountState<number>>
}

/**
 * ビルド条件として要求する遺物効果と必要数を選択するコンポーネント
 *
 * @param props - {@link Props}
 */
export const BuildCriteria: React.FC<Props> = ({ meta }) => {
  const [filterText, setFilterText] = useState('')
  const [showSelectedOnly, setShowSelectedOnly] = useState(false)
  const [effectCountMap, setEffectCountMap] = useState(() => {
    return Object.entries((meta.value || {}) as EffectCountState<string>).reduce<EffectCountState<number>>(
      (acc, [key, { count }]) => set(acc, key, { count: Number(count) }),
      {},
    )
  })

  return (
    <fieldset className="flex h-full min-h-0 flex-col">
      <legend className="text-[15px] text-gray-300">遺物効果</legend>

      <div className="flex items-end justify-between bg-zinc-800">
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
        {relicCategories.map(({ category, children }) => {
          const flattenChildren = children.flatMap((item) => item.children)
          const invisibleEffectIds = flattenChildren.reduce<string[]>((acc, effect) => {
            const isUnselectedInShowMode = showSelectedOnly && effectCountMap[effect.id] == null
            const isFilteredOut = filterText !== '' && !effect.name.includes(filterText)

            return isUnselectedInShowMode || isFilteredOut ? acc.concat(effect.id) : acc
          }, [])

          const invisible = invisibleEffectIds.length === flattenChildren.length

          return (
            <Toggle.Root key={category} storage={category}>
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
                  {({ open }) => (
                    <>
                      <span className="text-sm font-bold" aria-hidden="true">
                        {category}
                      </span>
                      <ChevronRight
                        role="img"
                        aria-label={`${category}の詳細指定を${open ? '閉じる' : '開く'}`}
                        className={twMerge(
                          `
                          ml-auto transition-transform duration-200
                        `,
                          open && `rotate-90`,
                        )}
                      />
                    </>
                  )}
                </Toggle.Button>
                <Toggle.Content className={`flex flex-col bg-zinc-700/20`}>
                  {children.map(({ category, children }) => (
                    <Toggle.Root key={category} storage={category} defaultOpen={false}>
                      <Toggle.Button
                        className={`
                          sticky top-10 z-20 flex items-center gap-4 border-t
                          border-t-zinc-700 bg-zinc-800 py-2 pr-4 pl-6
                          shadow-[0_1px_0_0_theme(colors.zinc.700)]
                        `}
                      >
                        {({ open }) => (
                          <>
                            <span className="flex-1 text-left text-sm" aria-hidden="true">
                              {category}
                            </span>
                            <ChevronRight
                              role="img"
                              aria-label={`${category}の詳細指定を${open ? '閉じる' : '開く'}`}
                              className={twMerge(
                                `
                                transition-transform duration-200
                              `,
                                open && `rotate-90`,
                              )}
                            />
                          </>
                        )}
                      </Toggle.Button>

                      <Toggle.Content>
                        {
                          <ul className="flex flex-col border-t border-zinc-700">
                            {children.map((item) => (
                              <li
                                key={item.id}
                                className={twMerge(
                                  `
                                    ml-6 border-zinc-700
                                    not-first-of-type:border-t
                                  `,
                                  !item.children && 'pr-8',
                                  invisibleEffectIds.includes(item.id) &&
                                    `
                                    collapse-fallback
                                  `,
                                )}
                              >
                                <Toggle.Root storage={item.id} defaultOpen={false}>
                                  <div className="flex items-center px-4 py-2">
                                    <EffectItem
                                      item={item}
                                      effectCountMap={effectCountMap}
                                      setEffectCountMap={setEffectCountMap}
                                    />

                                    {item.children && (
                                      <Toggle.Button className="ml-2">
                                        {({ open }) => (
                                          <ChevronRight
                                            role="img"
                                            aria-label={`${item.name}の詳細指定を${open ? '閉じる' : '開く'}`}
                                            className={twMerge(
                                              `
                                                ml-auto transition-transform
                                                duration-200
                                              `,
                                              open && `rotate-90`,
                                            )}
                                          />
                                        )}
                                      </Toggle.Button>
                                    )}
                                  </div>

                                  <Toggle.Content
                                    key={item.id}
                                    className={`
                                    flex flex-col
                                  `}
                                  >
                                    <ul className="border-t border-zinc-700">
                                      {item.children?.map((item) => (
                                        <li
                                          key={item.id}
                                          className={`
                                            ml-6 flex items-center
                                            border-zinc-700 py-2 pr-12 pl-4
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
                                </Toggle.Root>
                              </li>
                            ))}
                          </ul>
                        }
                      </Toggle.Content>
                    </Toggle.Root>
                  ))}
                </Toggle.Content>
              </div>
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
  const isShowingCount = item.stacksWithSelf || item.children?.some((child) => child.stacksAcrossLevels)

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
          max={6}
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
  const isComposingRef = useRef(false)

  return (
    <label className="relative flex items-center gap-2">
      <TextSearch aria-label="効果名で絞り込む" />

      <input
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
          className={`
            absolute top-1/2 right-2 -translate-y-1/2 transform text-white/60
          `}
        >
          <CircleXIcon className="size-4" />
        </button>
      )}
    </label>
  )
}
