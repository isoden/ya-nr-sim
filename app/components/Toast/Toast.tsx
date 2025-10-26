import {
  Button, UNSTABLE_Toast as RAToast, UNSTABLE_ToastContent as ToastContent,
  type QueuedToast,
} from 'react-aria-components'
import type { ToastItem } from './types'
import { X } from 'lucide-react'

type Props = {
  toast: QueuedToast<ToastItem>
}

export const Toast: React.FC<Props> = ({ toast }) => {
  return (
    <RAToast
      toast={toast}
      className={`
        flex items-center gap-4 rounded-lg border border-zinc-800
        bg-primary-dark px-4 py-3 text-sm text-white shadow-lg outline-none
      `}
    >
      <ToastContent>
        {toast.content.title}
        {toast.content.description}
      </ToastContent>
      <Button slot="close">
        <X />
      </Button>
    </RAToast>
  )
}
