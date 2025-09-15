import * as v from 'valibot'
import { setWith } from 'es-toolkit/compat'
import { characterMap } from '~/data/characters'

const QuerySchema = v.object({
  charId: v.picklist([
    characterMap.wylder.id,
    characterMap.guardian.id,
    characterMap.ironeye.id,
    characterMap.duchess.id,
    characterMap.raider.id,
    characterMap.revenant.id,
    characterMap.recluse.id,
    characterMap.executor.id,
  ]),
  effects: v.record(
    v.string(),
    v.object({
      count: v.pipe(v.string(), v.transform(Number), v.number(), v.integer(), v.minValue(1), v.maxValue(3)),
    }),
  ),
})

export const parseQuerySchema = (search: string) => {
  try {
    const parsed = Array.from(new URLSearchParams(search)).reduce(
      (acc, [key, value]) => setWith(acc, key, value, Object),
      Object.create(null),
    )
    return v.parse(QuerySchema, parsed)
  } catch {
    return undefined
  }
}
