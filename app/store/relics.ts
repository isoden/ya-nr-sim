import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type RelicSchema } from '~/schema/StringifiedRelicsSchema'

/**
 * 遺物データを管理する Store
 */
type RelicsStore = {
  /** 遺物データ */
  relics: RelicSchema[]

  /** 遺物データを更新 */
  setRelics: (relics: RelicSchema[]) => void
}

/**
 * 遺物ストア
 */
export const useRelicsStore = create<RelicsStore>()(
  persist(
    (set) => ({
      relics: [],
      setRelics: (relics) => set({ relics }),
    }),
    { name: 'relics' },
  ),
)
