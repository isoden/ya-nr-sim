import { render } from '@testing-library/react'
import { test } from 'vitest'
import { Checkbox } from './Checkbox'

test('smoke test', () => {
  render(<Checkbox />)
})
