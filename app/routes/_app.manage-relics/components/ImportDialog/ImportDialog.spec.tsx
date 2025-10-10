import { render } from '@testing-library/react'
import { test } from 'vitest'
import { ImportDialog } from './ImportDialog'

test('smoke test', () => {
  render(<ImportDialog />)
})
