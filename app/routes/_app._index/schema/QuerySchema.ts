import * as v from 'valibot'
import { setWith } from 'es-toolkit/compat'
import { characterMap } from '~/data/characters'
import { Relic } from '~/data/relics'

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
    v.pipe(
      v.string(),
      v.transform(Number),
      v.number(),
      v.integer(),
      v.minValue(1),
      v.maxValue(Relic.MAX_EFFECTS),
    ),
  ),
  excludeDepthsRelics: v.pipe(
    /**
     * 厳密には `'on' | undefined` だが、 `v.optional(v.literal('on'), v.transform(...))` とすると optional の場合に transform が呼ばれないため literal チェックを外す
     */
    v.optional(v.string(), 'off'), v.transform((input) => input === 'on'),
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
