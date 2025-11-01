import * as v from 'valibot'
import { RelicColorBase } from '~/data/relics'

export const LoaderSchema = v.object({
  color: v.array(v.picklist([RelicColorBase.Red, RelicColorBase.Blue, RelicColorBase.Green, RelicColorBase.Yellow])),
  type: v.array(v.picklist(['normal', 'depths'])),
  size: v.array(v.picklist(['small', 'medium', 'large'])),
  effectIds: v.array(v.string()),
  page: v.nullable(v.pipe(v.string(), v.transform(Number), v.integer(), v.minValue(1)), '1'),
})

export const parseLoaderSchema = (data: unknown) => {
  return v.parse(LoaderSchema, data)
}
