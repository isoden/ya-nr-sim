import { expect, test } from 'vitest'
import { getVesselBySlots } from '~/test/helpers/vessel'
import { fakeRelic } from '~/test/mocks/relic'
import { SlotColor, vesselsByCharacterMap } from '~/data/vessels'
import { createBuild } from './createBuild'

test('ビルドの遺物を器の色順に並べる', () => {
  // arrange
  const vessels = vesselsByCharacterMap['revenant']
  const green = fakeRelic.green()
  const blue = fakeRelic.blue()
  const relics = [green, blue]
  const vesselToUse = getVesselBySlots([SlotColor.Blue, SlotColor.Green, SlotColor.Free])

  // act
  const build = createBuild(
    [
      [`vessel.${vesselToUse.id}`, 1],
      [`relic.${green.id}.color`, 1],
      [`relic.${blue.id}.color`, 1],
    ],
    vessels,
    relics,
  )

  // assert
  expect(build).toEqual({
    vessel: vesselToUse,
    sortedRelics: [blue, green, null, null, null, null],
  })
})

test('色が同じ場合はID順に並べる', async () => {
  // arrange
  const vesselToUse = getVesselBySlots([SlotColor.Red, SlotColor.Red, SlotColor.Green])
  const vessels = [vesselToUse]
  const red1 = fakeRelic.red({ id: 'red-1' })
  const red2 = fakeRelic.red({ id: 'red-2' })
  const relics = [red2, red1]

  // act
  const build = createBuild(
    [
      [`vessel.${vesselToUse.id}`, 1],
      [`relic.${red1.id}.color`, 1],
      [`relic.${red2.id}.color`, 1],
    ],
    vessels,
    relics,
  )

  // assert
  expect(build).toEqual({
    vessel: vesselToUse,
    sortedRelics: [red1, red2, null, null, null, null],
  })
})

// [通常,通常,フリー,深層,深層,深層] のスロット順の器に対して、対応する色の遺物を配置する
test('深き夜の献器対応', async () => {
  // arrange
  const vesselToUse = getVesselBySlots([SlotColor.Blue, SlotColor.Green, SlotColor.Free])
  const vessels = [vesselToUse]
  const blue = fakeRelic.blue()
  const green = fakeRelic.green()
  const red = fakeRelic.red()
  const deepYellow = fakeRelic.deepYellow()
  const deepGreen = fakeRelic.deepGreen()
  const relics = [red, deepYellow, deepGreen, blue, green]

  // act
  const build = createBuild(
    [
      [`vessel.${vesselToUse.id}`, 1],
      [`relic.${red.id}.color`, 1],
      [`relic.${blue.id}.color`, 1],
      [`relic.${green.id}.color`, 1],
      [`relic.${deepYellow.id}.color`, 1],
      [`relic.${deepGreen.id}.color`, 1],
    ],
    vessels,
    relics,
  )

  // assert
  expect(build).toEqual({
    vessel: vesselToUse,
    sortedRelics: [blue, green, red, null, deepYellow, deepGreen],
  })
})
