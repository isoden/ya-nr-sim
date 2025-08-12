import React, { useRef, useState } from 'react'
import { PlusIcon, MinusIcon, ChevronRight, TextSearch, CircleXIcon } from 'lucide-react'
import { set } from 'es-toolkit/compat'
import { twMerge } from 'tailwind-merge'
import { relicCategoryEntries } from '~/data/relics'
import { Checkbox } from './forms/Checkbox'
import { Toggle } from './Toggle'

type Props = {
  defaultValue?: { [id: string]: { count: string } }
}

/**
 * 遺物効果を選択するためのコンボボックスコンポーネント
 *
 * @param props - {@link Props}
 */
export const RelicEffectSelector: React.FC<Props> = ({ defaultValue }) => {
  const [filterText, setFilterText] = useState('')
  const [showSelectedOnly, setShowSelectedOnly] = useState(false)
  const [effectCountMap, setEffectCountMap] = useState(() => {
    if (!defaultValue) return {}
    return Object.entries(defaultValue).reduce<Record<string, { count: number }>>(
      (acc, [key, { count }]) => set(acc, key, { count: Number(count) }),
      {},
    )
  })

  return (
    <fieldset>
      <legend className="text-[15px] text-gray-300">遺物効果</legend>

      <div className="flex items-end justify-between sticky top-0 z-10 bg-zinc-900 pb-4">
        <Checkbox
          disabled={!showSelectedOnly && !Object.keys(effectCountMap).length}
          checked={showSelectedOnly}
          onChange={setShowSelectedOnly}
          className="has-[:disabled]:opacity-60"
        >
          選択した効果のみ表示
        </Checkbox>

        <SearchInput value={filterText} setValue={setFilterText} />
      </div>

      <div className="flex flex-col gap-4">
        {relicCategoryEntries.map(({ name, unselectable, children = [] }) => {
          const invisibleEffectIds = children.reduce<string[]>((acc, effect) => {
            const isUnselectedInShowMode = showSelectedOnly && effectCountMap[effect.id] == null
            const isFilteredOut = filterText !== '' && !effect.name.includes(filterText)

            return isUnselectedInShowMode || isFilteredOut ? acc.concat(effect.id) : acc
          }, [])

          const invisible = invisibleEffectIds.length === children.length
          const rootReadOnly = unselectable

          return (
            <Toggle.Root key={name} storage={name}>
              <div
                className={twMerge(
                  'group border bg-zinc-800 border-zinc-700 rounded-md relative',
                  invisible && 'collapse-fallback',
                )}
                aria-hidden={invisible}
              >
                <Toggle.Button className="w-full px-4 py-3 leading-0 flex items-center rounded-tr-md rounded-tl-md not-[:open]:rounded-br-md not-[:open]:rounded-bl-md">
                  {({ open }) => (
                    <>
                      <span className="text-sm font-bold">{name}</span>
                      <span className="ml-auto" aria-hidden={true}>
                        {open ? <MinusIcon /> : <PlusIcon />}
                      </span>
                    </>
                  )}
                </Toggle.Button>
                <Toggle.Content className="max-h-80 overflow-y-scroll bg-zinc-900 rounded-br-md flex flex-col rounded-bl-md">
                  {children.map((effect, index) => (
                    <Toggle.Root key={effect.id} storage={effect.id} defaultOpen={false}>
                      <div
                        key={effect.id}
                        className={twMerge(
                          'border-t border-t-zinc-800 grid grid-cols-[1fr_auto_theme(spacing.6)] items-center gap-4',
                          invisibleEffectIds.includes(effect.id) && 'collapse-fallback',
                          !rootReadOnly && 'px-4 py-2',
                          rootReadOnly && index % 2 === 0 && 'bg-zinc-800/80',
                          rootReadOnly && index % 2 === 1 && 'bg-zinc-800/50',
                        )}
                      >
                        {rootReadOnly ? (
                          <Toggle.Button className="px-4 py-2 grid grid-cols-subgrid col-span-full">
                            {({ open }) => (
                              <>
                                <span className="text-sm text-left col-span-2">{effect.name}</span>
                                <ChevronRight
                                  role="img"
                                  aria-label={`${effect.name}の詳細指定を${open ? '閉じる' : '開く'}`}
                                  className={twMerge('transition-transform duration-200', open && 'rotate-90')}
                                />
                              </>
                            )}
                          </Toggle.Button>
                        ) : (
                          <>
                            <Checkbox
                              value={effect.id}
                              checked={effectCountMap[effect.id] != null}
                              onChange={() => {
                                setEffectCountMap((prev) => toggleRecord(prev, effect.id, { count: 1 }))
                              }}
                            >
                              <span className="text-sm">{effect.name}</span>
                            </Checkbox>
                            <input
                              type="number"
                              name={`effects.${effect.id}.count`}
                              className="disabled:text-gray-500/50 border border-zinc-600 rounded text-right disabled:border-zinc-800"
                              disabled={effectCountMap[effect.id] == null}
                              min={1}
                              max={effect.stackable ? 3 : 1}
                              value={effectCountMap[effect.id]?.count ?? 1}
                              onChange={(event) => {
                                const value = event.target.valueAsNumber

                                setEffectCountMap((prev) =>
                                  prev[effect.id] == null ? prev : { ...prev, [effect.id]: { count: value } },
                                )
                              }}
                            />
                            {!!effect.children && (
                              <Toggle.Button>
                                {({ open }) => (
                                  <ChevronRight
                                    role="img"
                                    aria-label={`${effect.name}の詳細指定を${open ? '閉じる' : '開く'}`}
                                    className={twMerge('transition-transform duration-200', open && 'rotate-90')}
                                  />
                                )}
                              </Toggle.Button>
                            )}
                          </>
                        )}
                      </div>

                      <Toggle.Content>
                        {!invisibleEffectIds.includes(effect.id) && (
                          <ul className={twMerge('flex flex-col border-t border-zinc-800', !rootReadOnly && 'pl-6')}>
                            {effect.children?.map((item) => (
                              <li
                                key={item.id}
                                className="not-first-of-type:border-t border-zinc-800 flex justify-between px-4 py-2"
                              >
                                {rootReadOnly ? (
                                  <Checkbox
                                    value={item.id}
                                    checked={effectCountMap[item.id] != null}
                                    onChange={() => {
                                      setEffectCountMap((prev) => toggleRecord(prev, item.id, { count: 1 }))
                                    }}
                                  >
                                    <span className="text-sm">{item.name}</span>
                                  </Checkbox>
                                ) : (
                                  <Checkbox disabled className="has-[:disabled]:opacity-60">
                                    <span className="text-sm">{item.name}</span>
                                  </Checkbox>
                                )}
                                {rootReadOnly ? (
                                  <input
                                    type="number"
                                    name={`effects.${item.id}.count`}
                                    className="disabled:text-gray-500/50 border border-zinc-600 rounded text-right disabled:border-zinc-800"
                                    disabled={effectCountMap[item.id] == null}
                                    min={1}
                                    max={item.stackable ? 3 : 1}
                                    value={effectCountMap[item.id]?.count ?? 1}
                                    onChange={(event) => {
                                      const value = event.target.valueAsNumber

                                      setEffectCountMap((prev) =>
                                        prev[item.id] == null ? prev : { ...prev, [item.id]: { count: value } },
                                      )
                                    }}
                                  />
                                ) : (
                                  <input
                                    type="number"
                                    className="disabled:text-gray-500/50"
                                    disabled
                                    min={1}
                                    max={3}
                                    defaultValue={1}
                                  />
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
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

function toggleRecord<Key extends keyof any, Value>(
  obj: Record<Key, Value>,
  key: Key,
  value: Value,
): Record<Key, Value> {
  if (!!obj[key]) {
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
    <label className="flex items-center gap-2 relative">
      <TextSearch aria-label="効果名で絞り込む" />

      <input
        type="text"
        className="border border-white/50 py-1 px-2 rounded"
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
          className="absolute top-1/2 transform -translate-y-1/2 right-2 text-white/60"
        >
          <CircleXIcon className="size-4" />
        </button>
      )}
    </label>
  )
}
