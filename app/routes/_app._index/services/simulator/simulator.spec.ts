import { expect, test, describe } from 'vitest'
import { SlotColor, vesselsByCharacterMap } from '~/data/vessels'
import { RelicColorBase } from '~/data/relics'
import { fakeRelic } from '~/test/mocks/relic'
import { getVesselBySlots } from '~/test/helpers/vessel'
import { $e } from '~/test/helpers/relicEffect'
import { simulate } from './simulator'

describe('マッチするパターン', () => {
  test('マッチするパターン', async () => {
    const vessels = vesselsByCharacterMap['revenant']
    const red = fakeRelic({ color: RelicColorBase.Red, effects: [$e`聖印の武器種を3つ以上装備していると最大FP上昇`] })
    const relics = [red]

    const result = await simulate({
      vessels,
      relics,
      requiredEffects: [
        {
          effectIds: [$e`聖印の武器種を3つ以上装備していると最大FP上昇`],
          count: 1,
        },
      ],
      notEffects: [],
      excludeDepthsRelics: false,
      volume: 1,
    })

    // assert: マッチするパターン
    expect(result).toEqual({
      success: true,
      data: [
        {
          vessel: vessels.find((v) => v.name.includes('復讐者の盃')),
          sortedRelics: [relics[0], null, null, null, null, null],
        },
      ],
    })
  })

  test('グループ内の異なる効果IDでマッチする', async () => {
    const vessels = vesselsByCharacterMap['revenant']
    const red = fakeRelic.red({ effects: [$e`筋力+1`] })
    const blue = fakeRelic.blue({ effects: [$e`筋力+2`] })
    const green = fakeRelic.green({ effects: [$e`筋力+3`] })
    const relics = [red, blue, green]

    const result = await simulate({
      vessels,
      relics,
      requiredEffects: [
        {
          effectIds: [$e`筋力+1`, $e`筋力+2`, $e`筋力+3`], // 筋力+1~+3のどれか
          count: 3,
        },
      ],
      notEffects: [],
      excludeDepthsRelics: false,
    })

    expect(result).toEqual({
      success: true,
      data: [
        {
          vessel: vessels.find((v) => v.name.includes('復讐者の高杯')),
          sortedRelics: [relics[1], relics[2], relics[0], null, null, null],
        },
      ],
    })
  })

  describe('ビルドの遺物の並び順', () => {
    test('遺物を献器のスロットの色順に並べ替える', async () => {
      const vessels = [getVesselBySlots([SlotColor.Red, SlotColor.Blue, SlotColor.Yellow])]
      const blue = fakeRelic({ color: RelicColorBase.Blue, effects: [$e`出撃時に「星光の欠片」を持つ`] })
      const yellow = fakeRelic({ color: RelicColorBase.Yellow, effects: [$e`出撃時に「星光の欠片」を持つ`] })
      const red = fakeRelic({ color: RelicColorBase.Red, effects: [$e`出撃時に「星光の欠片」を持つ`] })
      const relics = [blue, yellow, red]

      const result = await simulate({
        vessels,
        relics,
        requiredEffects: [{ effectIds: [$e`出撃時に「星光の欠片」を持つ`], count: 3 }],
        notEffects: [],
        excludeDepthsRelics: false,
      })

      // assert: 献器の色スロットの順番に並べ替える
      expect(result).toEqual({
        success: true,
        data: [
          {
            vessel: vessels[0],
            sortedRelics: [red, blue, yellow, null, null, null],
          },
        ],
      })
    })

    test('自由枠は最後に並べ替える', async () => {
      const vessels = [getVesselBySlots([SlotColor.Red, SlotColor.Green, SlotColor.Free])]
      const green = fakeRelic({ color: RelicColorBase.Green, effects: [$e`出撃時に「星光の欠片」を持つ`] })
      const yellow = fakeRelic({ color: RelicColorBase.Yellow, effects: [$e`出撃時に「星光の欠片」を持つ`] })
      const red = fakeRelic({ color: RelicColorBase.Red, effects: [$e`出撃時に「星光の欠片」を持つ`] })
      const relics = [green, yellow, red]

      const result = await simulate({
        vessels,
        relics,
        requiredEffects: [{ effectIds: [$e`出撃時に「星光の欠片」を持つ`], count: 3 }],
        notEffects: [],
        excludeDepthsRelics: false,
      })

      // assert: 自由枠は最後に並べ替える
      expect(result).toEqual({
        success: true,
        data: [
          {
            vessel: vessels[0],
            sortedRelics: [red, green, yellow, null, null, null],
          },
        ],
      })
    })

    test('同じ色の遺物はID順に並べ替える', async () => {
      const vessels = [getVesselBySlots([SlotColor.Yellow, SlotColor.Yellow, SlotColor.Yellow])]
      const yellow1 = fakeRelic({ id: '1', color: RelicColorBase.Yellow, effects: [$e`出撃時に「星光の欠片」を持つ`] })
      const yellow2 = fakeRelic({ id: '2', color: RelicColorBase.Yellow, effects: [$e`出撃時に「星光の欠片」を持つ`] })
      const yellow3 = fakeRelic({ id: '3', color: RelicColorBase.Yellow, effects: [$e`出撃時に「星光の欠片」を持つ`] })
      const relics = [yellow3, yellow1, yellow2]

      const result = await simulate({
        vessels,
        relics,
        requiredEffects: [{ effectIds: [$e`出撃時に「星光の欠片」を持つ`], count: 3 }],
        notEffects: [],
        excludeDepthsRelics: false,
      })

      // assert: 遺物をID順に並べ替える
      expect(result).toEqual({
        success: true,
        data: [
          {
            vessel: vessels[0],
            sortedRelics: [yellow1, yellow2, yellow3, null, null, null],
          },
        ],
      })
    })
  })
})

describe('カテゴリ制約', () => {
  test('必要な効果が左側優先ルールで無効化される場合はマッチしない', async () => {
    // arrange: 黄色遺物と緑遺物にそれぞれ戦技カテゴリの効果を持たせる
    const vessels = [getVesselBySlots([SlotColor.Yellow, SlotColor.Green, SlotColor.Green])]
    const yellow = fakeRelic.yellow({ effects: [$e`出撃時の武器の戦技を「輝剣の円陣」にする`, $e`最大HP上昇(+10%)`] }) // category: 戦技
    const green = fakeRelic.green({ effects: [$e`出撃時の武器の戦技を「グラビタス」にする`] }) // category: 戦技
    const relics = [yellow, green]

    // act: グラビタスと最大HP上昇の両方を要求
    const result = await simulate({
      vessels,
      relics,
      requiredEffects: [
        { effectIds: [$e`最大HP上昇(+10%)`], count: 1 },
        { effectIds: [$e`出撃時の武器の戦技を「グラビタス」にする`], count: 1 },
      ],
      notEffects: [],
      excludeDepthsRelics: false,
      volume: 5,
    })

    // assert: 最大HP上昇を組み込むには黄色遺物が必要だが、
    // 左側優先ルールにより輝剣の円陣が有効になりグラビタスが無効化されるため、マッチしない
    expect(result).toEqual(noSolutionFound)
  })

  test('カテゴリ重複があっても、必要な効果が左側で有効になる場合はマッチする', async () => {
    // arrange: 黄色遺物と緑遺物にそれぞれ戦技カテゴリの効果を持たせる
    const vessels = [getVesselBySlots([SlotColor.Yellow, SlotColor.Green, SlotColor.Green])]
    const yellow = fakeRelic.yellow({ effects: [$e`出撃時の武器の戦技を「輝剣の円陣」にする`] }) // category: 戦技
    const green = fakeRelic.green({ effects: [$e`出撃時の武器の戦技を「グラビタス」にする`, $e`最大HP上昇(+10%)`] }) // category: 戦技
    const relics = [yellow, green]

    // act: 輝剣の円陣と最大HP上昇を要求
    const result = await simulate({
      vessels,
      relics,
      requiredEffects: [
        { effectIds: [$e`最大HP上昇(+10%)`], count: 1 },
        { effectIds: [$e`出撃時の武器の戦技を「輝剣の円陣」にする`], count: 1 },
      ],
      notEffects: [],
      excludeDepthsRelics: false,
      volume: 5,
    })

    // assert: 戦技が重複するが、左側の輝剣の円陣が有効になり、
    // 要求されている効果は満たされるためマッチする
    expect(result).toEqual({
      success: true,
      data: [
        {
          vessel: vessels[0],
          sortedRelics: [yellow, green, null, null, null, null],
        },
      ],
    })
  })

  test('カテゴリが異なる効果は重複可能', async () => {
    // arrange
    const vessels = [getVesselBySlots([SlotColor.Yellow, SlotColor.Green])]
    const yellow = fakeRelic.yellow({ effects: [$e`出撃時の武器の戦技を「輝剣の円陣」にする`] }) // category: 戦技
    const green = fakeRelic.green({ effects: [$e`出撃時の武器に魔力攻撃力を付加`] }) // category: 属性・状態異常付与
    const relics = [yellow, green]

    // act
    const result = await simulate({
      vessels,
      relics,
      requiredEffects: [
        { effectIds: [$e`出撃時の武器の戦技を「輝剣の円陣」にする`], count: 1 },
        { effectIds: [$e`出撃時の武器に魔力攻撃力を付加`], count: 1 },
      ],
      notEffects: [],
      excludeDepthsRelics: false,
      volume: 1,
    })

    // assert: カテゴリが異なれば両方含まれる
    expect(result).toEqual({
      success: true,
      data: [
        {
          vessel: vessels[0],
          sortedRelics: [yellow, green, null, null, null, null],
        },
      ],
    })
  })
})

describe('効果の重複ルール', () => {
  test('stacksWithSelf=trueの効果は重複可能', async () => {
    const vessels = vesselsByCharacterMap['revenant']
    const relic1 = fakeRelic.red({ effects: [$e`筋力+1`] }) // stacksWithSelf: true
    const relic2 = fakeRelic.blue({ effects: [$e`筋力+2`] }) // stacksWithSelf: true
    const relics = [relic1, relic2]

    const result = await simulate({
      vessels,
      relics,
      requiredEffects: [{ effectIds: [$e`筋力+1`, $e`筋力+2`], count: 2 }],
      notEffects: [],
      excludeDepthsRelics: false,
    })

    // assert: stacksWithSelfの効果は重複可能
    expect(result).toEqual({
      success: true,
      data: [
        {
          vessel: vessels.find((v) => v.name.includes('復讐者の高杯')),
          sortedRelics: [relic2, null, relic1, null, null, null],
        },
      ],
    })
  })

  test('stacksAcrossLevels=trueの効果は同じIDは1つまで', async () => {
    const vessels = vesselsByCharacterMap['revenant']
    const relic1 = fakeRelic.red({ effects: [$e`敵を倒した時のアーツゲージ蓄積増加`] }) // stacksAcrossLevels: true
    const relic2 = fakeRelic.blue({ effects: [$e`敵を倒した時のアーツゲージ蓄積増加`] }) // 同じ効果ID
    const relics = [relic1, relic2]

    const result = await simulate({
      vessels,
      relics,
      requiredEffects: [{ effectIds: [$e`敵を倒した時のアーツゲージ蓄積増加`], count: 2 }],
      notEffects: [],
      excludeDepthsRelics: false,
    })

    // assert: stacksAcrossLevels=true なので同じ効果IDは1つまで
    // 2つのビルドが見つかるが、どちらも1つの遺物のみ
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.every((build) => build.sortedRelics.filter((relic) => relic !== null).length === 1)).toBe(true)
    }
  })

  test('重複不可の効果(stacksWithSelf: false)は制約で1個に制限される', async () => {
    const vessels = vesselsByCharacterMap['revenant']
    const relic1 = fakeRelic.red({ effects: [$e`攻撃を受けると攻撃力上昇`] }) // stacksWithSelf: false
    const relic2 = fakeRelic.blue({ effects: [$e`攻撃を受けると攻撃力上昇`] }) // 同じ効果ID
    const relics = [relic1, relic2]

    const result = await simulate({
      vessels,
      relics,
      requiredEffects: [{ effectIds: [$e`攻撃を受けると攻撃力上昇`], count: 2 }],
      notEffects: [],
      excludeDepthsRelics: false,
    })

    // assert: 制約により1つまでしか装備できない
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.every((build) => build.sortedRelics.filter((relic) => relic !== null).length === 1)).toBe(true)
    }
  })
})

describe('マッチしないパターン', () => {
  test.each([2, 3])('同じ遺物を%d個選ぶと失敗する', async (count) => {
    const { vessels, relics, effectId } = setup()
    const result = await simulate({
      vessels,
      relics,
      requiredEffects: [{ effectIds: [effectId], count }],
      notEffects: [],
      excludeDepthsRelics: false,
    })

    expect(result).toEqual(noSolutionFound)
  })

  function setup() {
    const effectId = $e`出撃時に「星光の欠片」を持つ`
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
  const relics = [fakeRelic.deepBlue({ effects: [$e`出撃時に「星光の欠片」を持つ`] })]

  const result = await simulate({
    vessels,
    relics,
    requiredEffects: [{ effectIds: [$e`出撃時に「星光の欠片」を持つ`], count: 1 }],
    notEffects: [],
    excludeDepthsRelics: false,
  })

  // assert: 深層の遺物はフリースロットに装備できないため失敗する
  expect(result).toEqual(noSolutionFound)
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
  const normalBlue = fakeRelic.blue({ effects: [$e`出撃時に「星光の欠片」を持つ`] })
  const relics = [normalBlue]

  const result = await simulate({
    vessels,
    relics,
    requiredEffects: [{ effectIds: [$e`出撃時に「星光の欠片」を持つ`], count: 1 }],
    notEffects: [],
    excludeDepthsRelics: false,
  })

  // assert: 通常の遺物はフリースロットに装備できる
  expect(result).toEqual({
    success: true,
    data: [
      {
        vessel: vessels[0],
        sortedRelics: [null, null, normalBlue, null, null, null],
      },
    ],
  })
})

describe('stacksAcrossLevels統合テスト', () => {
  test('カンマ区切りで複数効果を指定した場合、どれでもマッチする', async () => {
    const vessels = vesselsByCharacterMap['revenant']
    const relic1 = fakeRelic.red({ effects: [$e`筋力+1`] }) // stacksWithSelf: true
    const relic2 = fakeRelic.blue({ effects: [$e`筋力+2`] }) // stacksWithSelf: true
    const relics = [relic1, relic2]

    // カンマ区切りで複数効果を指定（count: 2なので両方必要）
    const result = await simulate({
      vessels,
      relics,
      requiredEffects: [
        { effectIds: [$e`筋力+1`, $e`筋力+2`, $e`筋力+3`], count: 2 },
      ],
      notEffects: [],
      excludeDepthsRelics: false,
      volume: 1,
    })

    // 両方の遺物が選択される
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data[0]?.sortedRelics.filter((relic) => relic !== null).length).toBe(2)
    }
  })

  test('stacksAcrossLevelsでない効果は統合されない', async () => {
    const vessels = vesselsByCharacterMap['revenant']
    const relic1 = fakeRelic.red({ effects: [$e`筋力+1`] }) // stacksWithSelf: true
    const relic2 = fakeRelic.blue({ effects: [$e`筋力+2`] }) // stacksWithSelf: true
    const relics = [relic1, relic2]

    // 個別選択 - 統合されないので別々の制約として扱われる
    const result = await simulate({
      vessels,
      relics,
      requiredEffects: [
        { effectIds: [$e`筋力+1`], count: 1 },
        { effectIds: [$e`筋力+2`], count: 1 },
      ],
      notEffects: [],
      excludeDepthsRelics: false,
      volume: 1,
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data[0]?.sortedRelics.filter((relic) => relic !== null).length).toBe(2)
    }
  })
})

describe('リグレッションテスト', () => {
  test('複数の効果グループを同時に要求した際のマッチング (Issue: 効果係数の重複カウント)', async () => {
    // arrange
    const vessels = vesselsByCharacterMap['wylder']
    const vitality = fakeRelic.red({ effects: [$e`生命力+1`] })
    const magic1 = fakeRelic.blue({ effects: [$e`敵を倒した時のアーツゲージ蓄積増加`] })
    const magic2 = fakeRelic.yellow({ effects: [$e`敵を倒した時のアーツゲージ蓄積増加+1`] })
    const relics = [vitality, magic1, magic2]

    // act
    const result = await simulate({
      vessels,
      relics,
      requiredEffects: [
        {
          effectIds: [$e`生命力+1`, $e`生命力+2`, $e`生命力+3`], // 生命力効果のいずれか
          count: 1,
        },
        {
          effectIds: [$e`敵を倒した時のアーツゲージ蓄積増加`, $e`敵を倒した時のアーツゲージ蓄積増加+1`], // アーツゲージ蓄積増加のいずれか
          count: 2,
        },
      ],
      notEffects: [],
      excludeDepthsRelics: false,
      volume: 1,
    })

    // assert
    expect(result).toEqual({
      success: true,
      data: [
        {
          vessel: vessels.find((v) => v.name.includes('追跡者の高杯')),
          sortedRelics: [vitality, magic2, magic1, null, null, null],
        },
      ],
    })
  })

  test('単一効果グループでは正常に動作する', async () => {
    // arrange
    const vessels = vesselsByCharacterMap['wylder']
    const vitality = fakeRelic.red({ effects: [$e`生命力+1`] })

    // act
    const result = await simulate({
      vessels,
      relics: [vitality],
      requiredEffects: [
        {
          effectIds: [$e`生命力+1`, $e`生命力+2`, $e`生命力+3`],
          count: 1,
        },
      ],
      notEffects: [],
      excludeDepthsRelics: false,
      volume: 1,
    })

    // assert
    expect(result).toEqual({
      success: true,
      data: [
        {
          vessel: vessels.find((v) => v.name.includes('追跡者の器')),
          sortedRelics: [vitality, null, null, null, null, null],
        },
      ],
    })
  })
})

const noSolutionFound = { success: false, error: new Error('No solution found') }
