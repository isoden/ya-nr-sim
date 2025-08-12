import { ImportIcon } from 'lucide-react'
import { useCallback, useId, useRef, useState } from 'react'
import { Button } from '~/components/forms/Button'

type Props = {
  relicsCount: number
}

export const ImportDialog: React.FC<Props> = ({ relicsCount }) => {
  const id = useId()
  const ref = useRef<HTMLDialogElement>(null)
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

  const openDialog = useCallback(() => {
    ref.current?.showModal()
  }, [])

  const closeDialog = useCallback(() => {
    ref.current?.close()
  }, [])

  return (
    <>
      <Button variant="secondary" type="button" className="flex items-center gap-1" onClick={openDialog}>
        遺物管理 ({relicsCount})
        <ImportIcon />
      </Button>
      <dialog
        ref={ref}
        onClose={closeDialog}
        className="backdrop:bg-black/50 backdrop:backdrop-blur-xs min-w-xs w-full mt-8 mx-auto max-w-2xl p-4"
      >
        <h2 id={id} className="border-b border-zinc-600 pb-3 text-md font-bold">
          遺物管理
        </h2>
        <div>
          <textarea
            className="w-full min-h-[theme(spacing.64)]"
            aria-labelledby={id}
            value={jsonAsText}
            onChange={(event) => setJsonAsText(event.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="secondary" type="button" onPress={closeDialog}>
            キャンセル
          </Button>
          <Button
            variant="primary"
            type="button"
            onPress={() => {
              importRelics()
              closeDialog()
            }}
          >
            インポート
          </Button>
        </div>
      </dialog>
    </>
  )
}
