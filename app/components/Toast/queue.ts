import { UNSTABLE_ToastQueue as ToastQueue } from 'react-aria-components'
import type { ToastItem } from './types'

export const queue = new ToastQueue<ToastItem>()
