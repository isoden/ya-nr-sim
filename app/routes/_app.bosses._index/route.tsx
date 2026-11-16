import { useState } from 'react'
import { Link } from 'react-router'
import { twMerge } from 'tailwind-merge'
import type { Route } from './+types/route'
import { parseQuerySchema } from './schema'
import { Boss, day1Bosses, day2Bosses, bossTable } from '../_app.bosses/data'

export const clientLoader = async ({ request }: { request: Request }) => {
  const data = parseQuerySchema(new URL(request.url).search)

  return { day3Boss: data.q }
}

export default function Route({ loaderData }: Route.ComponentProps) {
  const { day3Boss } = loaderData
  const [highlightCol, setHighlightCol] = useState(-1)

  console.log({ day3Boss })

  return (
    <div className="flex h-full min-h-0 flex-col gap-y-5">
      <div className="mt-8 flex flex-wrap gap-4">
        {[
          Boss.Gladius,
          Boss.Adel,
          Boss.Gnoster,
          Boss.Maris,
          Boss.Libra,
          Boss.Fulghor,
          Boss.Caligo,
          Boss.Heolstor,
        ].map((boss) => (
          <Link
            to={`./?q=${boss}`}
            key={boss}
            className="nav-link flex gap-1 text-accent-light"
            aria-current={day3Boss === boss ? 'page' : undefined}
            replace
          >
            {boss}
          </Link>
        ))}
      </div>

      <div className="grid overflow-y-auto">

        <table className="text-sm [--border-color:var(--color-zinc-800)]">
          <thead className={`
            sticky top-0 left-0 bg-primary-dark
            shadow-[0_1px_0_0_var(--color-zinc-800)]
          `}
          >
            <tr>
              <th className="p-3 text-left">
                ボス
              </th>
              {[
                '魔力',
                '炎',
                '雷',
                '聖',
                '出血',
                '毒',
                '腐敗',
                '凍傷',
                '睡眠',
              ].map((label, i) => (
                <th
                  key={label}
                  className={twMerge(`w-20 p-3`, highlightCol === i && `
                    bg-white/5
                  `)}
                  onPointerEnter={() => setHighlightCol(i)}
                  onPointerLeave={() => setHighlightCol(-1)}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>

          {([
            [1, day1Bosses.filter(([, bosses]) => bosses.has(day3Boss)).map(([boss]) => boss)],
            [2, day2Bosses.filter(([, bosses]) => bosses.has(day3Boss)).map(([boss]) => boss)],
          ] as [number, Boss[]][])
            .concat([[3, [day3Boss]]])
            .map(([day, bosses]) => (
              <tbody key={day}>
                <tr>
                  <td
                    className={`
                      border-b border-(--border-color) bg-black/30 p-3 font-bold
                    `}
                    colSpan={11}
                  >
                    {day}
                    日目
                  </td>
                </tr>
                {bosses.map((boss) => (
                  <tr key={boss}>
                    <td className="border-b border-(--border-color) p-3">
                      <a className="mr-1" href={`https://kamikouryaku.net/nightreign_eldenring/?${boss}`} rel="noreferrer">{boss}</a>
                      {(day === 3 && boss !== Boss.Heolstor) && (
                        <>
                          (
                          <a href={`https://kamikouryaku.net/nightreign_eldenring/?${boss}(常夜の王)`} rel="noreferrer">常夜の王</a>
                          )
                        </>
                      )}
                    </td>
                    {attributeKeys.map((attribute, i) => (
                      <td
                        key={attribute}
                        className={twMerge(`
                          border-b border-(--border-color) p-3 text-center
                        `, highlightCol === i && 'bg-white/5')}
                      >
                        {join(bossTable[boss][attribute])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ))}
        </table>
      </div>

    </div>
  )
}

/** 表の列順に並べた属性キー（ヘッダーの並びと一致させる） */
const attributeKeys = ['魔', '炎', '雷', '聖', '血', '毒', '腐', '冷', '眠'] as const satisfies (keyof (typeof bossTable)[Boss])[]

function join(array: string | string[]): string {
  return (Array.isArray(array) ? array : [array]).join(' / ')
}
