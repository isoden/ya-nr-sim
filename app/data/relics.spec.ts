import { describe, expect, test } from 'vitest'
import { fakeRelic } from '~/test/mocks/relic'
import { RelicColorExtended, RelicColorBase } from './relics'

describe('Relic#name', () => {
  describe('遺物(通常)', () => {
    test.each([
      [RelicColorBase.Red, 1, '繊細な燃える景色'],
      [RelicColorBase.Red, 2, '端正な燃える景色'],
      [RelicColorBase.Red, 3, '壮大な燃える景色'],
      [RelicColorBase.Blue, 1, '繊細な滴る景色'],
      [RelicColorBase.Blue, 2, '端正な滴る景色'],
      [RelicColorBase.Blue, 3, '壮大な滴る景色'],
      [RelicColorBase.Green, 1, '繊細な静まる景色'],
      [RelicColorBase.Green, 2, '端正な静まる景色'],
      [RelicColorBase.Green, 3, '壮大な静まる景色'],
      [RelicColorBase.Yellow, 1, '繊細な輝く景色'],
      [RelicColorBase.Yellow, 2, '端正な輝く景色'],
      [RelicColorBase.Yellow, 3, '壮大な輝く景色'],
    ])('色=%s, サイズ=%d => %s', (color, size, expectedName) => {
      const relic = fakeRelic({
        color,
        effects: new Array(size).fill(null).map((_, i) => i + 1),
      })

      expect(relic.name).toBe(expectedName)
    })
  })

  describe('深層の遺物', () => {
    test.each([
      [RelicColorBase.Red, 1, '繊細な燃える昏景'],
      [RelicColorBase.Red, 2, '端正な燃える昏景'],
      [RelicColorBase.Red, 3, '壮大な燃える昏景'],
      [RelicColorBase.Blue, 1, '繊細な滴る昏景'],
      [RelicColorBase.Blue, 2, '端正な滴る昏景'],
      [RelicColorBase.Blue, 3, '壮大な滴る昏景'],
      [RelicColorBase.Green, 1, '繊細な静まる昏景'],
      [RelicColorBase.Green, 2, '端正な静まる昏景'],
      [RelicColorBase.Green, 3, '壮大な静まる昏景'],
      [RelicColorBase.Yellow, 1, '繊細な輝く昏景'],
      [RelicColorBase.Yellow, 2, '端正な輝く昏景'],
      [RelicColorBase.Yellow, 3, '壮大な輝く昏景'],
    ])('色=%s, サイズ=%d => %s', (color, size, expectedName) => {
      const relic = fakeRelic({
        color,
        effects: new Array(size).fill(null).map((_, i) => i + 1),
        dn: true,
      })

      expect(relic.name).toBe(expectedName)
    })
  })

  describe('固有遺物', () => {
    test('itemId のマッピングが定義されている場合、 固有の遺物名を返す', () => {
      const relic = fakeRelic({
        itemId: 16002,
      })

      expect(relic.name).toBe('古びたミニアチュール')
    })
  })
})

describe('Relic#normalizedEffectIds', () => {
  test('effects で重複として定義されている ID を、 基準となる ID に変換する', () => {
    const relic = fakeRelic({
      effects: [7126000, 7126001, 7126002],
    })

    expect(relic.effects).toEqual([7126000, 7126001, 7126002])
    expect(relic.normalizedEffectIds).toEqual([7126000, 7126000, 7126000])
  })
})

describe('Relic#pairedEffectIds', () => {
  test('デメリット遺物効果がない場合', () => {
    const relic = fakeRelic({
      effects: [7126000, 7126001, 7126002],
    })

    expect(relic.pairedEffects).toMatchInlineSnapshot(`
      [
        [
          {
            "id": 7126000,
            "name": "出撃時に「星光の欠片」を持つ",
          },
          [],
        ],
        [
          {
            "id": 7126000,
            "name": "出撃時に「星光の欠片」を持つ",
          },
          [],
        ],
        [
          {
            "id": 7126000,
            "name": "出撃時に「星光の欠片」を持つ",
          },
          [],
        ],
      ]
    `)
  })

  test('デメリット遺物効果がある場合', () => {
    const relic = fakeRelic({
      effects: [7126000, 7126001, 7126002, 6840000],
    })

    /* prettier-ignore */
    expect(relic.pairedEffects).toMatchInlineSnapshot(`
      [
        [
          {
            "id": 7126000,
            "name": "出撃時に「星光の欠片」を持つ",
          },
          [],
        ],
        [
          {
            "id": 7126000,
            "name": "出撃時に「星光の欠片」を持つ",
          },
          [],
        ],
        [
          {
            "id": 7126000,
            "name": "出撃時に「星光の欠片」を持つ",
          },
          [
            {
              "id": 6840000,
              "name": "取得ルーン減少",
            },
          ],
        ],
      ]
    `)
  })
})

describe('Relic#type', () => {
  test.each([
    [false, 'normal'],
    [true, 'depths'],
  ])('dn=%s => %s', (dn, expectedType) => {
    const relic = fakeRelic({ dn })

    expect(relic.type).toEqual(expectedType)
  })
})

describe('Relic#resolvedColor', () => {
  describe('遺物(通常)', () => {
    test.each([
      [RelicColorBase.Red, RelicColorExtended.Red],
      [RelicColorBase.Blue, RelicColorExtended.Blue],
      [RelicColorBase.Green, RelicColorExtended.Green],
      [RelicColorBase.Yellow, RelicColorExtended.Yellow],
    ])('color=%s, dn=false => %s', (color, expectedColor) => {
      const relic = fakeRelic({ color })

      expect(relic.colorExtended).toBe(expectedColor)
    })
  })

  describe('深層の遺物', () => {
    test.each([
      [RelicColorBase.Red, RelicColorExtended.DeepRed],
      [RelicColorBase.Blue, RelicColorExtended.DeepBlue],
      [RelicColorBase.Green, RelicColorExtended.DeepGreen],
      [RelicColorBase.Yellow, RelicColorExtended.DeepYellow],
    ])('color=%s, dn=true => %s', (color, expectedColor) => {
      const relic = fakeRelic({ color, dn: true })

      expect(relic.colorExtended).toBe(expectedColor)
    })
  })
})
