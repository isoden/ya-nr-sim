import { render } from '@testing-library/react'
import { test } from 'vitest'
import { Button } from './Button'

test('smoke test', () => {
  render(<Button variant="primary">submit</Button>)
})
