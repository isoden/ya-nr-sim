import { ButtonGroup, Content, Dialog, DialogTrigger, Divider, Heading, TextArea } from '@adobe/react-spectrum'
import { ActionButton, Button } from '@react-spectrum/button'
import ImportIcon from '@spectrum-icons/workflow/Import'
import { useId, useState } from 'react'

export const ImportDialog: React.FC = () => {
	const id = useId()
	const [text, setText] = useState('')

	const importRelics = () => {
		localStorage.setItem('relics', text)
	}

	return (
		<DialogTrigger>
			<ActionButton>
				遺物をインポート
				<ImportIcon />
			</ActionButton>
			{(close) => (
				<Dialog>
					<Heading id={id}>遺物をインポート</Heading>
					<Divider />
					<Content>
						<TextArea aria-labelledby={id} width="100%" value={text} onChange={setText} />
					</Content>
					<ButtonGroup>
						<Button type="button" variant="secondary" onPress={close}>
							キャンセル
						</Button>
						<Button
							type="button"
							variant="accent"
							onPress={() => {
								importRelics()
								close()
							}}
						>
							インポート
						</Button>
					</ButtonGroup>
				</Dialog>
			)}
		</DialogTrigger>
	)
}
