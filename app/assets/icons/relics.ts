import { type Relic } from '~/data/relics'

const iconUrlByPath = import.meta.glob<string>('./relics/*.webp', { eager: true, import: 'default' })

/** アイテムID → アイコンURL（ファイル名がアイテムIDの画像だけを対象にする） */
const iconUrlByItemId = new Map(
  Object.entries(iconUrlByPath).flatMap(([path, url]) => {
    const { itemId } = /\/(?<itemId>\d+)\.webp$/.exec(path)?.groups ?? {}
    return itemId ? [[Number(itemId), url] as const] : []
  }),
)

export function iconUrlOf(relic: Relic): string {
  return iconUrlByItemId.get(relic.itemId) ?? iconUrlByPath[`./relics/${relic.dn ? 'dn-' : ''}${relic.size}-${relic.color.toLowerCase()}.webp`]
}
