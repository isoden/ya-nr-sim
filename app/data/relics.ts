import { invariant } from 'es-toolkit'
import type { RelicSchema } from '~/schema/StringifiedRelicsSchema'
import { demeritDepthsRelicEffectMap, relicEffectMap } from './relicEffects'

export { relicEffectMap, demeritDepthsRelicEffectMap }

export type RelicJSON = RelicSchema

export class Relic {
  static MAX_EFFECTS = 6

  static new({ dn = false, ...options }: RelicJSON): Relic {
    return new Relic(options.id, options.color, options.effects, options.itemId, dn)
  }

  get size(): 'small' | 'medium' | 'large' {
    const length = this.normalizedEffectIds.filter((effectId) => !demeritDepthsRelicEffectMap[effectId]).length

    switch (length) {
      case 1:
        return 'small'
      case 2:
        return 'medium'
      case 3:
        return 'large'
      default:
        throw new Error(`Unexpected effects length: ${this.effects.length}`)
    }
  }

  /**
   * 遺物名
   */
  get name(): string {
    const itemName = uniqItemNameMap[this.itemId]

    if (itemName) return itemName

    const sizeMap = {
      small: '繊細な',
      medium: '端正な',
      large: '壮大な',
    }
    const colorMap = {
      [RelicColorExtended.Red]: '燃える',
      [RelicColorExtended.DeepRed]: '燃える',
      [RelicColorExtended.Blue]: '滴る',
      [RelicColorExtended.DeepBlue]: '滴る',
      [RelicColorExtended.Yellow]: '輝く',
      [RelicColorExtended.DeepYellow]: '輝く',
      [RelicColorExtended.Green]: '静まる',
      [RelicColorExtended.DeepGreen]: '静まる',
    }
    const suffixMap = {
      normal: '景色',
      depths: '昏景',
    }

    const prefix = sizeMap[this.size]
    const color = colorMap[this.colorExtended]
    const suffix = suffixMap[this.type]

    return `${prefix}${color}${suffix}`
  }

  /**
   * 重複として定義されている effectId を基準の ID に変換して返す
   */
  get normalizedEffectIds() {
    return this.effects.map(normalizeEffectId)
  }

  /**
   * 遺物効果IDと、そのデメリット効果IDの組み合わせを返す
   *
   * - デメリット効果がない場合は空配列を返す
   */
  get pairedEffects(): [{ id: number; name: string }, { id: number; name: string }[]][] {
    const { normalIds = [], demeritIds = [] } = Object.groupBy(this.normalizedEffectIds, (id) =>
      id in demeritDepthsRelicEffectMap ? 'demeritIds' : 'normalIds',
    )

    const pairedEffects = normalIds.reduce<[{ id: number; name: string }, { id: number; name: string }[]][]>(
      (resolved, effectId) => {
        const effect = relicEffectMap[effectId]

        invariant(effect, 'Relic effect not found')

        if (effect.hasDemeritEffect) {
          const demeritId = demeritIds.shift()

          invariant(demeritId, 'Demerit effect not found')

          return resolved.concat([
            [
              { id: effectId, name: effect.name },
              [{ id: demeritId, name: demeritDepthsRelicEffectMap[demeritId].name }],
            ],
          ])
        }

        return resolved.concat([[{ id: effectId, name: effect.name }, []]])
      },
      [],
    )

    if (demeritIds.length > 0) {
      console.warn(`Unpaired demerit effects found: ${demeritIds.join(', ')}`)

      const lastPair = pairedEffects.at(-1)

      if (lastPair) {
        lastPair[1].push(...demeritIds.map((id) => ({ id, name: demeritDepthsRelicEffectMap[id].name })))
      }
    }

    return pairedEffects
  }

  /**
   * 遺物の種類
   *
   * - normal: 遺物 (通常)
   * - depths: 深層の遺物
   */
  get type(): 'normal' | 'depths' {
    return this.dn ? 'depths' : 'normal'
  }

  /**
   * 遺物の色
   *
   * - 深層の遺物の場合は対応する色に変換する
   */
  get colorExtended(): RelicColorExtended {
    if (this.type === 'normal') return this.color

    switch (this.color) {
      case RelicColorExtended.Red:
        return RelicColorExtended.DeepRed
      case RelicColorExtended.Blue:
        return RelicColorExtended.DeepBlue
      case RelicColorExtended.Green:
        return RelicColorExtended.DeepGreen
      case RelicColorExtended.Yellow:
        return RelicColorExtended.DeepYellow
      default:
        throw new Error(`Unexpected relic color: ${this.color}`)
    }
  }

  private constructor(
    /** 遺物のID */
    public id: string,

    /** 遺物の色 */
    public color: RelicColorBase,

    /** 遺物の効果 */
    public effects: number[],

    /** 遺物のアイテムID */
    public itemId: number,

    /**
     * 深層の遺物フラグ
     *
     * TODO: private にして、 Relic.type を参照する
     */
    public dn: boolean,
  ) {}
}

// 遺物カラーのベース定義
export type RelicColorBase = (typeof RelicColorBase)[keyof typeof RelicColorBase]
export const RelicColorBase = {
  Red: 'Red',
  Blue: 'Blue',
  Green: 'Green',
  Yellow: 'Yellow',
} as const satisfies Record<string, string>

export type RelicColorExtended = (typeof RelicColorExtended)[keyof typeof RelicColorExtended]
export const RelicColorExtended = {
  ...RelicColorBase,
  DeepRed: 'DeepRed',
  DeepBlue: 'DeepBlue',
  DeepGreen: 'DeepGreen',
  DeepYellow: 'DeepYellow',
} as const satisfies Record<string, string>

/**
 * 重複とみなされる遺物効果のIDを正規化する
 *
 * @param id - 遺物効果のID
 */
export function normalizeEffectId(id: number): number {
  return (
    {
      100000: 10001,
      7006001: 7006000,
      7006101: 7006100,
      7011500: 6500000,
      7032200: 10001,
      7035410: 7035400,
      7035510: 7035500,
      7036000: 10000,
      7100190: 7100110,
      7126001: 7126000,
      7126002: 7126000,
      7260800: 7260710,
    }[id] || id
  )
}

const uniqItemNameMap: Record<number, string> = {
  10001: '薄汚れたフレーム',
  15002: '黒爪の首飾り',
  18000: '祝福された花',
  14002: '祝福された鉄貨',
  17002: '骨のような石',
  13001: '割れた封蝋',
  12003: '砕けた魔女のブローチ',
  14001: '頭冠のメダル',
  13002: '聖律の刃',
  10002: '忌み鬼の呪物',
  14000: '金色の露',
  18002: '黄金の萌芽',
  10000: '古びた懐中時計',
  16002: '古びたミニアチュール',
  11002: '銀の雫',
  11000: 'にび色の砥石',
  16001: '小さな化粧道具',
  12001: '石の杭',
  11001: '追跡者の耳飾り',
  12000: '三冊目の本',
  15000: 'ちぎれた組み紐',
  17001: '夜の痕跡',
  12002: '魔女のブローチ',
  2000: '獣の夜',
  2001: '獣の暗き夜',
  2010: '爵の夜',
  2011: '爵の暗き夜',
  2020: '識の夜',
  2021: '識の暗き夜',
  2030: '深海の夜',
  2031: '深海の暗き夜',
  2040: '魔の夜',
  2041: '魔の暗き夜',
  2050: '狩人の夜',
  2051: '狩人の暗き夜',
  2060: '霞の夜',
  2061: '霞の暗き夜',
  2100: '王の夜',
}
