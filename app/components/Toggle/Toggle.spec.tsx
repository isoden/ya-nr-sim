import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'
import { Toggle } from './Toggle'

describe('Toggle', () => {
  test('ボタンが適切なアクセシビリティ属性を持つ', () => {
    const handleChange = vi.fn()

    render(
      <Toggle.Root open={false} onOpenChange={handleChange}>
        <Toggle.Button>Toggle Button</Toggle.Button>
        <Toggle.Content>Toggle Content</Toggle.Content>
      </Toggle.Root>,
    )

    const button = screen.getByRole('button', { name: 'Toggle Button' })
    const content = screen.getByText('Toggle Content')

    // assert: ボタンが適切なaria属性を持つ
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(button).toHaveAttribute('aria-controls', content.id)
    expect(button).toHaveAttribute('type', 'button')
  })

  test('初期状態でコンテンツが非表示状態になる', () => {
    const handleChange = vi.fn()

    render(
      <Toggle.Root open={false} onOpenChange={handleChange}>
        <Toggle.Button>Toggle Button</Toggle.Button>
        <Toggle.Content>Toggle Content</Toggle.Content>
      </Toggle.Root>,
    )

    const content = screen.getByText('Toggle Content')

    // assert: コンテンツが非表示状態
    expect(content).toHaveAttribute('aria-hidden', 'true')
  })

  test('open=true のときコンテンツが表示状態になる', () => {
    const handleChange = vi.fn()

    render(
      <Toggle.Root open={true} onOpenChange={handleChange}>
        <Toggle.Button>Toggle Button</Toggle.Button>
        <Toggle.Content>Toggle Content</Toggle.Content>
      </Toggle.Root>,
    )

    const button = screen.getByRole('button', { name: 'Toggle Button' })
    const content = screen.getByText('Toggle Content')

    // assert: ボタンとコンテンツが表示状態
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(content).toHaveAttribute('aria-hidden', 'false')
  })

  test('ボタンクリックで開閉状態が切り替わる', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()

    render(
      <Toggle.Root open={false} onOpenChange={handleChange}>
        <Toggle.Button>Toggle Button</Toggle.Button>
        <Toggle.Content>Toggle Content</Toggle.Content>
      </Toggle.Root>,
    )

    const button = screen.getByRole('button', { name: 'Toggle Button' })

    // act: ボタンをクリック
    await user.click(button)

    // assert: onOpenChangeが呼ばれる
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  test('disabled状態のボタンがクリックできない', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()

    render(
      <Toggle.Root open={false} onOpenChange={handleChange}>
        <Toggle.Button disabled>Toggle Button</Toggle.Button>
        <Toggle.Content>Toggle Content</Toggle.Content>
      </Toggle.Root>,
    )

    const button = screen.getByRole('button', { name: 'Toggle Button' })

    // act: disabledボタンをクリック
    await user.click(button)

    // assert: 何も起こらない
    expect(button).toBeDisabled()
    expect(handleChange).not.toHaveBeenCalled()
  })

  test('カスタムクラス名が適用される', () => {
    const handleChange = vi.fn()

    render(
      <Toggle.Root open={false} onOpenChange={handleChange}>
        <Toggle.Button className="custom-button">Toggle Button</Toggle.Button>
        <Toggle.Content className="custom-content">Toggle Content</Toggle.Content>
      </Toggle.Root>,
    )

    const button = screen.getByRole('button', { name: 'Toggle Button' })
    const content = screen.getByText('Toggle Content')

    // assert: カスタムクラスが適用されている
    expect(button).toHaveClass('custom-button')
    expect(content).toHaveClass('custom-content')
  })

  test('children が関数の場合に open 状態が渡される', () => {
    const handleChange = vi.fn()
    const renderChild = vi.fn(() => (
      <>
        <Toggle.Button>Toggle Button</Toggle.Button>
        <Toggle.Content>Toggle Content</Toggle.Content>
      </>
    ))

    render(
      <Toggle.Root open={true} onOpenChange={handleChange}>
        {renderChild}
      </Toggle.Root>,
    )

    // assert: children関数がopen状態と共に呼ばれる
    expect(renderChild).toHaveBeenCalledWith({ open: true })
  })

  test('一意のIDが生成されてaria-controlsとidが連携する', () => {
    const handleChange = vi.fn()

    const { rerender } = render(
      <Toggle.Root open={false} onOpenChange={handleChange}>
        <Toggle.Button>Toggle Button 1</Toggle.Button>
        <Toggle.Content>Toggle Content 1</Toggle.Content>
      </Toggle.Root>,
    )

    const button1 = screen.getByRole('button', { name: 'Toggle Button 1' })
    const content1 = screen.getByText('Toggle Content 1')
    const controls1 = button1.getAttribute('aria-controls')

    // 別のToggleをレンダリング
    rerender(
      <>
        <Toggle.Root open={false} onOpenChange={handleChange}>
          <Toggle.Button>Toggle Button 1</Toggle.Button>
          <Toggle.Content>Toggle Content 1</Toggle.Content>
        </Toggle.Root>
        <Toggle.Root open={false} onOpenChange={handleChange}>
          <Toggle.Button>Toggle Button 2</Toggle.Button>
          <Toggle.Content>Toggle Content 2</Toggle.Content>
        </Toggle.Root>
      </>,
    )

    const button2 = screen.getByRole('button', { name: 'Toggle Button 2' })
    const content2 = screen.getByText('Toggle Content 2')
    const controls2 = button2.getAttribute('aria-controls')

    // assert: IDが一意であることを確認
    expect(content1.id).toBe(controls1)
    expect(content2.id).toBe(controls2)
    expect(controls1).not.toBe(controls2)
  })
})
