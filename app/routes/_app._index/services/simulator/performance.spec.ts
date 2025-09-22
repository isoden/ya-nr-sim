import { test, expect, describe } from 'vitest'
import { performance } from 'perf_hooks'
import { vesselsByCharacterMap } from '~/data/vessels'
import { simulate } from './simulator'
import { fakeRelic } from '~/test/mocks/relic'

// 環境別の閾値設定
const isCI = process.env.CI === 'true'
const THRESHOLDS = {
  medium: isCI ? 5000 : 3000,
  large: isCI ? 15000 : 10000,
  ratio: 50, // データ量10倍に対する処理時間の許容倍率
}

/**
 * 複数回実行して統計的に評価
 */
async function measurePerformance(
  testFn: () => Promise<void>,
  iterations: number = 5,
): Promise<{ average: number; median: number; max: number; min: number }> {
  const results: number[] = []

  for (let i = 0; i < iterations; i++) {
    const start = performance.now()
    await testFn()
    results.push(performance.now() - start)
  }

  results.sort((a, b) => a - b)

  return {
    average: results.reduce((sum, time) => sum + time, 0) / results.length,
    median: results[Math.floor(results.length / 2)],
    max: Math.max(...results),
    min: Math.min(...results),
  }
}

/**
 * パフォーマンス回帰テスト
 * 統計的測定と相対比較でflaky testを回避
 *
 * TODO: セットアップする
 */
describe.skip('Performance Regression Tests', () => {
  test('相対的パフォーマンス比較 - スケーラビリティ検証', async () => {
    const vessels = vesselsByCharacterMap['revenant']

    // ベースライン: 小さなデータセット (10遺物)
    const smallRelics = generateLargeRelicSet(10, { requiredEffectRatio: 0.3 })
    const baselineMetrics = await measurePerformance(async () => {
      const result = await simulate({
        vessels,
        relics: smallRelics,
        requiredEffects: [{ effectIds: [7000300], count: 1 }],
        volume: 5,
      })
      expect(result.success).toBe(true)
    }, 3)

    // テスト対象: 中規模データセット (100遺物)
    const mediumRelics = generateLargeRelicSet(100, { requiredEffectRatio: 0.3 })
    const testMetrics = await measurePerformance(async () => {
      const result = await simulate({
        vessels,
        relics: mediumRelics,
        requiredEffects: [
          { effectIds: [7000300, 7000301], count: 2 },
          { effectIds: [7000400], count: 1 },
        ],
        volume: 10,
      })
      expect(result.success).toBe(true)
    }, 3)

    // データ量10倍に対して処理時間の増加率をチェック
    const ratio = testMetrics.median / baselineMetrics.median
    expect(ratio).toBeLessThan(THRESHOLDS.ratio)

    // 絶対時間でも念のためチェック（中央値使用で安定化）
    expect(testMetrics.median).toBeLessThan(THRESHOLDS.medium)

    console.log(`Performance comparison (100 vs 10 relics):`)
    console.log(
      `  Baseline: avg=${baselineMetrics.average.toFixed(2)}ms, median=${baselineMetrics.median.toFixed(2)}ms`,
    )
    console.log(`  Test: avg=${testMetrics.average.toFixed(2)}ms, median=${testMetrics.median.toFixed(2)}ms`)
    console.log(`  Ratio: ${ratio.toFixed(2)}x (threshold: ${THRESHOLDS.ratio}x)`)
  })

  test('フィルタリング効果の統計的測定', async () => {
    const vessels = vesselsByCharacterMap['revenant']

    // フィルタリング効果なし: 全遺物が関連
    const allRelevantRelics = generateLargeRelicSet(100, { requiredEffectRatio: 1.0 })
    const noFilterMetrics = await measurePerformance(async () => {
      const result = await simulate({
        vessels,
        relics: allRelevantRelics,
        requiredEffects: [{ effectIds: [7000300], count: 1 }],
        volume: 5,
      })
      expect(result.success).toBe(true)
    }, 3)

    // フィルタリング効果あり: 少数の遺物のみ関連
    const filteredRelics = generateLargeRelicSet(100, { requiredEffectRatio: 0.1 })
    const filteredMetrics = await measurePerformance(async () => {
      const result = await simulate({
        vessels,
        relics: filteredRelics,
        requiredEffects: [{ effectIds: [7000300], count: 1 }],
        volume: 5,
      })
      expect(result.success).toBe(true)
    }, 3)

    // フィルタリング効果で処理時間が短縮されているかチェック
    const improvement = noFilterMetrics.median / filteredMetrics.median
    expect(improvement).toBeGreaterThan(1.5) // 最低50%の改善を期待

    console.log(`Filtering effect measurement:`)
    console.log(`  No filter (100% relevant): median=${noFilterMetrics.median.toFixed(2)}ms`)
    console.log(`  Filtered (10% relevant): median=${filteredMetrics.median.toFixed(2)}ms`)
    console.log(`  Improvement: ${improvement.toFixed(2)}x faster`)
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
  return Array.from({ length: count }, (_, i) => fakeRelic({ id: `${i + 1}` }))
}
