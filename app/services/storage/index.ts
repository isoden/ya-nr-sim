import { LocalStorageUserDataService } from './LocalStorageUserDataService'
import type { UserDataStorageService } from './UserDataStorageService'

let instance: UserDataStorageService | null = null

/**
 * ユーザーデータストレージサービスのシングルトンインスタンスを取得する
 */
export function createUserDataStorageService(): UserDataStorageService {
  if (!instance) {
    instance = new LocalStorageUserDataService()
  }
  return instance
}

export type { UserDataStorageService }
export { LocalStorageUserDataService }