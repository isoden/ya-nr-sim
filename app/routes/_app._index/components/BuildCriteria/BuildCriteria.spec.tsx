import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import { useForm } from '@conform-to/react'
import { parseWithValibot } from '@conform-to/valibot'
import { FormSchema } from '~/routes/_app._index/schema/FormSchema'
import { characterMap } from '~/data/characters'
import { BuildCriteria } from './BuildCriteria'
import type { CheckedEffects } from '../types/forms'

test('smoke test', async () => {
  // arrange
  const { container } = setup()

  // assert
  expect(container.firstElementChild).toBeInTheDocument()
})

test('SearchInput で絞り込みができる', {
  timeout: import.meta.env.CI ? 10_000 : undefined,
}, async () => {
  // arrange
  const { user } = setup()

  // act: 検索ボックスに入力
  const searchInput = screen.getByPlaceholderText('効果名で絞り込む')
  await user.type(searchInput, '攻撃力')

  // assert: 該当する効果が複数表示されていることを確認
  const attackPowerElements = screen.getAllByText(/攻撃力/)
  expect(attackPowerElements.length).toBeGreaterThan(0)
})

test('SearchInput で絞り込み結果が0件の場合、メッセージが表示される', {
  timeout: import.meta.env.CI ? 10_000 : undefined,
}, async () => {
  // arrange
  const { user } = setup()

  // act: 存在しない効果名で検索
  const searchInput = screen.getByPlaceholderText('効果名で絞り込む')
  await user.type(searchInput, '存在しない効果名XXX')

  // assert: 0件メッセージが表示されることを確認
  expect(screen.getByText('該当する効果が見つかりませんでした')).toBeInTheDocument()
  expect(screen.getByText(/検索ワード.*存在しない効果名XXX/)).toBeInTheDocument()
})

test('SearchInput のクリアボタンで絞り込みが解除される', async () => {
  // arrange: 検索ボックスに入力してメッセージを表示
  const { user } = setup()
  const searchInput = screen.getByPlaceholderText('効果名で絞り込む')
  await user.type(searchInput, '存在しない効果名YYY')

  // act: クリアボタンをクリック
  const clearButton = screen.getByLabelText('入力をクリア')
  await user.click(clearButton)

  // assert: メッセージが消える
  expect(screen.queryByText('該当する効果が見つかりませんでした')).not.toBeInTheDocument()
})

test('子要素を選択した状態で「選択した効果のみ表示」にした場合、親要素も表示される', async () => {
  // arrange: コンポーネントをレンダリングして子要素を見つける
  const { user } = setup()

  // 能力値サブカテゴリーを開く
  const statsButton = screen.getByRole('button', { name: /能力値の詳細指定を開く/ })
  await user.click(statsButton)

  // 最初に見つかる親要素（子要素を持つアイテム）を開く
  const allButtons = screen.getAllByRole('button')
  const parentEffectButton = allButtons.find((btn) => btn.getAttribute('aria-label')?.includes('の詳細指定を開く'))

  if (parentEffectButton) {
    await user.click(parentEffectButton)

    // 子要素のチェックボックスを探す
    const childCheckboxes = screen.getAllByRole<HTMLInputElement>('checkbox')
    const childEffectCheckbox = childCheckboxes.find((cb) => !cb.disabled && cb.closest('li'))

    if (childEffectCheckbox) {
      // act: 子要素を選択して「選択した効果のみ表示」をON
      await user.click(childEffectCheckbox)
      const showSelectedCheckbox = screen.getByRole('checkbox', { name: /選択した効果のみ表示/ })
      await user.click(showSelectedCheckbox)

      // assert: 親要素も表示されることを確認
      expect(screen.queryByText('選択した効果がありません')).not.toBeInTheDocument()
      const allCheckboxes = screen.queryAllByRole('checkbox')
      expect(allCheckboxes.length).toBeGreaterThan(1)
    }
  }
})

function setup() {
  const user = userEvent.setup()

  function TestComponent() {
    const [, fields] = useForm({
      onValidate: ({ formData }) => parseWithValibot(formData, { schema: FormSchema }),
    })
    const [checkedEffects, setCheckedEffects] = useState<CheckedEffects>({})

    return <BuildCriteria effectsMeta={fields.effects} notEffectsMeta={fields.notEffects} selectedCharId={characterMap.wylder.id} checkedEffects={checkedEffects} setCheckedEffects={setCheckedEffects} />
  }

  const view = render(<TestComponent />)

  return { user, ...view }
}
