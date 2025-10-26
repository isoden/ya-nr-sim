import { UNSTABLE_ToastRegion as ToastRegion,
} from 'react-aria-components'
import { Toast } from './Toast'
import { queue } from './queue'

export const ToastContainer = () => {
  return (
    <ToastRegion
      queue={queue}
      className="fixed right-4 bottom-4 flex flex-col-reverse gap-2 rounded-lg"
    >
      {({ toast }) => (
        <Toast toast={toast} />
      )}
    </ToastRegion>
  )
}
