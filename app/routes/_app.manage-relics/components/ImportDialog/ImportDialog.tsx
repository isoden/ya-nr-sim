import { ImportIcon } from 'lucide-react'
import { useRef, useState } from 'react'
import { Button } from '~/components/forms/Button'
import { queue } from '~/components/Toast'
import { parseStringifiedRelicsSchema } from '~/schema/StringifiedRelicsSchema'
import { useRelicsStore } from '~/store/relics'

export const ImportDialog: React.FC = () => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const relics = useRelicsStore((state) => state.relics)
  const setRelics = useRelicsStore((state) => state.setRelics)

  const [jsonAsText, setJsonAsText] = useState(() => {
    return JSON.stringify(relics, null, 2)
  })

  const importRelics = () => {
    try {
      parseStringifiedRelicsSchema(jsonAsText)

      const results = JSON.parse(jsonAsText)

      setRelics(results)
      dialogRef.current?.close()
      queue.add(
        { title: `遺物を「${results.length}」件インポートしました。` },
        { timeout: 3000 },
      )
    } catch {
      alert('不正なデータです。')
    }
  }

  return (
    <>
      <Button className="flex items-center gap-2" variant="primary" size="sm" onPress={() => dialogRef.current?.showModal()}>
        遺物のインポート
        <ImportIcon />
      </Button>
      <dialog
        ref={dialogRef}
        className={`
          fixed inset-0 m-auto w-full max-w-2xl rounded border border-zinc-800
          bg-primary-dark p-6 shadow-lg
          backdrop:backdrop-blur-xs
        `}
        // eslint-disable-next-line react/no-unknown-property
        closedby="any"
      >
        <textarea
          className={`
            min-h-80 w-full rounded border border-zinc-600
            bg-[color-mix(in_srgb,var(--color-primary-dark),white_5%)] font-mono
            text-white
            focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2
            focus:ring-offset-black focus:outline-none
          `}
          aria-label="遺物定義"
          value={jsonAsText}
          onChange={(event) => setJsonAsText(event.target.value)}
        />
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" type="button" onPress={() => dialogRef.current?.close()}>
            キャンセル
          </Button>
          <Button variant="primary" type="button" onPress={() => importRelics()}>
            保存
          </Button>
        </div>
      </dialog>
    </>
  )
}
