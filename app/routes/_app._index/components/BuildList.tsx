import React, { Suspense } from 'react'
import { Await } from 'react-router'
import { relicEffectMap, demeritDepthsRelicEffectMap } from '~/data/relics'
import { SlotColor } from '~/data/vessels'
import type { Build, Result } from '../services/simulator/types'

type Props = {
  resultKey: string

  /** 検索結果 */
  result: Promise<Result> | undefined
}

/**
 * 検索結果を表示するコンポーネント
 *
 * @param props - {@link Props}
 */
export const BuildList: React.FC<Props> = ({ resultKey, result }) => {
  return (
    <section
      className={`
      overflow-y-scroll rounded-lg border border-gray-400/10 bg-zinc-950/20 p-6
      shadow
    `}
    >
      <h2 className="text-lg font-semibold">検索結果</h2>

      <div className="mt-6 flex flex-col gap-6">
        <Suspense key={resultKey} fallback={<p>検索中...</p>}>
          <Await resolve={result} errorElement={<Failure>検索中にエラーが発生しました</Failure>}>
            {(result) =>
              !result ? (
                <Idle />
              ) : result.success ? (
                <Success builds={result.data} />
              ) : (
                <Failure>{result.error.message}</Failure>
              )
            }
          </Await>
        </Suspense>
      </div>
    </section>
  )
}

/**
 * 初期表示
 */
function Idle() {
  return <p>条件を指定してください</p>
}

/**
 * 検索結果を表示するコンポーネント
 *
 * @param props
 */
function Success({ builds }: { builds: Build[] }) {
  return builds.map((item, i) => {
    return (
      <div
        key={`${item.vessel.name}.${i}`}
        // TODO: use column-rule instead
        className={`
          before:mb-6 before:block before:h-px before:w-full
          before:bg-gray-400/20
          first:before:hidden
        `}
      >
        <header className="flex items-center gap-2">
          <h3 className="font-bold">
            #{i + 1} - {item.vessel.name}
          </h3>
          <ul className="flex gap-2">
            {item.vessel.slots.map((slot, i) => {
              return (
                <li
                  key={`${slot}.${i}`}
                  className={`
                  relative size-5
                  ${bgColorMap[slot]}
                `}
                >
                  <span className="sr-only">{slot}</span>
                </li>
              )
            })}
          </ul>
        </header>

        <ul className="mt-4 grid grid-cols-3 gap-4">
          {item.relics.map((relic) => (
            <li key={relic.id}>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">{relic.name}</span>
                <span
                  className={`
                  relative size-5
                  ${bgColorMap[relic.colorExtended]}
                `}
                />
              </div>
              <ul className="mt-2 list-inside list-disc text-sm">
                {relic.pairedEffectIds.map(([effectId, demeritEffectId], i) => {
                  return (
                    <li key={`${effectId}.${i}`} className="mt-1">
                      {relicEffectMap[effectId].name}

                      {demeritEffectId && (
                        <ul className="mt-1 pl-5 text-xs text-red-400">
                          <li className="text-red-400">{demeritDepthsRelicEffectMap[demeritEffectId].name}</li>
                        </ul>
                      )}
                    </li>
                  )
                })}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    )
  })
}

/**
 * 検索結果が見つからなかった場合の表示
 *
 * @param props
 */
function Failure({ children }: { children: React.ReactNode }) {
  return <p className="text-red-500">{children}</p>
}

const bgColorMap = {
  [SlotColor.Red]: 'bg-red-500',
  [SlotColor.Blue]: 'bg-blue-500',
  [SlotColor.Green]: 'bg-green-500',
  [SlotColor.Yellow]: 'bg-yellow-500',
  [SlotColor.DeepRed]: 'bg-red-800',
  [SlotColor.DeepBlue]: 'bg-blue-800',
  [SlotColor.DeepGreen]: 'bg-green-800',
  [SlotColor.DeepYellow]: 'bg-yellow-800',
  [SlotColor.Free]: 'bg-gray-500',
}
