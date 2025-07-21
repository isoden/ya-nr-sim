import { parse } from "qs";
import z from "zod";

const QuerySchema = z.object({
  character: z.string(),
  effects: z.array(z.object({
    id: z.coerce.number(),
    amount: z.coerce.number(),
  })).transform((effects) => effects.filter(effect => effect.id !== 0)),
})

export const parseQuerySchema = (search: string) => {
  try {
    return QuerySchema.parse(parse(search))
  } catch {
    return undefined
  }
}
