import { expect, test } from 'vitest'
import { SlotColor } from '~/data/vessels'
import { fakeRelic } from '~/test/mocks/relic'
import { getVesselBySlots } from '~/test/helpers/vessel'
import { $e } from '~/test/helpers/relicEffect'
import { satisfiesCategoryConstraints } from './categoryFilter'
import type { Build, RequiredEffects } from './types'

test('カテゴリに属さない効果のみの場合、全て有効', () => {
  // arrange
  const vessel = getVesselBySlots([SlotColor.Yellow, SlotColor.Green])
  const yellow = fakeRelic.yellow({ effects: [$e`最大HP上昇(+10%)`] }) // no category
  const green = fakeRelic.green({ effects: [$e`最大HP上昇(+10%)`] }) // no category
  const build: Build = {
    vessel,
    sortedRelics: [yellow, green],
  }
  const requiredEffects: RequiredEffects = [{ effectIds: [$e`最大HP上昇(+10%)`], count: 2 }]

  // act
  const result = satisfiesCategoryConstraints(build, requiredEffects)

  // assert
  expect(result).toBe(true)
})

test('同じカテゴリの効果が複数ある場合、左側のみ有効', () => {
  // arrange
  const vessel = getVesselBySlots([SlotColor.Yellow, SlotColor.Green])
  const yellow = fakeRelic.yellow({ effects: [$e`出撃時の武器の戦技を「輝剣の円陣」にする`] }) // category: 戦技
  const green = fakeRelic.green({ effects: [$e`出撃時の武器の戦技を「グラビタス」にする`] }) // category: 戦技
  const build: Build = {
    vessel,
    sortedRelics: [yellow, green],
  }

  // 輝剣の円陣が必要な場合
  const requiredEffects1: RequiredEffects = [{ effectIds: [$e`出撃時の武器の戦技を「輝剣の円陣」にする`], count: 1 }]
  expect(satisfiesCategoryConstraints(build, requiredEffects1)).toBe(true)

  // グラビタスが必要な場合（左側の輝剣の円陣が優先されるため満たせない）
  const requiredEffects2: RequiredEffects = [{ effectIds: [$e`出撃時の武器の戦技を「グラビタス」にする`], count: 1 }]
  expect(satisfiesCategoryConstraints(build, requiredEffects2)).toBe(false)
})

test('カテゴリ効果と非カテゴリ効果の混在', () => {
  // arrange
  const vessel = getVesselBySlots([SlotColor.Yellow, SlotColor.Green])
  const yellow = fakeRelic.yellow({ effects: [$e`出撃時の武器の戦技を「輝剣の円陣」にする`] }) // category: 戦技
  const green = fakeRelic.green({ effects: [$e`出撃時の武器の戦技を「グラビタス」にする`, $e`最大HP上昇(+10%)`] }) // category: 戦技 + no category
  const build: Build = {
    vessel,
    sortedRelics: [yellow, green],
  }

  // 輝剣の円陣 + 最大HP上昇が必要な場合（グラビタスは無効、最大HP上昇は有効）
  const requiredEffects: RequiredEffects = [
    { effectIds: [$e`出撃時の武器の戦技を「輝剣の円陣」にする`], count: 1 },
    { effectIds: [$e`最大HP上昇(+10%)`], count: 1 },
  ]

  // act
  const result = satisfiesCategoryConstraints(build, requiredEffects)

  // assert
  expect(result).toBe(true)
})

test('異なるカテゴリの効果は両方有効', () => {
  // arrange
  const vessel = getVesselBySlots([SlotColor.Yellow, SlotColor.Green])
  const yellow = fakeRelic.yellow({ effects: [$e`出撃時の武器の戦技を「輝剣の円陣」にする`] }) // category: 戦技
  const green = fakeRelic.green({ effects: [$e`出撃時の武器に魔力攻撃力を付加`] }) // category: 属性・状態異常付与
  const build: Build = {
    vessel,
    sortedRelics: [yellow, green],
  }
  const requiredEffects: RequiredEffects = [
    { effectIds: [$e`出撃時の武器の戦技を「輝剣の円陣」にする`], count: 1 },
    { effectIds: [$e`出撃時の武器に魔力攻撃力を付加`], count: 1 },
  ]

  // act
  const result = satisfiesCategoryConstraints(build, requiredEffects)

  // assert
  expect(result).toBe(true)
})

test('要求効果が満たされない場合はfalse', () => {
  // arrange
  const vessel = getVesselBySlots([SlotColor.Yellow])
  const yellow = fakeRelic.yellow({ effects: [$e`出撃時の武器の戦技を「輝剣の円陣」にする`] }) // category: 戦技
  const build: Build = {
    vessel,
    sortedRelics: [yellow],
  }
  const requiredEffects: RequiredEffects = [{ effectIds: [$e`最大HP上昇(+10%)`], count: 1 }]

  // act
  const result = satisfiesCategoryConstraints(build, requiredEffects)

  // assert
  expect(result).toBe(false)
})
