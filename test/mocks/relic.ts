import { Relic, RelicColorBase } from '~/data/relics'

type Params = Partial<Parameters<typeof Relic.new>[0]>

/**
 * テスト用の遺物データを生成する
 *
 * @param [params] - {@link Params}
 */
export function mockRelic({
  id = Math.random().toString(36).substring(2, 15),
  color = RelicColorBase.Red,
  effects = [7126000],
  itemId = 1,
  dn,
}: Params): Relic {
  return Relic.new({
    id: `relic-${id}`,
    color,
    effects,
    itemId,
    dn,
  })
}

type ColoredParams = Exclude<Params, 'color' | 'dn'>

/** 燃える景色の遺物を生成する */
mockRelic.red = (props?: ColoredParams) => mockRelic({ color: RelicColorBase.Red, ...props })

/** 滴る景色の遺物を生成する */
mockRelic.blue = (props?: ColoredParams) => mockRelic({ color: RelicColorBase.Blue, ...props })

/** 静まる景色の遺物を生成する */
mockRelic.green = (props?: ColoredParams) => mockRelic({ color: RelicColorBase.Green, ...props })

/** 輝く景色の遺物を生成する */
mockRelic.yellow = (props?: ColoredParams) => mockRelic({ color: RelicColorBase.Yellow, ...props })

/** 燃える昏景の遺物を生成する */
mockRelic.deepRed = (props?: ColoredParams) => mockRelic({ color: RelicColorBase.Red, dn: true, ...props })

/** 滴る昏景の遺物を生成する */
mockRelic.deepBlue = (props?: ColoredParams) => mockRelic({ color: RelicColorBase.Blue, dn: true, ...props })

/** 静まる昏景の遺物を生成する */
mockRelic.deepGreen = (props?: ColoredParams) => mockRelic({ color: RelicColorBase.Green, dn: true, ...props })

/** 輝く昏景の遺物を生成する */
mockRelic.deepYellow = (props?: ColoredParams) => mockRelic({ color: RelicColorBase.Yellow, dn: true, ...props })
