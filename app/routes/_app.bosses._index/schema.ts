import * as v from 'valibot'
import { set } from 'es-toolkit/compat'
import { Boss } from '../_app.bosses/data'

export const QuerySchema = v.object({
  q: v.fallback(v.picklist([
    Boss.Gladius,
    Boss.Adel,
    Boss.Gnoster,
    Boss.Maris,
    Boss.Libra,
    Boss.Fulghor,
    Boss.Caligo,
    Boss.Heolstor,
  ]), Boss.Gladius),
})

export const parseQuerySchema = (search: string) => {
  const parsed = Array.from(new URLSearchParams(search)).reduce(
    (acc, [key, value]) => set(acc, key, value),
    Object.create(null),
  )
  console.log(parsed)
  return v.parse(QuerySchema, parsed)
}
