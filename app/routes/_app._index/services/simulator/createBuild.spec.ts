import { expect, test } from 'vitest'
import { Vessel, vesselsByCharacterMap } from '~/data/vessels'
import { Relic, RelicColorBase } from '~/data/relics'
import { createBuild } from './createBuild'

test('ビルドの遺物を器の色順に並べる', () => {
  // arrange
  const vessels = vesselsByCharacterMap['revenant']
  const green = Relic.new({
    id: 'relic-green',
    color: RelicColorBase.Green,
    effects: [7082600],
    itemId: 1,
  })
  const blue = Relic.new({
    id: 'relic-blue',
    color: RelicColorBase.Blue,
    effects: [7126000, 7126001, 7126002],
    itemId: 2,
  })
  const relics = [green, blue]
  const vesselToUse = getVesselByName('復讐者の高杯')

  // act
  const build = createBuild(
    [
      [`vessel.${vesselToUse.id}`, 1],
      ['relic.relic-green.color', 1],
      ['relic.relic-blue.color', 1],
    ],
    vessels,
    relics,
  )

  // assert
  expect(build).toEqual({
    vessel: vesselToUse,
    relics: [blue, green],
    relicsIndexes: {
      [blue.id]: 0,
      [green.id]: 1,
    },
  })
})

test('色が同じ場合はID順に並べる', async () => {
  // arrange
  const vesselToUse = getVesselByName('復讐者の盃')
  const vessels = [vesselToUse]
  const red1 = Relic.new({
    id: 'relic-red-1',
    color: RelicColorBase.Red,
    effects: [7126000],
    itemId: 1,
  })
  const red2 = Relic.new({
    id: 'relic-red-2',
    color: RelicColorBase.Red,
    effects: [7082600],
    itemId: 2,
  })
  const relics = [red2, red1]

  // act
  const build = createBuild(
    [
      [`vessel.${vesselToUse.id}`, 1],
      ['relic.relic-red-1.color', 1],
      ['relic.relic-red-2.color', 1],
    ],
    vessels,
    relics,
  )

  // assert
  expect(build).toEqual({
    vessel: vesselToUse,
    relics: [red1, red2],
    relicsIndexes: {
      [red1.id]: 0,
      [red2.id]: 1,
    },
  })
})

// [通常,通常,フリー,深層,深層,深層] のスロット順の器に対して、対応する色の遺物を配置する
test('深き夜の献器対応', async () => {
  // arrange
  const vesselToUse = getVesselByName('復讐者の高杯')
  const vessels = [vesselToUse]
  const blue1 = Relic.new({
    id: 'relic-blue-1',
    color: RelicColorBase.Blue,
    effects: [7126000],
    itemId: 1,
  })
  const green1 = Relic.new({
    id: 'relic-green-1',
    color: RelicColorBase.Green,
    effects: [7082600],
    itemId: 2,
  })
  const red1 = Relic.new({
    id: 'relic-red-1',
    color: RelicColorBase.Red,
    effects: [7082600],
    itemId: 3,
  })
  const deepYellow1 = Relic.new({
    id: 'relic-deep-yellow-1',
    color: RelicColorBase.Yellow,
    effects: [7082600],
    itemId: 4,
    dn: true,
  })
  const deepGreen1 = Relic.new({
    id: 'relic-deep-green-1',
    color: RelicColorBase.Green,
    effects: [7082600],
    itemId: 4,
    dn: true,
  })
  const relics = [red1, deepYellow1, deepGreen1, blue1, green1]

  // act
  const build = createBuild(
    [
      [`vessel.${vesselToUse.id}`, 1],
      ['relic.relic-red-1.color', 1],
      ['relic.relic-blue-1.color', 1],
      ['relic.relic-green-1.color', 1],
      ['relic.relic-deep-yellow-1.color', 1],
      ['relic.relic-deep-green-1.color', 1],
    ],
    vessels,
    relics,
  )

  // assert
  expect(build).toEqual({
    vessel: vesselToUse,
    relics: [blue1, green1, red1, deepYellow1, deepGreen1],
    relicsIndexes: {
      [blue1.id]: 0,
      [green1.id]: 1,
      [red1.id]: 2,
      [deepYellow1.id]: 4,
      [deepGreen1.id]: 5,
    },
  })
})

function getVesselByName(name: string): Vessel {
  const vessel = Object.values(vesselsByCharacterMap)
    .flat()
    .find((vessel) => vessel.name === name)

  if (!vessel) {
    throw new Error(`Vessel with name "${name}" not found`)
  }

  return vessel
}
