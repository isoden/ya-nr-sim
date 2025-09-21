import { bench, describe } from 'vitest'
import { vesselsByCharacterMap } from '~/data/vessels'
import { simulate } from './simulator'
import { mockRelic } from '~/test/mocks/relic'

describe('Simulator Performance Benchmarks', () => {
  // 軽量ケース: 遺物数少・制約シンプル
  bench('small dataset (10 relics, 1 effect)', async () => {
    const vessels = vesselsByCharacterMap['revenant']
    const relics = generateLargeRelicSet(10, {
      requiredEffectRatio: 0.5, // 50%が要求効果を持つ
    })

    await simulate({
      vessels,
      relics,
      requiredEffects: [{ effectIds: [7000300], count: 1 }],
      volume: 5,
    })
  })

  // 中程度ケース: 現実的なデータサイズ
  bench('medium dataset (100 relics, 3 effects)', async () => {
    const vessels = vesselsByCharacterMap['revenant']
    const relics = generateLargeRelicSet(100, {
      requiredEffectRatio: 0.3, // 30%が要求効果を持つ
    })

    await simulate({
      vessels,
      relics,
      requiredEffects: [
        { effectIds: [7000300, 7000301], count: 2 },
        { effectIds: [7000400], count: 1 },
      ],
      volume: 10,
    })
  })

  // 重量ケース: 大規模データセット
  bench('large dataset (500 relics, complex constraints)', async () => {
    const vessels = vesselsByCharacterMap['revenant']
    const relics = generateLargeRelicSet(500, {
      requiredEffectRatio: 0.2, // 20%が要求効果を持つ
    })

    await simulate({
      vessels,
      relics,
      requiredEffects: [
        { effectIds: [7000300, 7000301], count: 3 },
        { effectIds: [7000400], count: 2 },
        { effectIds: [7000500], count: 1 },
      ],
      volume: 20,
    })
  })

  // 極端ケース: フィルタリング効果の測定
  bench('extreme filtering case (1000 relics, very few relevant)', async () => {
    const vessels = vesselsByCharacterMap['revenant']
    const relics = generateLargeRelicSet(1000, {
      requiredEffectRatio: 0.05, // 5%のみが要求効果を持つ
    })

    await simulate({
      vessels,
      relics,
      requiredEffects: [{ effectIds: [7000300], count: 1 }],
      volume: 5,
    })
  })

  // 最悪ケース: ほぼ全ての遺物が関連
  bench('worst case (300 relics, most relevant)', async () => {
    const vessels = vesselsByCharacterMap['revenant']
    const relics = generateLargeRelicSet(300, {
      requiredEffectRatio: 0.9, // 90%が要求効果を持つ
    })

    await simulate({
      vessels,
      relics,
      requiredEffects: [
        { effectIds: [7000300, 7000301, 7000302], count: 2 },
        { effectIds: [7000400, 7000401], count: 1 },
      ],
      volume: 15,
    })
  })
})

function generateLargeRelicSet(
  count: number,
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  _options: {
    requiredEffectRatio: number
  },
) {
  // TODO: requiredEffectRatio に基づいて遺物の効果を調整
  return Array.from({ length: count }, (_, i) => mockRelic({ id: `${i + 1}` }))
}
