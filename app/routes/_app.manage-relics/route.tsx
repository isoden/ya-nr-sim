import { useId, useRef, useState } from 'react'
import { Button } from '~/components/forms/Button'
import type { Route } from './+types/route'

export function clientLoader() {
  return { relicsCount: 1000 }
}

export default function Page({ loaderData }: Route.ComponentProps) {
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

  return (
    <main className="overflow-auto">
      <h2 id={id} className="border-b border-zinc-600 pb-3 text-lg font-semibold">
        遺物管理
      </h2>
      <div>
        <textarea
          className="w-full min-h-[theme(spacing.64)] border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-black rounded"
          aria-labelledby={id}
          value={jsonAsText}
          onChange={(event) => setJsonAsText(event.target.value)}
        />
      </div>
      <div className="flex gap-2 mt-4">
        <Button variant="primary" type="button" onPress={() => importRelics()}>
          保存
        </Button>
      </div>
    </main>
  )
}
