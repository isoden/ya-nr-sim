import { parseWithValibot } from '@conform-to/valibot'
import { expect, test } from 'vitest'
import { characterMap } from '~/data/characters'
import { FormSchema } from './FormSchema'

test.each([
  { label: 'チェックあり', excludeDepthsRelics: 'on', expected: true },
  { label: 'チェックなし（フィールド自体が送信されない）', excludeDepthsRelics: undefined, expected: false },
])('深層の遺物を除外する: $label の場合 excludeDepthsRelics は $expected になる', ({ excludeDepthsRelics, expected }) => {
  // arrange
  const formData = new FormData()
  formData.set('charId', characterMap.wylder.id)
  formData.set('effects.7126000', '1')
  if (excludeDepthsRelics !== undefined) {
    formData.set('excludeDepthsRelics', excludeDepthsRelics)
  }

  // act
  const submission = parseWithValibot(formData, { schema: FormSchema })

  // assert
  expect(submission.status).toBe('success')
  expect(submission.status === 'success' && submission.value.excludeDepthsRelics).toBe(expected)
})
