import type { SlotColor } from '~/data/vessels'

const iconUrlByPath = import.meta.glob<string>('./slots/*.webp', { eager: true, import: 'default' })

/** スロット色名（小文字） → アイコンURL */
const iconUrlBySlot = new Map(
  Object.entries(iconUrlByPath).flatMap(([path, url]) => {
    const { slot } = /\/(?<slot>\w+)\.webp$/.exec(path)?.groups ?? {}
    return slot ? [[slot, url] as const] : []
  }),
)

export function iconUrlOf(slot: SlotColor): string {
  return iconUrlBySlot.get(slot.replace('Deep', '').toLowerCase())!
}
