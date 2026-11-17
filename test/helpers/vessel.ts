import { SlotColor, Vessel, vesselsByCharacterMap } from '~/data/vessels'

type CharacterId = keyof typeof vesselsByCharacterMap

/**
 * 献器のスロットの色情報と一致する献器を取得する
 *
 * 同じスロット構成の献器が複数キャラクターに存在するため、
 * 特定キャラクターの献器リストと突き合わせる場合は `characterId` を指定する。
 *
 * @param colors - 器のスロット色の配列（先頭から前方一致で比較する）
 * @param characterId - 検索対象のキャラクター。省略時は全キャラクターの献器から最初に一致したものを返す
 */
export function getVesselBySlots(colors: SlotColor[], characterId?: CharacterId): Vessel {
  const candidates = characterId ? vesselsByCharacterMap[characterId] : Object.values(vesselsByCharacterMap).flat()
  const vessel = candidates.find((vessel) => colors.every((color, index) => vessel.slots[index] === color))

  if (!vessel) {
    throw new Error(`Vessel with colors "${colors.join(', ')}" not found${characterId ? ` for ${characterId}` : ''}`)
  }

  return vessel
}
