import { ComboBox, Item } from '@adobe/react-spectrum'
import type React from 'react'
import { relicEffectMap } from '~/data/relics'

type PermittedComboBoxProps = Pick<
	React.ComponentProps<typeof ComboBox>,
	'name' | 'label' | 'aria-label' | 'selectedKey' | 'onSelectionChange' | 'validationState'
>

type Props = PermittedComboBoxProps & {
	// フィルターする効果IDの配列
	excludeIds?: number[]
}

/**
 * 遺物効果を選択するためのコンボボックスコンポーネント
 *
 * @param props - {@link Props}
 */
export const RelicEffectSelector: React.FC<Props> = ({ excludeIds = [], ...props }) => {
	return (
		<ComboBox
			{...props}
			defaultItems={effectItems.filter((item) => !excludeIds.includes(item.id))}
			formValue="key"
			width="100%"
		>
			{(item) => <Item>{item.name}</Item>}
		</ComboBox>
	)
}

const effectItems = Object.entries(relicEffectMap).map(([id, { name }]) => ({
	id: Number(id),
	name,
}))
