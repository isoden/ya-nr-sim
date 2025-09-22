import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import { BuildCriteria } from './BuildCriteria'

const mockEffects = vi.hoisted(() => ({
  1: { name: 'Effect 1', stackable: true },
  2: { name: 'Effect 2', stackable: false },
  3: { name: 'Effect 3', stackable: true },
}))

// Mock the relics data
vi.mock('~/data/relics', async (importOriginal) => ({
  ...(await importOriginal()),
  relicEffectMap: mockEffects,
}))

test.skip('デフォルトでは、全ての選択肢が表示される', async () => {
  const user = userEvent.setup()

  render(<BuildCriteria />)

  const comboBox = screen.getByRole('combobox', { name: 'Test Effect Selector' })
  expect(comboBox).toBeInTheDocument()

  const trigger = screen.getByRole('button', { name: /show suggestions/i })
  await user.click(trigger)

  const options = screen.getAllByRole('option')

  expect(options).toHaveLength(Object.keys(mockEffects).length)
})
