import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import { RelicEffectSelector } from './RelicEffectSelector'

const mockEffects = vi.hoisted(() => ({
	1: { name: 'Effect 1', stackable: true },
	2: { name: 'Effect 2', stackable: false },
	3: { name: 'Effect 3', stackable: true },
}))

// Mock the relics data
vi.mock('~/data/relics', () => ({
	relicEffectMap: mockEffects,
}))

test('デフォルトでは、全ての選択肢が表示される', async () => {
	const user = userEvent.setup()

	render(<RelicEffectSelector />)

	const comboBox = screen.getByRole('combobox', { name: 'Test Effect Selector' })
	expect(comboBox).toBeInTheDocument()

	const trigger = screen.getByRole('button', { name: /show suggestions/i })
	await user.click(trigger)

	const options = screen.getAllByRole('option')

	expect(options).toHaveLength(Object.keys(mockEffects).length)
})

test('excludeIds を指定した場合、 除外IDを考慮してフィルタリングする', async () => {
	const user = userEvent.setup()
	const excludeIds = [1, 3]

	render(<RelicEffectSelector />)

	const trigger = screen.getByRole('button', { name: /show suggestions/i })
	await user.click(trigger)

	const options = screen.getAllByRole('option')

	expect(options).toHaveLength(Object.keys(mockEffects).filter((id) => !excludeIds.includes(Number(id))).length)
})
