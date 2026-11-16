import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { Button } from './Button'

test('smoke test', () => {
  render(<Button variant="primary">submit</Button>)
})

test('className で指定したクラスが variant の競合クラスを上書きする', () => {
  // arrange
  render(<Button size="md" className="px-2">submit</Button>)

  // act
  const button = screen.getByRole('button', { name: 'submit' })

  // assert
  expect(button).toHaveClass('px-2', 'py-2')
  expect(button).not.toHaveClass('px-4')
})
