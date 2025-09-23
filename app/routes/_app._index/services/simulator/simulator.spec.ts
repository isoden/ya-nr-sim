import { expect, test, describe } from 'vitest'
import { SlotColor, vesselsByCharacterMap } from '~/data/vessels'
import { RelicColorBase } from '~/data/relics'
import { fakeRelic } from '~/test/mocks/relic'
import { getVesselBySlots } from '~/test/helpers/vessel'
import { simulate } from './simulator'

describe('マッチするパターン', () => {
  test('マッチするパターン', async () => {
    const vessels = vesselsByCharacterMap['revenant']
    const red = fakeRelic({ color: RelicColorBase.Red, effects: [7082600] })
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
      volume: 1,
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
    const red = fakeRelic.red({ effects: [7000300] }) // 筋力+1
    const blue = fakeRelic.blue({ effects: [7000301] }) // 筋力+2
    const green = fakeRelic.green({ effects: [7000302] }) // 筋力+3
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
      const vessels = [getVesselBySlots([SlotColor.Red, SlotColor.Blue, SlotColor.Yellow])]
      const blue = fakeRelic({ color: RelicColorBase.Blue, effects: [7126000] })
      const yellow = fakeRelic({ color: RelicColorBase.Yellow, effects: [7126000] })
      const red = fakeRelic({ color: RelicColorBase.Red, effects: [7126000] })
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
      const vessels = [getVesselBySlots([SlotColor.Red, SlotColor.Green, SlotColor.Free])]
      const green = fakeRelic({ color: RelicColorBase.Green, effects: [7126000] })
      const yellow = fakeRelic({ color: RelicColorBase.Yellow, effects: [7126000] })
      const red = fakeRelic({ color: RelicColorBase.Red, effects: [7126000] })
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
      const vessels = [getVesselBySlots([SlotColor.Yellow, SlotColor.Yellow, SlotColor.Yellow])]
      const yellow1 = fakeRelic({ id: '1', color: RelicColorBase.Yellow, effects: [7126000] })
      const yellow2 = fakeRelic({ id: '2', color: RelicColorBase.Yellow, effects: [7126000] })
      const yellow3 = fakeRelic({ id: '3', color: RelicColorBase.Yellow, effects: [7126000] })
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

describe('効果の重複ルール', () => {
  test('stacksWithSelf=trueの効果は重複可能', async () => {
    const vessels = vesselsByCharacterMap['revenant']
    const relic1 = fakeRelic.red({ effects: [7000300] }) // 筋力+1 (stacksWithSelf: true)
    const relic2 = fakeRelic.blue({ effects: [7000301] }) // 筋力+2 (stacksWithSelf: true)
    const relics = [relic1, relic2]

    const result = await simulate({
      vessels,
      relics,
      requiredEffects: [{ effectIds: [7000300, 7000301], count: 2 }],
    })

    // assert: stacksWithSelfの効果は重複可能
    expect(result).toEqual({
      success: true,
      data: [
        {
          vessel: vessels.find((v) => v.name.includes('復讐者の高杯')),
          relics: [relic2, relic1],
          relicsIndexes: {
            [relic2.id]: 0,
            [relic1.id]: 2,
          },
        },
      ],
    })
  })

  test('stacksAcrossLevels=trueの効果は同じIDは1つまで', async () => {
    const vessels = vesselsByCharacterMap['revenant']
    const relic1 = fakeRelic.red({ effects: [7090000] }) // 敵を倒した時のアーツゲージ蓄積増加 (stacksAcrossLevels: true)
    const relic2 = fakeRelic.blue({ effects: [7090000] }) // 同じ効果ID
    const relics = [relic1, relic2]

    const result = await simulate({
      vessels,
      relics,
      requiredEffects: [{ effectIds: [7090000], count: 2 }],
    })

    // assert: 同じ効果IDは1つまでしか装備できない
    expect(result.success).toBe(false)
  })

  test('重複不可の効果は1つまで', async () => {
    const vessels = vesselsByCharacterMap['revenant']
    const relic1 = fakeRelic.red({ effects: [10001] }) // 攻撃を受けると攻撃力上昇 (stacksWithSelf: false, stacksAcrossLevels: undefined)
    const relic2 = fakeRelic.blue({ effects: [10001] }) // 同じ効果ID
    const relics = [relic1, relic2]

    const result = await simulate({
      vessels,
      relics,
      requiredEffects: [{ effectIds: [10001], count: 2 }],
    })

    // assert: 重複不可の効果は1つまでしか装備できない
    expect(result.success).toBe(false)
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
    const relics = [fakeRelic({ color: RelicColorBase.Blue, effects: [effectId] })]

    return { vessels, relics, effectId }
  }
})

test('深層の遺物はフリースロットに装備できない', async () => {
  // arrange: フリースロットを含む献器を使用
  const vessels = [
    getVesselBySlots([
      SlotColor.Red,
      SlotColor.Green,
      SlotColor.Free,
      SlotColor.DeepRed,
      SlotColor.DeepRed,
      SlotColor.DeepGreen,
    ]),
  ]
  // 深層青の遺物（対応する色スロットなし）
  const relics = [fakeRelic.deepBlue({ effects: [7126000] })]

  const result = await simulate({
    vessels,
    relics,
    requiredEffects: [{ effectIds: [7126000], count: 1 }],
  })

  // assert: 深層の遺物はフリースロットに装備できないため失敗する
  expect(result.success).toBe(false)
})

test('通常の遺物はフリースロットに装備できる', async () => {
  // arrange: フリースロットを含む献器を使用
  const vessels = [
    getVesselBySlots([
      SlotColor.Red,
      SlotColor.Green,
      SlotColor.Free,
      SlotColor.DeepRed,
      SlotColor.DeepRed,
      SlotColor.DeepGreen,
    ]),
  ]
  // 青の遺物（対応する色スロットなし、フリーのみ利用可能）
  const normalBlue = fakeRelic.blue({ effects: [7126000] })
  const relics = [normalBlue]

  const result = await simulate({
    vessels,
    relics,
    requiredEffects: [{ effectIds: [7126000], count: 1 }],
  })

  // assert: 通常の遺物はフリースロットに装備できる
  expect(result).toEqual({
    success: true,
    data: [
      {
        vessel: vessels[0],
        relics: [normalBlue],
        relicsIndexes: {
          [normalBlue.id]: 2, // フリースロットのインデックス
        },
      },
    ],
  })
})
