import { SlotColor, Vessel, vesselsByCharacterMap } from '~/data/vessels'

const allVessels = Object.values(vesselsByCharacterMap).flat()

/**
 * 献器のスロットの色情報と一致する献器を取得する
 *
 * @param colors - 器のスロット色の配列
 */
export function getVesselBySlots(colors: SlotColor[]): Vessel {
  const vessel = allVessels.find((vessel) => colors.every((color, index) => vessel.slots[index] === color))

  if (!vessel) {
    throw new Error(`Vessel with colors "${colors.join(', ')}" not found`)
  }

  return vessel
}
