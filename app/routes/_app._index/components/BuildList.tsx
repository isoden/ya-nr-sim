import React, { Suspense } from 'react'
import { Await } from 'react-router'
import { RelicInfo } from '~/components/RelicInfo/RelicInfo'
import { SlotColor } from '~/data/vessels'
import type { Build, Result } from '../services/simulator/types'

type Props = {
  resultKey: string

  /** 深層の遺物を除外した場合に true */
  excludeDepthsRelics?: boolean

  /** 検索結果 */
  result: Promise<Result> | undefined
}

/**
 * 検索結果を表示するコンポーネント
 *
 * @param props - {@link Props}
 */
export const BuildList: React.FC<Props> = ({ resultKey, excludeDepthsRelics, result }) => {
  return (
    <section
      className={`
        overflow-y-scroll rounded-lg border border-gray-400/10 bg-zinc-950/20
        p-6 shadow
      `}
      tabIndex={0}
    >
      <h2 className="text-lg font-semibold text-accent-light">検索結果</h2>

      <div className="mt-6 flex flex-col gap-6">
        <Suspense key={resultKey} fallback={<p>検索中...</p>}>
          <Await resolve={result} errorElement={<Failure>検索中にエラーが発生しました</Failure>}>
            {(result) =>
              !result
                ? (
                    <Idle />
                  )
                : result.success
                  ? (
                      <Success builds={result.data} excludeDepthsRelics={excludeDepthsRelics} />
                    )
                  : (
                      <Failure>{result.error.message}</Failure>
                    )}
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
function Success({ builds, excludeDepthsRelics }: { builds: Build[]; excludeDepthsRelics?: boolean }) {
  // 深層の遺物を除外する場合遺物を最大3つまでしか装備できないため、 スロット表示も3つまでに制限する
  const sliceEnd = excludeDepthsRelics ? 3 : 6

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
            #
            {i + 1}
            {' '}
            -
            {' '}
            {item.vessel.name}
          </h3>
          <ul className="flex gap-2">
            {item.vessel.slots.slice(0, sliceEnd).map((slot, i) => {
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
          {item.vessel.slots.slice(0, sliceEnd).map((slot, index) => {
            const relic = item.relics.find((r) => item.relicsIndexes[r.id] === index)

            return (
              <li key={index} className="contents">
                {relic
                  ? <RelicInfo relic={relic} />
                  : (
                      <EmptySlot color={slot} />
                    )}
              </li>
            )
          })}
        </ul>
      </div>
    )
  })
}

function EmptySlot({ color }: { color: SlotColor }) {
  return (
    <div className={`
      grid place-items-center rounded-sm border border-dashed border-zinc-800
      text-sm text-zinc-400
    `}
    >
      <div className="flex min-h-20 items-center gap-2">
        空きスロット
        <div className={`
          size-4
          ${bgColorMap[color]}
        `}
        />

      </div>
    </div>
  )
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
