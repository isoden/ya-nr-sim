import type { RelicSchema } from '~/schema/StringifiedRelicsSchema'

/**
 * ユーザーデータストレージサービスのインターフェース
 */
export interface UserDataStorageService {
  /**
   * 遺物データを取得する
   */
  getRelics(): RelicSchema[]

  /**
   * 遺物データを保存する
   */
  saveRelics(relics: RelicSchema[]): void
}
