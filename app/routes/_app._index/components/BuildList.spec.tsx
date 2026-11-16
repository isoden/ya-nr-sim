import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import { vesselsByCharacterMap } from '~/data/vessels'
import { fakeRelic } from '~/test/mocks/relic'
import { BuildList } from './BuildList'

test('同じ献器のビルドが複数あっても key が重複しない', async () => {
  // arrange
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
  const vessel = vesselsByCharacterMap['revenant'][0]
  const result = Promise.resolve({
    success: true as const,
    data: [
      { vessel, sortedRelics: [fakeRelic.red({ id: '1' }), null, null, null, null, null] },
      { vessel, sortedRelics: [fakeRelic.red({ id: '2' }), null, null, null, null, null] },
    ],
  })

  // act
  render(<BuildList resultKey="key" result={result} />)

  const headings = await screen.findAllByRole('heading', { level: 3 })
  const keyWarnings = consoleError.mock.calls.filter(([message]) => String(message).includes('same key'))
  consoleError.mockRestore()

  // assert
  expect(headings).toHaveLength(2)
  expect(keyWarnings).toEqual([])
})
