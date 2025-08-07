import {
	Button,
	ButtonGroup,
	Content,
	Dialog,
	DialogTrigger,
	Divider,
	Heading,
	Text,
	TextArea,
} from '@adobe/react-spectrum'
import { ImportIcon } from 'lucide-react'
import { useId, useState } from 'react'

type Props = {
	relicsCount: number
}

export const ImportDialog: React.FC<Props> = ({ relicsCount }) => {
	const id = useId()
	const [jsonAsText, setJsonAsText] = useState(() => {
		try {
			const relics = localStorage.getItem('relics')
			return relics ? JSON.stringify(JSON.parse(relics), null, 4) : ''
		} catch {
			return ''
		}
	})

	const importRelics = () => {
		localStorage.setItem('relics', jsonAsText)
	}

	return (
		<DialogTrigger>
			<Button variant="secondary">
				<Text>遺物をインポート ({relicsCount})</Text>
				<ImportIcon />
			</Button>
			{(close) => (
				<Dialog>
					<Heading id={id}>遺物をインポート</Heading>
					<Divider />
					<Content>
						<TextArea aria-labelledby={id} width="100%" value={jsonAsText} onChange={setJsonAsText} />
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
