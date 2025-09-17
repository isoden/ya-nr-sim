import { Relic, RelicColorBase } from '~/data/relics'

export function mockRelic({
  id = Math.random().toString(36).substring(2, 15),
  color = RelicColorBase.Red,
  effects = [7126000],
  itemId = 1,
  dn,
}: Partial<Parameters<typeof Relic.new>[0]>): Relic {
  return Relic.new({
    id: `relic-${id}`,
    color,
    effects,
    itemId,
    dn,
  })
}
