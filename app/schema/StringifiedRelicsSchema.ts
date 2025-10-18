import * as v from 'valibot'
import { Relic, RelicColorBase } from '~/data/relics'

export type RelicSchema = v.InferInput<typeof RelicSchema>
const RelicSchema = v.object({
  /** 遺物ID */
  id: v.string(),

  /** 遺物の色 */
  color: v.enum(RelicColorBase),

  /** 遺物効果IDのリスト */
  effects: v.pipe(v.array(v.pipe(v.number(), v.integer())), v.minLength(1), v.maxLength(Relic.MAX_EFFECTS)),

  /** 遺物に紐づくアイテムID */
  itemId: v.pipe(v.number(), v.integer()),

  /** 深層の遺物フラグ */
  dn: v.optional(v.boolean(), false),

  /** 売却不可フラグ */
  unsellable: v.optional(v.boolean(), false),
})

export const StringifiedRelicsSchema = v.union([
  v.pipe(v.string(), v.transform(JSON.parse), v.array(RelicSchema)),
  v.pipe(
    v.null(),
    v.transform(() => []),
  ),
])

export const parseStringifiedRelicsSchema = (value: string | null) => {
  return v.parse(StringifiedRelicsSchema, value)
}
