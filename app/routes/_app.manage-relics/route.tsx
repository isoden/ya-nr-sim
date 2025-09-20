import { useId, useState } from 'react'
import { Button } from '~/components/forms/Button'
import { createUserDataStorageService } from '~/services/storage'

export default function Page() {
  const id = useId()
  const storageService = createUserDataStorageService()

  const [jsonAsText, setJsonAsText] = useState(() => {
    return JSON.stringify(storageService.getRelics(), null, 4)
  })

  const importRelics = () => {
    storageService.saveRelics(JSON.parse(jsonAsText))
  }

  return (
    <main className="overflow-auto">
      <h2 id={id} className={`
        border-b border-zinc-600 pb-3 text-lg font-semibold
      `}>
        遺物管理
      </h2>
      <div>
        <textarea
          className={`
            min-h-[theme(spacing.64)] w-full rounded border border-zinc-600
            focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2
            focus:ring-offset-black focus:outline-none
          `}
          aria-labelledby={id}
          value={jsonAsText}
          onChange={(event) => setJsonAsText(event.target.value)}
        />
      </div>
      <div className="mt-4 flex gap-2">
        <Button variant="primary" type="button" onPress={() => importRelics()}>
          保存
        </Button>
      </div>
    </main>
  )
}
