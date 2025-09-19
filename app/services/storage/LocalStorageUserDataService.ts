import { parseStringifiedRelicsSchema } from '~/schema/StringifiedRelicsSchema'
import type { RelicSchema } from '~/schema/StringifiedRelicsSchema'
import type { UserDataStorageService } from './UserDataStorageService'

/**
 * localStorage を使用したユーザーデータストレージサービス
 */
export class LocalStorageUserDataService implements UserDataStorageService {
  private readonly RELICS_KEY = 'relics'

  getRelics(): RelicSchema[] {
    try {
      const relicsData = localStorage.getItem(this.RELICS_KEY)
      return parseStringifiedRelicsSchema(relicsData)
    } catch {
      return []
    }
  }

  saveRelics(relics: RelicSchema[]): void {
    try {
      localStorage.setItem(this.RELICS_KEY, JSON.stringify(relics))
    } catch {
      // プライベートモード等でlocalStorageアクセスが失敗する場合は無視
    }
  }
}
