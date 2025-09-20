import { expect, test, describe } from 'vitest'
import { vesselsByCharacterMap } from '~/data/vessels'
import { RelicColorBase } from '~/data/relics'
import { mockRelic } from '~/test/mocks/relic'
import { simulate } from './simulator'

describe('マッチするパターン', () => {
  test('マッチするパターン', async () => {
    const vessels = vesselsByCharacterMap['revenant']
    const red = mockRelic({ color: RelicColorBase.Red, effects: [7082600] })
    const relics = [red]

    const result = await simulate({
      vessels,
      relics,
      requiredEffects: [
        {
          effectIds: [7082600],
          count: 1,
        },
      ],
    })

    // assert: マッチするパターン
    expect(result).toEqual({
      success: true,
      data: [
        {
          vessel: vessels.find((v) => v.name.includes('復讐者の盃')),
          relics: [relics[0]],
          relicsIndexes: {
            [red.id]: 0,
          },
        },
      ],
    })
  })

  test('グループ内の異なる効果IDでマッチする', async () => {
    const vessels = vesselsByCharacterMap['revenant']
    const red = mockRelic({ color: RelicColorBase.Red, effects: [7000300] }) // 筋力+1
    const blue = mockRelic({ color: RelicColorBase.Blue, effects: [7000301] }) // 筋力+2
    const green = mockRelic({ color: RelicColorBase.Green, effects: [7000302] }) // 筋力+3
    const relics = [red, blue, green]

    const result = await simulate({
      vessels,
      relics,
      requiredEffects: [
        {
          effectIds: [7000300, 7000301, 7000302], // 筋力+1~+3のどれか
          count: 3,
        },
      ],
    })

    expect(result).toEqual({
      success: true,
      data: [
        {
          vessel: vessels.find((v) => v.name.includes('復讐者の高杯')),
          // TODO: 並び順に関係なく、含まれていればOKになるようにする
          relics: [relics[1], relics[2], relics[0]],
          relicsIndexes: {
            [blue.id]: 0,
            [green.id]: 1,
            [red.id]: 2,
          },
        },
      ],
    })
  })

  describe('ビルドの遺物の並び順', () => {
    test('遺物を献器のスロットの色順に並べ替える', async () => {
      const vessels = vesselsByCharacterMap['ironeye']
        // 赤青黄の順の献器
        .filter((v) => v.name.includes('鉄の目の盃'))
      const blue = mockRelic({ color: RelicColorBase.Blue, effects: [7126000] })
      const yellow = mockRelic({ color: RelicColorBase.Yellow, effects: [7126000] })
      const red = mockRelic({ color: RelicColorBase.Red, effects: [7126000] })
      const relics = [blue, yellow, red]

      const result = await simulate({
        vessels,
        relics,
        requiredEffects: [{ effectIds: [7126000], count: 3 }],
      })

      // assert: 献器の色スロットの順番に並べ替える
      expect(result).toEqual({
        success: true,
        data: [
          {
            vessel: vessels[0],
            relics: [red, blue, yellow],
            relicsIndexes: {
              [red.id]: 0,
              [blue.id]: 1,
              [yellow.id]: 2,
            },
          },
        ],
      })
    })

    test('自由枠は最後に並べ替える', async () => {
      const vessels = vesselsByCharacterMap['ironeye']
        // 赤緑白の順の献器
        .filter((v) => v.name.includes('鉄の目の高杯'))
      const green = mockRelic({ color: RelicColorBase.Green, effects: [7126000] })
      const yellow = mockRelic({ color: RelicColorBase.Yellow, effects: [7126000] })
      const red = mockRelic({ color: RelicColorBase.Red, effects: [7126000] })
      const relics = [green, yellow, red]

      const result = await simulate({
        vessels,
        relics,
        requiredEffects: [{ effectIds: [7126000], count: 3 }],
      })

      // assert: 自由枠は最後に並べ替える
      expect(result).toEqual({
        success: true,
        data: [
          {
            vessel: vessels[0],
            relics: [red, green, yellow],
            relicsIndexes: {
              [red.id]: 0,
              [green.id]: 1,
              [yellow.id]: 2,
            },
          },
        ],
      })
    })

    test('同じ色の遺物はID順に並べ替える', async () => {
      const vessels = vesselsByCharacterMap['ironeye']
        // 黄黄黄の順の献器
        .filter((v) => v.name.includes('黄金樹の聖杯'))
      const yellow1 = mockRelic({ id: '1', color: RelicColorBase.Yellow, effects: [7126000] })
      const yellow2 = mockRelic({ id: '2', color: RelicColorBase.Yellow, effects: [7126000] })
      const yellow3 = mockRelic({ id: '3', color: RelicColorBase.Yellow, effects: [7126000] })
      const relics = [yellow3, yellow1, yellow2]

      const result = await simulate({
        vessels,
        relics,
        requiredEffects: [{ effectIds: [7126000], count: 3 }],
      })

      // assert: 遺物をID順に並べ替える
      expect(result).toEqual({
        success: true,
        data: [
          {
            vessel: vessels[0],
            relics: [yellow1, yellow2, yellow3],
            relicsIndexes: {
              [yellow1.id]: 0,
              [yellow2.id]: 1,
              [yellow3.id]: 2,
            },
          },
        ],
      })
    })
  })
})

describe('マッチしないパターン', () => {
  test.each([2, 3])('同じ遺物を%d個選ぶと失敗する', async (count) => {
    const { vessels, relics, effectId } = setup()
    const result = await simulate({
      vessels,
      relics,
      requiredEffects: [{ effectIds: [effectId], count }],
    })

    expect(result.success).toBe(false)
  })

  function setup() {
    const effectId = 7126000
    const vessels = vesselsByCharacterMap['revenant']
    const relics = [mockRelic({ color: RelicColorBase.Blue, effects: [effectId] })]

    return { vessels, relics, effectId }
  }
})
