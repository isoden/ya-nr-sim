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

        <table className={`
          text-sm
          [--border-color:theme(colors.zinc.800)]
        `}
        >
          <thead className={`
            sticky top-0 left-0 bg-primary-dark
            shadow-[0_1px_0_0_theme(colors.zinc.800)]
          `}
          >
            <tr>
              <th className="px-3 py-3 text-left">
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
                  className={twMerge(`w-20 px-3 py-3`, highlightCol === i && `
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
                      border-b border-(--border-color) bg-black/30 px-3 py-3
                      font-bold
                    `}
                    colSpan={11}
                  >
                    {day}
                    日目
                  </td>
                </tr>
                {bosses.map((boss) => (
                  <tr key={boss}>
                    <td className="border-b border-(--border-color) px-3 py-3">
                      <a className="mr-1" href={`https://kamikouryaku.net/nightreign_eldenring/?${boss}`} rel="noreferrer">{boss}</a>
                      {(day === 3 && boss !== Boss.Heolstor) && (
                        <>
                          (
                          <a href={`https://kamikouryaku.net/nightreign_eldenring/?${boss}(常夜の王)`} rel="noreferrer">常夜の王</a>
                          )
                        </>
                      )}
                    </td>
                    {
                      [
                        join(bossTable[boss].魔),
                        join(bossTable[boss].炎),
                        join(bossTable[boss].雷),
                        join(bossTable[boss].聖),
                        join(bossTable[boss].血),
                        join(bossTable[boss].毒),
                        join(bossTable[boss].腐),
                        join(bossTable[boss].冷),
                        join(bossTable[boss].眠),
                      ].map((value, i) => (
                        <td
                          key={i}
                          className={twMerge(`
                            border-b border-(--border-color) px-3 py-3
                            text-center
                          `, highlightCol === i && 'bg-white/5')}
                        >
                          {value}
                        </td>
                      ))
                    }
                  </tr>
                ))}
              </tbody>
            ))}
        </table>
      </div>

    </div>
  )
}

function join(array: string | string[]): string {
  return (Array.isArray(array) ? array : [array]).join(' / ')
}
