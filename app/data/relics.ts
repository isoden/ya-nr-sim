import { invariant } from 'es-toolkit'
import type { RelicSchema } from '~/routes/_app._index/schema/StringifiedRelicsSchema'

export type RelicJSON = RelicSchema

export class Relic {
  static MAX_EFFECTS = 6

  static new({ dn = false, ...options }: RelicJSON): Relic {
    return new Relic(options.id, options.color, options.effects, options.itemId, dn)
  }

  get size(): 'small' | 'medium' | 'large' {
    const length = this.normalizedEffectIds.filter((effectId) => !negativeDepthsRelicEffectMap[effectId]).length

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
   * `normalizedEffectIds` を `[遺物効果ID: number, デメリット遺物効果ID?: number][]` のペアにして返す
   * デメリット効果がない場合は、 `[遺物効果ID: number][]` の形になる
   */
  get pairedEffectIds(): [number, number?][] {
    return this.normalizedEffectIds.reduce<[number, number?][]>((resolved, effectId) => {
      const isNegativeEffect = !!negativeDepthsRelicEffectMap[effectId]

      if (isNegativeEffect) {
        const last = resolved.splice(resolved.length - 1, 1)

        return resolved.concat([[last[0][0], effectId]])
      }

      return resolved.concat([[effectId]])
    }, [])
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

type RelicEffectMap = Record<number, { name: string; stackable: boolean }>

/**
 * 通常遺物の効果一覧
 *
 * @see https://docs.google.com/spreadsheets/d/1Gz6fqIBNr2BXr45te9ewTolHJr4zZ_Apbqa09gL3VbI/
 */
export const relicEffectMap: RelicEffectMap = {
  10000: { name: '攻撃連続時、FP回復', stackable: true },
  10001: { name: '攻撃を受けると攻撃力上昇', stackable: false },
  7000000: { name: '生命力+1', stackable: true },
  7000001: { name: '生命力+2', stackable: true },
  7000002: { name: '生命力+3', stackable: true },
  7000090: { name: '最大HP上昇', stackable: false },
  7000100: { name: '精神力+1', stackable: true },
  7000101: { name: '精神力+2', stackable: true },
  7000102: { name: '精神力+3', stackable: true },
  7000190: { name: '最大FP上昇', stackable: false },
  7000200: { name: '持久力+1', stackable: true },
  7000201: { name: '持久力+2', stackable: true },
  7000202: { name: '持久力+3', stackable: true },
  7000290: { name: '最大スタミナ上昇', stackable: false },
  7000300: { name: '筋力+1', stackable: true },
  7000301: { name: '筋力+2', stackable: true },
  7000302: { name: '筋力+3', stackable: true },
  7000400: { name: '技量+1', stackable: true },
  7000401: { name: '技量+2', stackable: true },
  7000402: { name: '技量+3', stackable: true },
  7000500: { name: '知力+1', stackable: true },
  7000501: { name: '知力+2', stackable: true },
  7000502: { name: '知力+3', stackable: true },
  7000600: { name: '信仰+1', stackable: true },
  7000601: { name: '信仰+2', stackable: true },
  7000602: { name: '信仰+3', stackable: true },
  7000700: { name: '神秘+1', stackable: true },
  7000701: { name: '神秘+2', stackable: true },
  7000702: { name: '神秘+3', stackable: true },
  7000800: { name: 'スキルクールタイム軽減+1', stackable: true },
  7000801: { name: 'スキルクールタイム軽減+2', stackable: true },
  7000802: { name: 'スキルクールタイム軽減+3', stackable: true },
  7000900: { name: 'アーツゲージ蓄積増加+1', stackable: true },
  7000901: { name: 'アーツゲージ蓄積増加+2', stackable: true },
  7000902: { name: 'アーツゲージ蓄積増加+3', stackable: true },
  7001000: { name: '強靭度+1', stackable: true },
  7001001: { name: '強靭度+2', stackable: true },
  7001002: { name: '強靭度+3', stackable: true },
  7001100: { name: 'HP持続回復', stackable: false },
  7001400: { name: '物理攻撃力上昇', stackable: true },
  7001401: { name: '物理攻撃力上昇+1', stackable: true },
  7001402: { name: '物理攻撃力上昇+2', stackable: true },
  // 7001403: { name: '物理攻撃力上昇+3', stackable: true },
  7001500: { name: '魔力攻撃力上昇', stackable: true },
  7001501: { name: '魔力攻撃力上昇+1', stackable: true },
  7001502: { name: '魔力攻撃力上昇+2', stackable: true },
  7001600: { name: '炎攻撃力上昇', stackable: true },
  7001601: { name: '炎攻撃力上昇+1', stackable: true },
  7001602: { name: '炎攻撃力上昇+2', stackable: true },
  7001700: { name: '雷攻撃力上昇', stackable: true },
  7001701: { name: '雷攻撃力上昇+1', stackable: true },
  7001702: { name: '雷攻撃力上昇+2', stackable: true },
  7001800: { name: '聖攻撃力上昇', stackable: true },
  7001801: { name: '聖攻撃力上昇+1', stackable: true },
  7001802: { name: '聖攻撃力上昇+2', stackable: true },
  7002600: { name: '魔力カット率上昇', stackable: true },
  7002700: { name: '炎カット率上昇', stackable: true },
  7002800: { name: '雷カット率上昇', stackable: true },
  7002900: { name: '聖カット率上昇', stackable: true },
  7003000: { name: '毒耐性上昇', stackable: true },
  7003100: { name: '出血耐性上昇', stackable: true },
  7003200: { name: '睡眠耐性上昇', stackable: true },
  7003300: { name: '抗死耐性上昇', stackable: true },
  7003400: { name: '腐敗耐性上昇', stackable: true },
  7003500: { name: '冷気耐性上昇', stackable: true },
  7003600: { name: '発狂耐性上昇', stackable: true },
  7005600: { name: 'ダメージを受けた直後、攻撃によりHPの一部を回復', stackable: false },
  7006000: { name: '両手持ちの、体勢を崩す力上昇', stackable: true },
  // 7006001: { name: '両手持ちの、体勢を崩す力上昇', stackable: true },
  7006100: { name: '二刀持ちの、体勢を崩す力上昇', stackable: true },
  7006101: { name: '二刀持ちの、体勢を崩す力上昇+1', stackable: true },
  7006200: { name: '物理カット率上昇', stackable: true },
  7010200: { name: '聖杯瓶の回復を、周囲の味方に分配', stackable: false },
  7010500: { name: '【追跡者】アーツ発動時、周囲を延焼', stackable: true },
  7010700: { name: '【レディ】短剣による連続攻撃時、周囲の敵に直近の出来事を再演', stackable: true },
  7010900: { name: '【復讐者】アーツ発動時、自身のHPと引き換えに周囲の味方のHPを全回復', stackable: true },
  7011000: { name: '【守護者】スキルの持続時間延長', stackable: true },
  7011200: { name: '【復讐者】アーツ発動時、霊炎の爆発を発生', stackable: true },
  7011600: { name: '【守護者】斧槍タメ攻撃時、つむじ風が発生', stackable: true },
  7011700: { name: '【執行者】アーツ発動中、咆哮でHP回復', stackable: true },
  7012000: { name: '【守護者】アーツ発動時、周囲の味方HPを徐々に回復', stackable: true },
  7012200: { name: 'HP低下時、周囲の味方を含めHPをゆっくりと回復', stackable: false },
  7012300: { name: 'HP低下時、カット率上昇', stackable: true },
  7020000: { name: '【追跡者】スキル使用時、通常攻撃で炎を纏った追撃を行う（大剣のみ）', stackable: true },
  7030000: { name: 'トーテム・ステラの周囲で、強靭度上昇', stackable: true },
  7030200: { name: '苔薬などのアイテム使用でHP回復', stackable: false },
  7030600: { name: 'ガード成功時、アーツゲージを蓄積', stackable: false },
  7030700: { name: 'ガード中、敵に狙われやすくなる', stackable: true },
  7030800: { name: '致命の一撃で、アーツゲージ蓄積増加', stackable: false },
  7030900: { name: '脂アイテム使用時、追加で物理攻撃力上昇', stackable: false },
  7031200: { name: '【復讐者】アーツ発動時、ファミリーと味方を強化', stackable: false },
  7031300: { name: '【無頼漢】スキル中に攻撃を受けると攻撃力と最大スタミナ上昇', stackable: false },
  7031800: { name: '【レディ】背後からの致命の一撃後、自身の姿を見え難くし、足音を消す', stackable: false },
  7031900: { name: '致命の一撃で、ルーンを取得', stackable: true },
  7032400: { name: '【追跡者】アビリティ発動時、アーツゲージ増加', stackable: false },
  7032700: { name: '【レディ】アーツ発動中、敵撃破で攻撃力上昇', stackable: false },
  7032800: { name: '【隠者】属性痕を集めた時、「魔術の地」が発動', stackable: false },
  7032900: { name: '【隠者】アーツ発動時、自身が出血状態になり、攻撃力上昇', stackable: false },
  7033200: { name: '【追跡者】スキルの使用回数+1', stackable: false },
  7033400: { name: '【守護者】アビリティ発動中、ガード成功時、衝撃波が発生', stackable: false },
  7034100: { name: '【隠者】アーツ発動時、最大HP上昇', stackable: false },
  7034400: { name: '【執行者】スキル中の攻撃力上昇、攻撃時にHP減少', stackable: false },
  7034500: { name: '【執行者】スキル中、妖刀が解放状態になるとHP回復', stackable: false },
  7034600: { name: '【鉄の目】アーツのタメ発動時、毒の状態異常を付加', stackable: false },
  7034700: { name: '【鉄の目】アーツ発動後、刺突カウンター強化', stackable: false },
  7035100: { name: '致命の一撃で、スタミナ回復速度上昇', stackable: true },
  7035400: { name: 'ジェスチャー「あぐら」により、発狂が蓄積', stackable: false },
  7035500: { name: '発狂状態になると、FP持続回復', stackable: false },
  7035700: { name: '武器の持ち替え時、いずれかの属性攻撃力を付加', stackable: false },
  7035800: { name: '属性攻撃力が付加された時、属性攻撃力上昇', stackable: true },
  7035900: { name: '武器の持ち替え時、物理攻撃力上昇', stackable: false },
  7036100: { name: 'ガード成功時、HP回復', stackable: false },
  7040000: { name: '通常攻撃の1段目強化', stackable: true },
  7040100: { name: 'ガードカウンター強化', stackable: true },
  7040200: { name: '致命の一撃強化', stackable: true },
  7040201: { name: '致命の一撃強化+1', stackable: false },
  7040300: { name: '投擲壺の攻撃力上昇', stackable: true },
  7040400: { name: '投擲ナイフの攻撃力上昇', stackable: true },
  7040500: { name: '輝石、重力石アイテムの攻撃力上昇', stackable: true },
  7043000: { name: '咆哮とブレス強化', stackable: true },
  7043100: { name: '調香術強化', stackable: true },
  7043200: { name: '石堀りの魔術を強化', stackable: true },
  7043300: { name: 'カーリアの剣の魔術を強化', stackable: true },
  7043400: { name: '輝剣の魔術を強化', stackable: true },
  7043500: { name: '不可視の魔術を強化', stackable: true },
  7043600: { name: '結晶人の魔術を強化', stackable: true },
  7043700: { name: '重力の魔術を強化', stackable: true },
  7043800: { name: '茨の魔術を強化', stackable: true },
  // 7043900: { name: '夜の魔術を強化', stackable: true },
  7044000: { name: '黄金律原理主義の祈祷を強化', stackable: true },
  7044100: { name: '王都古竜信仰の祈祷を強化', stackable: true },
  7044200: { name: '巨人の火の祈祷を強化', stackable: true },
  7044300: { name: '神狩りの祈祷を強化', stackable: true },
  7044400: { name: '獣の祈祷を強化', stackable: true },
  7044500: { name: '狂い火の祈祷を強化', stackable: true },
  7044600: { name: '竜餐の祈祷を強化', stackable: true },
  7050000: { name: '自身を除く、周囲の味方のスタミナ回復速度上昇', stackable: false },
  7050100: { name: 'アイテムの効果が周囲の味方にも発動', stackable: false },
  7060000: { name: '封牢の囚を倒す度、攻撃力上昇', stackable: false },
  7060100: { name: '魔術師塔の仕掛けが解除される度、最大FP上昇', stackable: false },
  7060200: { name: '夜の侵入者を倒す度、攻撃力上昇', stackable: false },
  7070000: { name: '埋もれ宝の位置を地図に表示', stackable: false },
  7080000: { name: '短剣の武器種を3つ以上装備していると攻撃力上昇', stackable: false },
  7080100: { name: '直剣の武器種を3つ以上装備していると攻撃力上昇', stackable: false },
  7080200: { name: '大剣の武器種を3つ以上装備していると攻撃力上昇', stackable: false },
  7080300: { name: '特大剣の武器種を3つ以上装備していると攻撃力上昇', stackable: false },
  7080400: { name: '曲剣の武器種を3つ以上装備していると攻撃力上昇', stackable: false },
  7080500: { name: '大曲剣の武器種を3つ以上装備していると攻撃力上昇', stackable: false },
  7080600: { name: '刀の武器種を3つ以上装備していると攻撃力上昇', stackable: false },
  7080700: { name: '両刃剣の武器種を3つ以上装備していると攻撃力上昇', stackable: false },
  7080800: { name: '刺剣の武器種を3つ以上装備していると攻撃力上昇', stackable: false },
  7080900: { name: '重刺剣の武器種を3つ以上装備していると攻撃力上昇', stackable: false },
  7081000: { name: '斧の武器種を3つ以上装備していると攻撃力上昇', stackable: false },
  7081100: { name: '大斧の武器種を3つ以上装備していると攻撃力上昇', stackable: false },
  7081200: { name: '槌の武器種を3つ以上装備していると攻撃力上昇', stackable: false },
  7081300: { name: '大槌の武器種を3つ以上装備していると攻撃力上昇', stackable: false },
  7081400: { name: 'フレイルの武器種を3つ以上装備していると攻撃力上昇', stackable: false },
  7081500: { name: '槍の武器種を3つ以上装備していると攻撃力上昇', stackable: false },
  7081700: { name: '大槍の武器種を3つ以上装備していると攻撃力上昇', stackable: false },
  7081800: { name: '斧槍の武器種を3つ以上装備していると攻撃力上昇', stackable: false },
  7081900: { name: '鎌の武器種を3つ以上装備していると攻撃力上昇', stackable: false },
  7082000: { name: '拳の武器種を3つ以上装備していると攻撃力上昇', stackable: false },
  7082100: { name: '爪の武器種を3つ以上装備していると攻撃力上昇', stackable: false },
  7082200: { name: '鞭の武器種を3つ以上装備していると攻撃力上昇', stackable: false },
  7082300: { name: '特大武器の武器種を3つ以上装備していると攻撃力上昇', stackable: false },
  7082400: { name: '弓の武器種を3つ以上装備していると攻撃力上昇', stackable: false },
  7082500: { name: '杖の武器種を3つ以上装備していると最大FP上昇', stackable: false },
  7082600: { name: '聖印の武器種を3つ以上装備していると最大FP上昇', stackable: false },
  7082700: { name: '小盾の武器種を3つ以上装備していると最大HP上昇', stackable: false },
  7082800: { name: '中盾の武器種を3つ以上装備していると最大HP上昇', stackable: false },
  7082900: { name: '大盾の武器種を3つ以上装備していると最大HP上昇', stackable: false },
  7090000: { name: '敵を倒した時のアーツゲージ蓄積増加', stackable: false },
  7090100: { name: '敵を倒した時、自身を除く周囲の味方のHPを回復', stackable: false },
  7090300: { name: 'トーテム・ステラの周囲で敵を倒した時、HP回復', stackable: true },
  7100100: { name: '攻撃命中時、スタミナ回復', stackable: false },
  7100110: { name: '攻撃命中時、スタミナ回復+1', stackable: false },
  // 7100190: { name: '攻撃成功時、スタミナ回復+1', stackable: false },
  7110000: { name: '自身と味方の取得ルーン増加', stackable: true },
  7120000: { name: '出撃時の武器に魔力攻撃力を付加', stackable: false },
  7120100: { name: '出撃時の武器に炎攻撃力を付加', stackable: false },
  7120200: { name: '出撃時の武器に雷攻撃力を付加', stackable: false },
  7120300: { name: '出撃時の武器に聖攻撃力を付加', stackable: false },
  7120400: { name: '出撃時の武器に冷気の状態異常を付加', stackable: false },
  7120500: { name: '出撃時の武器に毒の状態異常を付加', stackable: false },
  7120600: { name: '出撃時の武器に出血の状態異常を付加', stackable: false },
  7120900: { name: '出撃時に「石剣の鍵」を持つ', stackable: false },
  7121000: { name: '出撃時に「小さなポーチ」を持つ', stackable: true },
  7121100: { name: '出撃時に「火炎壺」を持つ', stackable: true },
  7121200: { name: '出撃時に「魔力壺」を持つ', stackable: true },
  7121300: { name: '出撃時に「雷壺」を持つ', stackable: true },
  7121400: { name: '出撃時に「聖水壺」を持つ', stackable: true },
  7121500: { name: '出撃時に「骨の毒投げ矢」を持つ', stackable: true },
  7121600: { name: '出撃時に「結晶投げ矢」を持つ', stackable: true },
  7121700: { name: '出撃時に「スローイングダガー」を持つ', stackable: true },
  7121800: { name: '出撃時に「屑輝石」を持つ', stackable: true },
  7121900: { name: '出撃時に「塊の重力石」を持つ', stackable: true },
  7122000: { name: '出撃時に「誘惑の枝」を持つ', stackable: true },
  7122100: { name: '出撃時に「呪霊喚びの鈴」を持つ', stackable: true },
  7122200: { name: '出撃時に「火脂」を持つ', stackable: true },
  7122300: { name: '出撃時に「魔力脂」を持つ', stackable: true },
  7122400: { name: '出撃時に「雷脂」を持つ', stackable: true },
  7122500: { name: '出撃時に「聖脂」を持つ', stackable: true },
  7122600: { name: '出撃時に「盾脂」を持つ', stackable: true },
  7122700: { name: '出撃時の武器の戦技を「輝剣の円陣」にする', stackable: true },
  7122800: { name: '出撃時の武器の戦技を「グラビタス」にする', stackable: true },
  7122900: { name: '出撃時の武器の戦技を「炎撃」にする', stackable: true },
  7123000: { name: '出撃時の武器の戦技を「溶岩噴火」にする', stackable: true },
  7123100: { name: '出撃時の武器の戦技を「落雷」にする', stackable: true },
  7123200: { name: '出撃時の武器の戦技を「雷撃斬」にする', stackable: true },
  7123300: { name: '出撃時の武器の戦技を「聖なる刃」にする', stackable: true },
  7123400: { name: '出撃時の武器の戦技を「祈りの一撃」にする', stackable: true },
  7123500: { name: '出撃時の武器の戦技を「毒の霧」にする', stackable: true },
  7123600: { name: '出撃時の武器の戦技を「毒蛾は二度舞う」にする', stackable: true },
  7123700: { name: '出撃時の武器の戦技を「血の刃」にする', stackable: true },
  7123800: { name: '出撃時の武器の戦技を「切腹」にする', stackable: true },
  7123900: { name: '出撃時の武器の戦技を「冷気の霧」にする', stackable: true },
  7124000: { name: '出撃時の武器の戦技を「霜踏み」にする', stackable: true },
  7124100: { name: '出撃時の武器の戦技を「白い影の誘い」にする', stackable: true },
  7124300: { name: '出撃時の武器の戦技を「我慢」にする', stackable: true },
  7124400: { name: '出撃時の武器の戦技を「クイックステップ」にする', stackable: true },
  7124500: { name: '出撃時の武器の戦技を「嵐脚」にする', stackable: true },
  7124600: { name: '出撃時の武器の戦技を「デターミネーション」にする', stackable: true },
  7124700: { name: '出撃時の武器の戦技を「アローレイン」にする', stackable: true },
  7126000: { name: '出撃時に「星光の欠片」を持つ', stackable: true },
  // 7126001: { name: '出撃時に「星光の欠片」を持つ', stackable: true },
  // 7126002: { name: '出撃時に「星光の欠片」を持つ', stackable: true },
  7150000: { name: 'ガードカウンターに、自身の現在HPの一部を加える', stackable: false },
  7160000: { name: '刺突カウンター発生時、HP回復', stackable: false },
  7220000: { name: '【復讐者】ファミリーと共闘中の間、自身を強化', stackable: false },
  7230000: { name: '出撃中、ショップでの購入に必要なルーンが割引', stackable: false },
  7230001: { name: '出撃中、ショップでの購入に必要なルーンが大割引', stackable: false },
  7240000: { name: 'ダメージで吹き飛ばされた時、強靭度とカット率上昇', stackable: false },
  7260000: { name: '毒状態の敵に対する攻撃を強化', stackable: false },
  7260300: { name: '腐敗状態の敵に対する攻撃を強化', stackable: false },
  7260400: { name: '凍傷状態の敵に対する攻撃を強化', stackable: false },
  7260700: { name: '周囲で凍傷状態の発生時、自身の姿を隠す', stackable: false },
  7260710: { name: '周囲で毒／腐敗状態発生時、攻撃力上昇', stackable: false },
  // 7260800: { name: '周囲で毒／腐敗状態発生時、攻撃力上昇', stackable: false },
  7270100: { name: '【鉄の目】スキルの使用回数+1', stackable: false },
  7280000: { name: '【鉄の目】弱点の持続時間を延長させる', stackable: false },
  7290000: { name: '【レディ】スキルのダメージ上昇', stackable: false },
  7310000: { name: '【無頼漢】アーツの効果時間延長', stackable: false },
  7330000: { name: '短剣の攻撃力上昇', stackable: true },
  7330100: { name: '直剣の攻撃力上昇', stackable: true },
  7330200: { name: '大剣の攻撃力上昇', stackable: true },
  7330300: { name: '特大剣の攻撃力上昇', stackable: true },
  7330400: { name: '曲剣の攻撃力上昇', stackable: true },
  7330500: { name: '大曲剣の攻撃力上昇', stackable: true },
  7330600: { name: '刀の攻撃力上昇', stackable: true },
  7330700: { name: '両刃剣の攻撃力上昇', stackable: true },
  7330800: { name: '刺剣の攻撃力上昇', stackable: true },
  7330900: { name: '重刺剣の攻撃力上昇', stackable: true },
  7331000: { name: '斧の攻撃力上昇', stackable: true },
  7331100: { name: '大斧の攻撃力上昇', stackable: true },
  7331200: { name: '槌の攻撃力上昇', stackable: true },
  7331300: { name: '大槌の攻撃力上昇', stackable: true },
  7331400: { name: 'フレイルの攻撃力上昇', stackable: true },
  7331500: { name: '槍の攻撃力上昇', stackable: true },
  7331700: { name: '大槍の攻撃力上昇', stackable: true },
  7331800: { name: '斧槍の攻撃力上昇', stackable: true },
  7331900: { name: '鎌の攻撃力上昇', stackable: true },
  7332000: { name: '拳の攻撃力上昇', stackable: true },
  7332100: { name: '爪の攻撃力上昇', stackable: true },
  7332200: { name: '鞭の攻撃力上昇', stackable: true },
  7332300: { name: '特大武器の攻撃力上昇', stackable: true },
  7332400: { name: '弓の攻撃力上昇', stackable: true },
  7340000: { name: '短剣の攻撃でHP回復', stackable: false },
  7340100: { name: '直剣の攻撃でHP回復', stackable: false },
  7340200: { name: '大剣の攻撃でHP回復', stackable: false },
  7340300: { name: '特大剣の攻撃でHP回復', stackable: false },
  7340400: { name: '曲剣の攻撃でHP回復', stackable: false },
  7340500: { name: '大曲剣の攻撃でHP回復', stackable: false },
  7340600: { name: '刀の攻撃でHP回復', stackable: false },
  7340700: { name: '両刃剣の攻撃でHP回復', stackable: false },
  7340800: { name: '刺剣の攻撃でHP回復', stackable: false },
  7340900: { name: '重刺剣の攻撃でHP回復', stackable: false },
  7341000: { name: '斧の攻撃でHP回復', stackable: false },
  7341100: { name: '大斧の攻撃でHP回復', stackable: false },
  7341200: { name: '槌の攻撃でHP回復', stackable: false },
  7341300: { name: '大槌の攻撃でHP回復', stackable: false },
  7341400: { name: 'フレイルの攻撃でHP回復', stackable: false },
  7341500: { name: '槍の攻撃でHP回復', stackable: false },
  7341700: { name: '大槍の攻撃でHP回復', stackable: false },
  7341800: { name: '斧槍の攻撃でHP回復', stackable: false },
  7341900: { name: '鎌の攻撃でHP回復', stackable: false },
  7342000: { name: '拳の攻撃でHP回復', stackable: false },
  7342100: { name: '爪の攻撃でHP回復', stackable: false },
  7342200: { name: '鞭の攻撃でHP回復', stackable: false },
  7342300: { name: '特大武器の攻撃でHP回復', stackable: false },
  7342400: { name: '弓の攻撃でHP回復', stackable: false },
  7350000: { name: '短剣の攻撃でFP回復', stackable: false },
  7350100: { name: '直剣の攻撃でFP回復', stackable: false },
  7350200: { name: '大剣の攻撃でFP回復', stackable: false },
  7350300: { name: '特大剣の攻撃でFP回復', stackable: false },
  7350400: { name: '曲剣の攻撃でFP回復', stackable: false },
  7350500: { name: '大曲剣の攻撃でFP回復', stackable: false },
  7350600: { name: '刀の攻撃でFP回復', stackable: false },
  7350700: { name: '両刃剣の攻撃でFP回復', stackable: false },
  7350800: { name: '刺剣の攻撃でFP回復', stackable: false },
  7350900: { name: '重刺剣の攻撃でFP回復', stackable: false },
  7351000: { name: '斧の攻撃でFP回復', stackable: false },
  7351100: { name: '大斧の攻撃でFP回復', stackable: false },
  7351200: { name: '槌の攻撃でFP回復', stackable: false },
  7351300: { name: '大槌の攻撃でFP回復', stackable: false },
  7351400: { name: 'フレイルの攻撃でFP回復', stackable: false },
  7351500: { name: '槍の攻撃でFP回復', stackable: false },
  7351700: { name: '大槍の攻撃でFP回復', stackable: false },
  7351800: { name: '斧槍の攻撃でFP回復', stackable: false },
  7351900: { name: '鎌の攻撃でFP回復', stackable: false },
  7352000: { name: '拳の攻撃でFP回復', stackable: false },
  7352100: { name: '爪の攻撃でFP回復', stackable: false },
  7352200: { name: '鞭の攻撃でFP回復', stackable: false },
  7352300: { name: '特大武器の攻撃でFP回復', stackable: false },
  7352400: { name: '弓の攻撃でFP回復', stackable: false },
}

/**
 * 深層の遺物固有の効果一覧
 */
export const depthsRelicEffectMap: RelicEffectMap = {
  // 6000800: { name: 'スキルクールタイム軽減+4', stackable: true },
  // 6000801: { name: 'スキルクールタイム軽減+5', stackable: true },
  // 6000900: { name: 'アーツゲージ蓄積増加+4', stackable: true },
  // 6000901: { name: 'アーツゲージ蓄積増加+5', stackable: true },
  // 6001000: { name: '精神力+4', stackable: true },
  // 6001001: { name: '精神力+5', stackable: true },
  6001400: { name: '物理攻撃力上昇+3', stackable: true },
  6001401: { name: '物理攻撃力上昇+4', stackable: true },
  6001500: { name: '魔力攻撃力上昇+3', stackable: true },
  6001501: { name: '魔力攻撃力上昇+4', stackable: true },
  6001600: { name: '炎攻撃力上昇+3', stackable: true },
  6001601: { name: '炎攻撃力上昇+4', stackable: true },
  6001700: { name: '雷攻撃力上昇+3', stackable: true },
  6001701: { name: '雷攻撃力上昇+4', stackable: true },
  6001800: { name: '聖攻撃力上昇+3', stackable: true },
  6001801: { name: '聖攻撃力上昇+4', stackable: true },
  6002600: { name: '魔力カット率上昇+1', stackable: true },
  6002601: { name: '魔力カット率上昇+2', stackable: true },
  6002700: { name: '炎カット率上昇+1', stackable: true },
  6002701: { name: '炎カット率上昇+2', stackable: true },
  6002800: { name: '雷カット率上昇+1', stackable: true },
  6002801: { name: '雷カット率上昇+2', stackable: true },
  6002900: { name: '聖カット率上昇+1', stackable: true },
  6002901: { name: '聖カット率上昇+2', stackable: true },
  6003000: { name: '毒耐性上昇+1', stackable: true },
  6003001: { name: '毒耐性上昇+2', stackable: true },
  6003100: { name: '出血耐性上昇+1', stackable: true },
  6003101: { name: '出血耐性上昇+2', stackable: true },
  6003200: { name: '睡眠耐性上昇+1', stackable: true },
  6003201: { name: '睡眠耐性上昇+2', stackable: true },
  6003300: { name: '抗死耐性上昇+1', stackable: true },
  6003301: { name: '抗死耐性上昇+2', stackable: true },
  6003400: { name: '腐敗耐性上昇+1', stackable: true },
  6003401: { name: '腐敗耐性上昇+2', stackable: true },
  6003500: { name: '冷気耐性上昇+1', stackable: true },
  6003501: { name: '冷気耐性上昇+2', stackable: true },
  6003600: { name: '発狂耐性上昇+1', stackable: true },
  6003601: { name: '発狂耐性上昇+2', stackable: true },
  6005600: { name: 'ダメージを受けた直後、攻撃によりHPの一部を回復+1', stackable: true },
  6005601: { name: 'ダメージを受けた直後、攻撃によりHPの一部を回復+2', stackable: true },
  // 6006000: { name: '両手持ちの、体勢を崩す力上昇+1', stackable: true },
  // 6006001: { name: '両手持ちの、体勢を崩す力上昇+2', stackable: true },
  // 6006100: { name: '二刀持ちの、体勢を崩す力上昇+1', stackable: true },
  // 6006101: { name: '二刀持ちの、体勢を崩す力上昇+2', stackable: true },
  // 6012300: { name: 'HP低下時、カット率上昇+1', stackable: true },
  // 6012301: { name: 'HP低下時、カット率上昇+2', stackable: true },
  6030200: { name: '苔薬などのアイテム使用でHP回復+1', stackable: true },
  6030201: { name: '苔薬などのアイテム使用でHP回復+2', stackable: true },
  6030600: { name: 'ガード成功時、アーツゲージを蓄積+1', stackable: true },
  6030601: { name: 'ガード成功時、アーツゲージを蓄積+2', stackable: true },
  6030800: { name: '致命の一撃で、アーツゲージ蓄積増加+1', stackable: true },
  6030801: { name: '致命の一撃で、アーツゲージ蓄積増加+2', stackable: true },
  6030900: { name: '脂アイテム使用時、追加で物理攻撃力上昇+1', stackable: true },
  6030901: { name: '脂アイテム使用時、追加で物理攻撃力上昇+2', stackable: true },
  6031900: { name: '致命の一撃で、ルーンを取得+1', stackable: true },
  6031901: { name: '致命の一撃で、ルーンを取得+2', stackable: true },
  6032200: { name: '攻撃を受けると攻撃力上昇+1', stackable: true },
  6032201: { name: '攻撃を受けると攻撃力上昇+2', stackable: true },
  6035100: { name: '致命の一撃で、スタミナ回復速度上昇+1', stackable: true },
  6035101: { name: '致命の一撃で、スタミナ回復速度上昇+2', stackable: true },
  6040000: { name: '通常攻撃の1段目強化+1', stackable: true },
  6040001: { name: '通常攻撃の1段目強化+2', stackable: true },
  6040100: { name: 'ガードカウンター強化+1', stackable: true },
  6040101: { name: 'ガードカウンター強化+2', stackable: true },
  6040300: { name: '投擲壺の攻撃力上昇+1', stackable: true },
  6040301: { name: '投擲壺の攻撃力上昇+2', stackable: true },
  6040400: { name: '投擲ナイフの攻撃力上昇+1', stackable: true },
  6040401: { name: '投擲ナイフの攻撃力上昇+2', stackable: true },
  6040500: { name: '輝石、重力石アイテムの攻撃力上昇+1', stackable: true },
  6040501: { name: '輝石、重力石アイテムの攻撃力上昇+2', stackable: true },
  6043000: { name: '咆哮とブレス強化+1', stackable: true },
  6043001: { name: '咆哮とブレス強化+2', stackable: true },
  6043100: { name: '調香術強化+1', stackable: true },
  6043101: { name: '調香術強化+2', stackable: true },
  6060300: { name: '大教会の強敵を倒す度、最大HP上昇', stackable: true },
  6060400: { name: '小砦の強敵を倒す度、取得ルーン増加、発見力上昇', stackable: true },
  6060500: { name: '遺跡の強敵を倒す度、神秘上昇', stackable: true },
  6060600: { name: '大野営地の強敵を倒す度、最大スタミナ上昇', stackable: true },
  6090000: { name: '敵を倒した時のアーツゲージ蓄積増加+1', stackable: true },
  6090001: { name: '敵を倒した時のアーツゲージ蓄積増加+2', stackable: true },
  6160000: { name: '刺突カウンター発生時、HP回復+1', stackable: true },
  6160001: { name: '刺突カウンター発生時、HP回復+2', stackable: true },
  6260000: { name: '毒状態の敵に対する攻撃を強化+1', stackable: true },
  6260001: { name: '毒状態の敵に対する攻撃を強化+2', stackable: true },
  6260300: { name: '腐敗状態の敵に対する攻撃を強化+1', stackable: true },
  6260301: { name: '腐敗状態の敵に対する攻撃を強化+2', stackable: true },
  6260400: { name: '凍傷状態の敵に対する攻撃を強化+1', stackable: true },
  6260401: { name: '凍傷状態の敵に対する攻撃を強化+2', stackable: true },
  6500000: { name: '【追跡者】スキルに、出血の状態異常を付加', stackable: false },
  6500100: { name: '【守護者】スキル使用時、周囲の味方のカット率上昇', stackable: false },
  6500200: { name: '【鉄の目】スキルに毒の状態異常を付加して毒状態の敵に大ダメージ', stackable: false },
  6500300: { name: '【レディ】スキル使用時、僅かに無敵', stackable: false },
  6500400: { name: '【無頼漢】スキル命中時、敵の攻撃力低下', stackable: false },
  6500500: { name: '【復讐者】アビリティ発動時、最大FP上昇', stackable: false },
  6500600: { name: '【隠者】属性痕を集めた時、対応する属性カット率上昇', stackable: false },
  6500700: { name: '【執行者】アビリティ発動時、HPをゆっくりと回復', stackable: false },
  6600000: { name: '周囲で睡眠状態の発生時、攻撃力上昇', stackable: false },
  6600001: { name: '周囲で睡眠状態の発生時、攻撃力上昇+1', stackable: false },
  // 6600002: { name: '周囲で睡眠状態の発生時、攻撃力上昇+2', stackable: false },
  6600100: { name: '周囲で発狂状態の発生時、攻撃力上昇', stackable: false },
  6600101: { name: '周囲で発狂状態の発生時、攻撃力上昇+1', stackable: false },
  // 6600102: { name: '周囲で発狂状態の発生時、攻撃力上昇+2', stackable: false },
  6610400: { name: '最大HP上昇(深層の遺物)', stackable: false },
  6610500: { name: '最大FP上昇(深層の遺物)', stackable: false },
  6610600: { name: '最大スタミナ上昇(深層の遺物)', stackable: false },
  6610700: { name: '消費FP軽減', stackable: false },
  6610701: { name: '消費FP軽減+1', stackable: false },
  6610702: { name: '消費FP軽減+2', stackable: false },
  6610800: { name: '属性攻撃力上昇', stackable: false },
  6610801: { name: '属性攻撃力上昇+1', stackable: false },
  6610802: { name: '属性攻撃力上昇+2', stackable: false },
  // 6611000: { name: '物理カット率上昇', stackable: false },
  6611001: { name: '物理カット率上昇+1', stackable: false },
  6611002: { name: '物理カット率上昇+2', stackable: false },
  6611100: { name: '属性カット率上昇', stackable: false },
  6611101: { name: '属性カット率上昇+1', stackable: false },
  6611102: { name: '属性カット率上昇+2', stackable: false },
  6611200: { name: '魔術強化', stackable: false },
  6611201: { name: '魔術強化+1', stackable: false },
  6611202: { name: '魔術強化+2', stackable: false },
  6611300: { name: '祈祷強化', stackable: false },
  6611301: { name: '祈祷強化+1', stackable: false },
  6611302: { name: '祈祷強化+2', stackable: false },
  6611400: { name: '聖杯瓶の回復量上昇', stackable: false },
  6621000: { name: '出撃時に「緋溢れの結晶雫」を持つ', stackable: false },
  6621100: { name: '出撃時に「緋色の結晶雫」を持つ', stackable: false },
  6621200: { name: '出撃時に「青色の結晶雫」を持つ', stackable: false },
  6621300: { name: '出撃時に「斑彩色の硬雫」を持つ', stackable: false },
  6621400: { name: '出撃時に「緋色の泡雫」を持つ', stackable: false },
  6621500: { name: '出撃時に「真珠色の泡雫」を持つ', stackable: false },
  6621600: { name: '出撃時に「緋湧きの結晶雫」を持つ', stackable: false },
  6621700: { name: '出撃時に「緑湧きの結晶雫」を持つ', stackable: false },
  6621800: { name: '出撃時に「真珠色の硬雫」を持つ', stackable: false },
  6621900: { name: '出撃時に「連棘の割れ雫」を持つ', stackable: false },
  6622000: { name: '出撃時に「大棘の割れ雫」を持つ', stackable: false },
  6622100: { name: '出撃時に「風の結晶雫」を持つ', stackable: false },
  6622200: { name: '出撃時に「破裂した結晶雫」を持つ', stackable: false },
  6622300: { name: '出撃時に「鉛色の硬雫」を持つ', stackable: false },
  6622400: { name: '出撃時に「細枝の割れ雫」を持つ', stackable: false },
  6622500: { name: '出撃時に「緋色渦の泡雫」を持つ', stackable: false },
  6622600: { name: '出撃時に「青色の秘雫」を持つ', stackable: false },
  6622700: { name: '出撃時に「岩棘の割れ雫」を持つ', stackable: false },
  6622800: { name: '出撃時に「炎纏いの割れ雫」を持つ', stackable: false },
  6622900: { name: '出撃時に「魔力纏いの割れ雫」を持つ', stackable: false },
  6623000: { name: '出撃時に「雷纏いの割れ雫」を持つ', stackable: false },
  6623100: { name: '出撃時に「聖纏いの割れ雫」を持つ', stackable: false },
  6624000: { name: '出撃時に「高揚の香り」を持つ', stackable: false },
  6624100: { name: '出撃時に「火花の香り」を持つ', stackable: false },
  6624200: { name: '出撃時に「鉄壺の香薬」を持つ', stackable: false },
  6624300: { name: '出撃時に「狂熱の香薬」を持つ', stackable: false },
  6624400: { name: '出撃時に「毒の噴霧」を持つ', stackable: false },
  6624500: { name: '出撃時に「酸の噴霧」を持つ', stackable: false },
  6630000: { name: '潜在する力から、「短剣」を見つけやすくなる', stackable: false },
  6630100: { name: '潜在する力から、「直剣」を見つけやすくなる', stackable: false },
  6630200: { name: '潜在する力から、「大剣」を見つけやすくなる', stackable: false },
  6630300: { name: '潜在する力から、「特大剣」を見つけやすくなる', stackable: false },
  6630400: { name: '潜在する力から、「曲剣」を見つけやすくなる', stackable: false },
  6630500: { name: '潜在する力から、「大曲剣」を見つけやすくなる', stackable: false },
  6630600: { name: '潜在する力から、「刀」を見つけやすくなる', stackable: false },
  6630700: { name: '潜在する力から、「両刃剣」を見つけやすくなる', stackable: false },
  6630800: { name: '潜在する力から、「刺剣」を見つけやすくなる', stackable: false },
  6630900: { name: '潜在する力から、「重刺剣」を見つけやすくなる', stackable: false },
  6631000: { name: '潜在する力から、「斧」を見つけやすくなる', stackable: false },
  6631100: { name: '潜在する力から、「大斧」を見つけやすくなる', stackable: false },
  6631200: { name: '潜在する力から、「槌」を見つけやすくなる', stackable: false },
  6631300: { name: '潜在する力から、「大槌」を見つけやすくなる', stackable: false },
  6631400: { name: '潜在する力から、「フレイル」を見つけやすくなる', stackable: false },
  6631500: { name: '潜在する力から、「槍」を見つけやすくなる', stackable: false },
  6631600: { name: '潜在する力から、「大槍」を見つけやすくなる', stackable: false },
  6631700: { name: '潜在する力から、「斧槍」を見つけやすくなる', stackable: false },
  6631800: { name: '潜在する力から、「鎌」を見つけやすくなる', stackable: false },
  6631900: { name: '潜在する力から、「拳」を見つけやすくなる', stackable: false },
  6632000: { name: '潜在する力から、「爪」を見つけやすくなる', stackable: false },
  6632100: { name: '潜在する力から、「鞭」を見つけやすくなる', stackable: false },
  6632200: { name: '潜在する力から、「特大武器」を見つけやすくなる', stackable: false },
  6632300: { name: '潜在する力から、「弓」を見つけやすくなる', stackable: false },
  6632400: { name: '潜在する力から、「大弓」を見つけやすくなる', stackable: false },
  6632500: { name: '潜在する力から、「クロスボウ」を見つけやすくなる', stackable: false },
  6632600: { name: '潜在する力から、「バリスタ」を見つけやすくなる', stackable: false },
  6632700: { name: '潜在する力から、「小盾」を見つけやすくなる', stackable: false },
  6632800: { name: '潜在する力から、「中盾」を見つけやすくなる', stackable: false },
  6632900: { name: '潜在する力から、「大盾」を見つけやすくなる', stackable: false },
  6633000: { name: '潜在する力から、「杖」を見つけやすくなる', stackable: false },
  6633100: { name: '潜在する力から、「聖印」を見つけやすくなる', stackable: false },
  6633200: { name: '潜在する力から、「松明」を見つけやすくなる', stackable: false },
  6640000: { name: '【追跡者】精神力上昇、生命力低下', stackable: false },
  6640100: { name: '【追跡者】知力/信仰上昇、筋力/技量低下', stackable: false },
  6641000: { name: '【守護者】筋力/技量上昇、生命力低下', stackable: false },
  6641100: { name: '【守護者】精神力/信仰上昇、生命力低下', stackable: false },
  6642000: { name: '【鉄の目】神秘上昇、技量低下', stackable: false },
  6642100: { name: '【鉄の目】生命力/筋力上昇、技量低下', stackable: false },
  6643000: { name: '【レディ】生命力/筋力上昇、精神力低下', stackable: false },
  6643100: { name: '【レディ】精神力/信仰上昇、知力低下', stackable: false },
  6644000: { name: '【無頼漢】精神力/知力上昇、生命力/持久力低下', stackable: false },
  6644100: { name: '【無頼漢】神秘上昇、生命力低下', stackable: false },
  6645000: { name: '【復讐者】生命力/持久力上昇、精神力低下', stackable: false },
  6645100: { name: '【復讐者】筋力上昇、信仰低下', stackable: false },
  6646000: { name: '【隠者】生命力/持久力/技量上昇、知力/信仰低下', stackable: false },
  6646100: { name: '【隠者】知力/信仰上昇、精神力低下', stackable: false },
  6647000: { name: '【執行者】生命力/持久力上昇、神秘低下', stackable: false },
  6647100: { name: '【執行者】技量/神秘上昇、生命力低下', stackable: false },
}

/**
 * 深層の遺物のネガティブな固有効果の一覧
 */
export const negativeDepthsRelicEffectMap: RelicEffectMap = {
  // 6800000: { name: 'Reduced Vigor', stackable: true },
  // 6800200: { name: 'Reduced Endurance', stackable: true },
  // 6810100: { name: 'Impaired Damage Negation', stackable: true },
  6820000: { name: '被ダメージ時、毒を蓄積', stackable: true },
  6820100: { name: '被ダメージ時、腐敗を蓄積', stackable: true },
  6820200: { name: '被ダメージ時、冷気を蓄積', stackable: true },
  6820300: { name: '被ダメージ時、出血を蓄積', stackable: true },
  6820400: { name: '被ダメージ時、発狂を蓄積', stackable: true },
  6820500: { name: '被ダメージ時、睡眠を蓄積', stackable: true },
  6820600: { name: '被ダメージ時、死を蓄積', stackable: true },
  6830000: { name: '筋力と知力が低下', stackable: true },
  6830100: { name: '技量と信仰が低下', stackable: true },
  6830200: { name: '知力と技量が低下', stackable: true },
  6830300: { name: '信仰と筋力が低下', stackable: true },
  6830400: { name: '生命力と神秘が低下', stackable: true },
  6840000: { name: '取得ルーン減少', stackable: true },
  6840100: { name: '聖杯瓶の回復量低下', stackable: true },
  6840200: { name: 'アーツゲージ蓄積鈍化', stackable: true },
  // 6850000: { name: 'Impaired Physical Damage Negation', stackable: true },
  // 6850100: { name: 'Impaired Affinity Damage Negation', stackable: true },
  6850200: { name: 'すべての状態異常耐性低下', stackable: true },
  // 6850300: { name: '聖杯瓶の回復量低下', stackable: true }, // Duplicate of 6840100 ???
  // 6850400: { name: 'Surge Sprinting Drains More Stamina', stackable: true },
  6850500: { name: 'HP持続減少', stackable: true },
  // 6850600: { name: 'Increased Drain on Stamina for Evasion', stackable: true },
  6850700: { name: '回避直後の被ダメージ増加', stackable: true },
  6850800: { name: '回避連続時、カット率低下', stackable: true },
  6850900: { name: '聖杯瓶使用時、カット率低下', stackable: true },
  // 6851000: { name: 'Sleep Buildup for Flask Usages', stackable: true },
  // 6851100: { name: 'Madness Buildup for Flask Usages', stackable: true },
  6851200: { name: 'HP最大未満時、攻撃力低下', stackable: true },
  6851300: { name: 'HP最大未満時、毒が蓄積', stackable: true },
  6851400: { name: 'HP最大未満時、腐敗が蓄積', stackable: true },
  // 6851500: { name: 'Max HP Reduces Attack Power', stackable: true },
  // 6851600: { name: 'Near Death Spills Flask', stackable: true },
  6851700: { name: '瀕死時、最大HP低下', stackable: true },
}

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

function mapper(item: Relic['name'] | { name: string; unselectable?: boolean; children: string[] }): {
  id: string
  name: string
  stackable: boolean
  unselectable?: boolean
  children?: ReturnType<typeof mapper>[]
} {
  if (typeof item === 'object') {
    const children = item.children.map(mapper)

    return {
      id: children.map((x) => x.id).join(','),
      name: item.name,
      stackable: children.some((c) => c.stackable),
      unselectable: item.unselectable,
      children,
    }
  }

  const name = item
  const foundItem = Object.entries({ ...relicEffectMap, ...depthsRelicEffectMap }).find(
    ([, item]) => item.name === name,
  )

  invariant(foundItem, `Relic effect not found: ${name}`)

  return { id: foundItem[0], ...foundItem[1] }
}

function idGenerator() {
  let v = {
    major: 0,
    minor: 0,
    patch: 0,
  }

  return (incrementTo: 'major' | 'minor' | 'patch') => {
    switch (incrementTo) {
      case 'major':
        v.major += 1
        v.minor = 0
        v.patch = 0
        break
      case 'minor':
        v.minor += 1
        v.patch = 0
        break
      case 'patch':
        v.patch += 1
        break
    }

    return [v.major, v.minor, v.patch].join('.')
  }
}

const nextId = idGenerator()

export const relicCategoryEntries: ReturnType<typeof mapper>[] = [
  {
    id: nextId('major'),
    stackable: true,
    name: '能力値',
    children: [
      '最大HP上昇',
      '最大HP上昇(深層の遺物)',
      '最大FP上昇',
      '最大FP上昇(深層の遺物)',
      '最大スタミナ上昇',
      '最大スタミナ上昇(深層の遺物)',
      {
        name: '生命力',
        children: ['生命力+1', '生命力+2', '生命力+3'],
      },
      {
        name: '精神力',
        children: ['精神力+1', '精神力+2', '精神力+3'],
      },
      {
        name: '持久力',
        children: ['持久力+1', '持久力+2', '持久力+3'],
      },
      {
        name: '筋力',
        children: ['筋力+1', '筋力+2', '筋力+3'],
      },
      {
        name: '技量',
        children: ['技量+1', '技量+2', '技量+3'],
      },
      {
        name: '知力',
        children: ['知力+1', '知力+2', '知力+3'],
      },
      {
        name: '信仰',
        children: ['信仰+1', '信仰+2', '信仰+3'],
      },
      {
        name: '神秘',
        children: ['神秘+1', '神秘+2', '神秘+3'],
      },
      {
        name: '強靭度',
        children: ['強靭度+1', '強靭度+2', '強靭度+3'],
      },
      '魔術師塔の仕掛けが解除される度、最大FP上昇',
      '小砦の強敵を倒す度、取得ルーン増加、発見力上昇',
      '大教会の強敵を倒す度、最大HP上昇',
      '大野営地の強敵を倒す度、最大スタミナ上昇',
      '遺跡の強敵を倒す度、神秘上昇',
    ].map(mapper),
  },
  {
    id: nextId('major'),
    stackable: true,
    name: '攻撃力',
    children: [
      {
        name: '物理攻撃力上昇',
        children: ['物理攻撃力上昇', '物理攻撃力上昇+1', '物理攻撃力上昇+2', '物理攻撃力上昇+3', '物理攻撃力上昇+4'],
      },
      {
        name: '属性攻撃力上昇',
        children: ['属性攻撃力上昇', '属性攻撃力上昇+1', '属性攻撃力上昇+2'],
      },
      {
        name: '魔力攻撃力上昇',
        children: ['魔力攻撃力上昇', '魔力攻撃力上昇+1', '魔力攻撃力上昇+2', '魔力攻撃力上昇+3', '魔力攻撃力上昇+4'],
      },
      {
        name: '炎攻撃力上昇',
        children: ['炎攻撃力上昇', '炎攻撃力上昇+1', '炎攻撃力上昇+2', '炎攻撃力上昇+3', '炎攻撃力上昇+4'],
      },
      {
        name: '雷攻撃力上昇',
        children: ['雷攻撃力上昇', '雷攻撃力上昇+1', '雷攻撃力上昇+2', '雷攻撃力上昇+3', '雷攻撃力上昇+4'],
      },
      {
        name: '聖攻撃力上昇',
        children: ['聖攻撃力上昇', '聖攻撃力上昇+1', '聖攻撃力上昇+2', '聖攻撃力上昇+3', '聖攻撃力上昇+4'],
      },
      {
        name: '通常攻撃の1段目強化',
        children: ['通常攻撃の1段目強化', '通常攻撃の1段目強化+1', '通常攻撃の1段目強化+2'],
      },
      {
        name: '致命の一撃強化',
        children: ['致命の一撃強化', '致命の一撃強化+1'],
      },
      {
        name: '魔術強化',
        children: ['魔術強化', '魔術強化+1', '魔術強化+2'],
      },
      {
        name: '祈祷強化',
        children: ['祈祷強化', '祈祷強化+1', '祈祷強化+2'],
      },
      {
        name: '咆哮とブレス強化',
        children: ['咆哮とブレス強化', '咆哮とブレス強化+1', '咆哮とブレス強化+2'],
      },
      {
        name: '両手持ちの、体勢を崩す力上昇',
        children: ['両手持ちの、体勢を崩す力上昇'],
      },
      {
        name: '二刀持ちの、体勢を崩す力上昇',
        children: ['二刀持ちの、体勢を崩す力上昇'],
      },
      '武器の持ち替え時、物理攻撃力上昇',
      '属性攻撃力が付加された時、属性攻撃力上昇',
      {
        name: '攻撃を受けると攻撃力上昇',
        children: ['攻撃を受けると攻撃力上昇', '攻撃を受けると攻撃力上昇+1', '攻撃を受けると攻撃力上昇+2'],
      },
      '封牢の囚を倒す度、攻撃力上昇',
      '夜の侵入者を倒す度、攻撃力上昇',
      {
        name: 'ガードカウンター強化',
        children: ['ガードカウンター強化', 'ガードカウンター強化+1', 'ガードカウンター強化+2'],
      },
      'ガードカウンターに、自身の現在HPの一部を加える',
      {
        name: '脂アイテム使用時、追加で物理攻撃力上昇',
        children: [
          '脂アイテム使用時、追加で物理攻撃力上昇',
          '脂アイテム使用時、追加で物理攻撃力上昇+1',
          '脂アイテム使用時、追加で物理攻撃力上昇+2',
        ],
      },
      {
        name: '投擲壺の攻撃力上昇',
        children: ['投擲壺の攻撃力上昇', '投擲壺の攻撃力上昇+1', '投擲壺の攻撃力上昇+2'],
      },
      {
        name: '投擲ナイフの攻撃力上昇',
        children: ['投擲ナイフの攻撃力上昇', '投擲ナイフの攻撃力上昇+1', '投擲ナイフの攻撃力上昇+2'],
      },
      {
        name: '輝石、重力石アイテムの攻撃力上昇',
        children: [
          '輝石、重力石アイテムの攻撃力上昇',
          '輝石、重力石アイテムの攻撃力上昇+1',
          '輝石、重力石アイテムの攻撃力上昇+2',
        ],
      },
      {
        name: '調香術強化',
        children: ['調香術強化', '調香術強化+1', '調香術強化+2'],
      },
    ].map(mapper),
  },
  {
    id: nextId('major'),
    stackable: true,
    name: 'スキル／アーツ',
    children: [
      {
        name: 'スキルクールタイム軽減',
        children: ['スキルクールタイム軽減+1', 'スキルクールタイム軽減+2', 'スキルクールタイム軽減+3'],
      },
      {
        name: 'アーツゲージ蓄積増加',
        children: ['アーツゲージ蓄積増加+1', 'アーツゲージ蓄積増加+2', 'アーツゲージ蓄積増加+3'],
      },
      {
        name: '敵を倒した時のアーツゲージ蓄積増加',
        children: [
          '敵を倒した時のアーツゲージ蓄積増加',
          '敵を倒した時のアーツゲージ蓄積増加+1',
          '敵を倒した時のアーツゲージ蓄積増加+2',
        ],
      },
      {
        name: '致命の一撃で、アーツゲージ蓄積増加',
        children: [
          '致命の一撃で、アーツゲージ蓄積増加',
          '致命の一撃で、アーツゲージ蓄積増加+1',
          '致命の一撃で、アーツゲージ蓄積増加+2',
        ],
      },
      {
        name: 'ガード成功時、アーツゲージを蓄積',
        children: [
          'ガード成功時、アーツゲージを蓄積',
          'ガード成功時、アーツゲージを蓄積+1',
          'ガード成功時、アーツゲージを蓄積+2',
        ],
      },
    ].map(mapper),
  },
  {
    id: nextId('major'),
    stackable: true,
    name: '魔術／祈祷',
    children: [
      '輝剣の魔術を強化',
      '石堀りの魔術を強化',
      'カーリアの剣の魔術を強化',
      '不可視の魔術を強化',
      '結晶人の魔術を強化',
      '重力の魔術を強化',
      '茨の魔術を強化' /*, 7043900*/,
      '黄金律原理主義の祈祷を強化',
      '王都古竜信仰の祈祷を強化',
      '巨人の火の祈祷を強化',
      '神狩りの祈祷を強化',
      '獣の祈祷を強化',
      '狂い火の祈祷を強化',
      '竜餐の祈祷を強化',
    ].map(mapper),
  },
  {
    id: nextId('major'),
    stackable: true,
    name: 'カット率',
    children: [
      {
        name: '物理カット率上昇',
        children: ['物理カット率上昇', '物理カット率上昇+1', '物理カット率上昇+2'],
      },
      {
        name: '属性カット率上昇',
        children: ['属性カット率上昇', '属性カット率上昇+1', '属性カット率上昇+2'],
      },
      {
        name: '魔力カット率上昇',
        children: ['魔力カット率上昇', '魔力カット率上昇+1', '魔力カット率上昇+2'],
      },
      {
        name: '炎カット率上昇',
        children: ['炎カット率上昇', '炎カット率上昇+1', '炎カット率上昇+2'],
      },
      {
        name: '雷カット率上昇',
        children: ['雷カット率上昇', '雷カット率上昇+1', '雷カット率上昇+2'],
      },
      {
        name: '聖カット率上昇',
        children: ['聖カット率上昇', '聖カット率上昇+1', '聖カット率上昇+2'],
      },
      {
        name: 'HP低下時、カット率上昇',
        children: ['HP低下時、カット率上昇'],
      },
      'ダメージで吹き飛ばされた時、強靭度とカット率上昇',
    ].map(mapper),
  },
  {
    id: nextId('major'),
    stackable: true,
    name: '状態異常耐性',
    children: [
      {
        name: '毒耐性上昇',
        children: ['毒耐性上昇', '毒耐性上昇+1', '毒耐性上昇+2'],
      },
      {
        name: '腐敗耐性上昇',
        children: ['腐敗耐性上昇', '腐敗耐性上昇+1', '腐敗耐性上昇+2'],
      },
      {
        name: '出血耐性上昇',
        children: ['出血耐性上昇', '出血耐性上昇+1', '出血耐性上昇+2'],
      },
      {
        name: '冷気耐性上昇',
        children: ['冷気耐性上昇', '冷気耐性上昇+1', '冷気耐性上昇+2'],
      },
      {
        name: '睡眠耐性上昇',
        children: ['睡眠耐性上昇', '睡眠耐性上昇+1', '睡眠耐性上昇+2'],
      },
      {
        name: '発狂耐性上昇',
        children: ['発狂耐性上昇', '発狂耐性上昇+1', '発狂耐性上昇+2'],
      },
      {
        name: '抗死耐性上昇',
        children: ['抗死耐性上昇', '抗死耐性上昇+1', '抗死耐性上昇+2'],
      },
    ].map(mapper),
  },
  {
    id: nextId('major'),
    stackable: true,
    name: '回復',
    children: [
      'HP持続回復',
      'HP低下時、周囲の味方を含めHPをゆっくりと回復',
      'ガード成功時、HP回復',
      {
        name: '刺突カウンター発生時、HP回復',
        children: ['刺突カウンター発生時、HP回復', '刺突カウンター発生時、HP回復+1', '刺突カウンター発生時、HP回復+2'],
      },
      {
        name: 'ダメージを受けた直後、攻撃によりHPの一部を回復',
        children: [
          'ダメージを受けた直後、攻撃によりHPの一部を回復',
          'ダメージを受けた直後、攻撃によりHPの一部を回復+1',
          'ダメージを受けた直後、攻撃によりHPの一部を回復+2',
        ],
      },
      {
        name: '苔薬などのアイテム使用でHP回復',
        children: [
          '苔薬などのアイテム使用でHP回復',
          '苔薬などのアイテム使用でHP回復+1',
          '苔薬などのアイテム使用でHP回復+2',
        ],
      },
      '聖杯瓶の回復量上昇',
      {
        name: '消費FP軽減',
        children: ['消費FP軽減', '消費FP軽減+1', '消費FP軽減+2'],
      },
      '攻撃連続時、FP回復',
      '発狂状態になると、FP持続回復',
      {
        name: '攻撃命中時、スタミナ回復',
        children: ['攻撃命中時、スタミナ回復', '攻撃命中時、スタミナ回復+1'],
      },
      {
        name: '致命の一撃で、スタミナ回復速度上昇',
        children: [
          '致命の一撃で、スタミナ回復速度上昇',
          '致命の一撃で、スタミナ回復速度上昇+1',
          '致命の一撃で、スタミナ回復速度上昇+2',
        ],
      },
    ].map(mapper),
  },
  {
    id: nextId('major'),
    stackable: true,
    name: 'アクション',
    children: [
      {
        name: '致命の一撃で、ルーンを取得',
        children: ['致命の一撃で、ルーンを取得', '致命の一撃で、ルーンを取得+1', '致命の一撃で、ルーンを取得+2'],
      },
      '武器の持ち替え時、いずれかの属性攻撃力を付加',
      'ガード中、敵に狙われやすくなる',
      'ジェスチャー「あぐら」により、発狂が蓄積',
      {
        name: '毒状態の敵に対する攻撃を強化',
        children: ['毒状態の敵に対する攻撃を強化', '毒状態の敵に対する攻撃を強化+1', '毒状態の敵に対する攻撃を強化+2'],
      },
      {
        name: '腐敗状態の敵に対する攻撃を強化',
        children: [
          '腐敗状態の敵に対する攻撃を強化',
          '腐敗状態の敵に対する攻撃を強化+1',
          '腐敗状態の敵に対する攻撃を強化+2',
        ],
      },
      {
        name: '凍傷状態の敵に対する攻撃を強化',
        children: [
          '凍傷状態の敵に対する攻撃を強化',
          '凍傷状態の敵に対する攻撃を強化+1',
          '凍傷状態の敵に対する攻撃を強化+2',
        ],
      },
      '周囲で毒／腐敗状態発生時、攻撃力上昇',
      '周囲で凍傷状態の発生時、自身の姿を隠す',
      {
        name: '周囲で睡眠状態の発生時、攻撃力上昇',
        children: ['周囲で睡眠状態の発生時、攻撃力上昇', '周囲で睡眠状態の発生時、攻撃力上昇+1'],
      },
      {
        name: '周囲で発狂状態の発生時、攻撃力上昇',
        children: ['周囲で発狂状態の発生時、攻撃力上昇', '周囲で発狂状態の発生時、攻撃力上昇+1'],
      },
    ].map(mapper),
  },
  {
    id: nextId('major'),
    stackable: true,
    name: '出撃時の武器（戦技）',
    children: [
      '我慢',
      'クイックステップ',
      '嵐脚',
      'デターミネーション',
      '輝剣の円陣',
      'グラビタス',
      '炎撃',
      '溶岩噴火',
      '落雷',
      '雷撃斬',
      '聖なる刃',
      '祈りの一撃',
      '毒の霧',
      '毒蛾は二度舞う',
      '血の刃',
      '切腹',
      '冷気の霧',
      '霜踏み',
      '白い影の誘い',
      'アローレイン',
    ].map((name) => mapper(`出撃時の武器の戦技を「${name}」にする`)),
  },
  {
    id: nextId('major'),
    stackable: true,
    name: '出撃時の武器（付加）',
    children: [
      '出撃時の武器に魔力攻撃力を付加',
      '出撃時の武器に炎攻撃力を付加',
      '出撃時の武器に雷攻撃力を付加',
      '出撃時の武器に聖攻撃力を付加',
      '出撃時の武器に毒の状態異常を付加',
      '出撃時の武器に出血の状態異常を付加',
      '出撃時の武器に冷気の状態異常を付加',
    ].map(mapper),
  },
  {
    id: nextId('major'),
    stackable: true,
    name: '出撃時のアイテム',
    children: [
      '出撃時に「星光の欠片」を持つ',
      '出撃時に「火炎壺」を持つ',
      '出撃時に「魔力壺」を持つ',
      '出撃時に「雷壺」を持つ',
      '出撃時に「聖水壺」を持つ',
      '出撃時に「骨の毒投げ矢」を持つ',
      '出撃時に「結晶投げ矢」を持つ',
      '出撃時に「スローイングダガー」を持つ',
      '出撃時に「屑輝石」を持つ',
      '出撃時に「塊の重力石」を持つ',
      '出撃時に「誘惑の枝」を持つ',
      '出撃時に「火花の香り」を持つ',
      '出撃時に「毒の噴霧」を持つ',
      '出撃時に「鉄壺の香薬」を持つ',
      '出撃時に「高揚の香り」を持つ',
      '出撃時に「酸の噴霧」を持つ',
      '出撃時に「狂熱の香薬」を持つ',
      '出撃時に「呪霊喚びの鈴」を持つ',
      '出撃時に「火脂」を持つ',
      '出撃時に「魔力脂」を持つ',
      '出撃時に「雷脂」を持つ',
      '出撃時に「聖脂」を持つ',
      '出撃時に「盾脂」を持つ',
      '出撃時に「小さなポーチ」を持つ',
      '出撃時に「石剣の鍵」を持つ',
    ].map(mapper),
  },
  {
    id: nextId('major'),
    stackable: true,
    name: '出撃時のアイテム(結晶の雫)',
    children: [
      '出撃時に「緋色の結晶雫」を持つ',
      '出撃時に「緋溢れの結晶雫」を持つ',
      '出撃時に「緋湧きの結晶雫」を持つ',
      '出撃時に「青色の結晶雫」を持つ',
      '出撃時に「緑湧きの結晶雫」を持つ',
      '出撃時に「真珠色の硬雫」を持つ',
      '出撃時に「斑彩色の硬雫」を持つ',
      '出撃時に「鉛色の硬雫」を持つ',
      '出撃時に「魔力纏いの割れ雫」を持つ',
      '出撃時に「炎纏いの割れ雫」を持つ',
      '出撃時に「雷纏いの割れ雫」を持つ',
      '出撃時に「聖纏いの割れ雫」を持つ',
      '出撃時に「岩棘の割れ雫」を持つ',
      '出撃時に「大棘の割れ雫」を持つ',
      '出撃時に「連棘の割れ雫」を持つ',
      '出撃時に「細枝の割れ雫」を持つ',
      '出撃時に「風の結晶雫」を持つ',
      '出撃時に「緋色の泡雫」を持つ',
      '出撃時に「緋色渦の泡雫」を持つ',
      '出撃時に「真珠色の泡雫」を持つ',
      '出撃時に「青色の秘雫」を持つ',
      '出撃時に「破裂した結晶雫」を持つ',
    ].map(mapper),
  },
  {
    id: nextId('major'),
    stackable: true,
    name: 'マップ環境',
    children: [
      '埋もれ宝の位置を地図に表示',
      '出撃中、ショップでの購入に必要なルーンが割引',
      '出撃中、ショップでの購入に必要なルーンが大割引',
    ].map(mapper),
  },
  {
    id: nextId('major'),
    stackable: true,
    name: 'チームメンバー',
    children: [
      '自身と味方の取得ルーン増加',
      '自身を除く、周囲の味方のスタミナ回復速度上昇',
      '聖杯瓶の回復を、周囲の味方に分配',
      '敵を倒した時、自身を除く周囲の味方のHPを回復',
      'アイテムの効果が周囲の味方にも発動',
    ].map(mapper),
  },
  {
    id: nextId('major'),
    name: '特定キャラクターのみ',
    unselectable: true,
    stackable: true,
    children: [
      {
        id: nextId('minor'),
        stackable: true,
        name: '追跡者',
        children: [
          '【追跡者】アビリティ発動時、アーツゲージ増加',
          '【追跡者】スキル使用時、通常攻撃で炎を纏った追撃を行う（大剣のみ）',
          '【追跡者】スキルの使用回数+1',
          '【追跡者】アーツ発動時、周囲を延焼',
          '【追跡者】精神力上昇、生命力低下',
          '【追跡者】知力/信仰上昇、筋力/技量低下',
          '【追跡者】スキルに、出血の状態異常を付加',
        ].map(mapper),
      },
      {
        id: nextId('minor'),
        stackable: true,
        name: '守護者',
        children: [
          '【守護者】アビリティ発動中、ガード成功時、衝撃波が発生',
          '【守護者】スキルの持続時間延長',
          '【守護者】アーツ発動時、周囲の味方HPを徐々に回復',
          '【守護者】斧槍タメ攻撃時、つむじ風が発生',
          '【守護者】筋力/技量上昇、生命力低下',
          '【守護者】精神力/信仰上昇、生命力低下',
          '【守護者】スキル使用時、周囲の味方のカット率上昇',
        ].map(mapper),
      },
      {
        id: nextId('minor'),
        stackable: true,
        name: '鉄の目',
        children: [
          '【鉄の目】スキルの使用回数+1',
          '【鉄の目】アーツのタメ発動時、毒の状態異常を付加',
          '【鉄の目】アーツ発動後、刺突カウンター強化',
          '【鉄の目】弱点の持続時間を延長させる',
          '【鉄の目】生命力/筋力上昇、技量低下',
          '【鉄の目】神秘上昇、技量低下',
          '【鉄の目】スキルに毒の状態異常を付加して毒状態の敵に大ダメージ',
        ].map(mapper),
      },
      {
        id: nextId('minor'),
        stackable: true,
        name: 'レディ',
        children: [
          '【レディ】スキルのダメージ上昇',
          '【レディ】アーツ発動中、敵撃破で攻撃力上昇',
          '【レディ】短剣による連続攻撃時、周囲の敵に直近の出来事を再演',
          '【レディ】背後からの致命の一撃後、自身の姿を見え難くし、足音を消す',
          '【レディ】生命力/筋力上昇、精神力低下',
          '【レディ】精神力/信仰上昇、知力低下',
          '【レディ】スキル使用時、僅かに無敵',
        ].map(mapper),
      },
      {
        id: nextId('minor'),
        stackable: true,
        name: '無頼漢',
        children: [
          '【無頼漢】スキル中に攻撃を受けると攻撃力と最大スタミナ上昇',
          '【無頼漢】アーツの効果時間延長',
          'トーテム・ステラの周囲で敵を倒した時、HP回復',
          'トーテム・ステラの周囲で、強靭度上昇',
          '【無頼漢】精神力/知力上昇、生命力/持久力低下',
          '【無頼漢】神秘上昇、生命力低下',
          '【無頼漢】スキル命中時、敵の攻撃力低下',
        ].map(mapper),
      },
      {
        id: nextId('minor'),
        stackable: true,
        name: '復讐者',
        children: [
          '【復讐者】アーツ発動時、霊炎の爆発を発生',
          '【復讐者】アーツ発動時、自身のHPと引き換えに周囲の味方のHPを全回復',
          '【復讐者】アーツ発動時、ファミリーと味方を強化',
          '【復讐者】ファミリーと共闘中の間、自身を強化',
          '【復讐者】生命力/持久力上昇、精神力低下',
          '【復讐者】筋力上昇、信仰低下',
          '【復讐者】アビリティ発動時、最大FP上昇',
        ].map(mapper),
      },
      {
        id: nextId('minor'),
        stackable: true,
        name: '隠者',
        children: [
          '【隠者】アーツ発動時、自身が出血状態になり、攻撃力上昇',
          '【隠者】アーツ発動時、最大HP上昇',
          '【隠者】属性痕を集めた時、「魔術の地」が発動',
          '【隠者】生命力/持久力/技量上昇、知力/信仰低下',
          '【隠者】知力/信仰上昇、精神力低下',
          '【隠者】属性痕を集めた時、対応する属性カット率上昇',
        ].map(mapper),
      },
      {
        id: nextId('minor'),
        stackable: true,
        name: '執行者',
        children: [
          '【執行者】スキル中の攻撃力上昇、攻撃時にHP減少',
          '【執行者】スキル中、妖刀が解放状態になるとHP回復',
          '【執行者】アーツ発動中、咆哮でHP回復',
          '【執行者】生命力/持久力上昇、神秘低下',
          '【執行者】技量/神秘上昇、生命力低下',
          '【執行者】アビリティ発動時、HPをゆっくりと回復',
        ].map(mapper),
      },
    ],
  },
  {
    id: nextId('major'),
    unselectable: true,
    stackable: true,
    name: '特定武器のみ',
    children: [
      {
        id: nextId('minor'),
        stackable: true,
        name: '短剣',
        children: [
          '短剣の攻撃力上昇',
          '短剣の攻撃でHP回復',
          '短剣の攻撃でFP回復',
          '短剣の武器種を3つ以上装備していると攻撃力上昇',
          '潜在する力から、「短剣」を見つけやすくなる',
        ].map(mapper),
      },
      {
        id: nextId('minor'),
        stackable: true,
        name: '直剣',
        children: [
          '直剣の攻撃力上昇',
          '直剣の攻撃でHP回復',
          '直剣の攻撃でFP回復',
          '直剣の武器種を3つ以上装備していると攻撃力上昇',
          '潜在する力から、「直剣」を見つけやすくなる',
        ].map(mapper),
      },
      {
        id: nextId('minor'),
        stackable: true,
        name: '大剣',
        children: [
          '大剣の攻撃力上昇',
          '大剣の攻撃でHP回復',
          '大剣の攻撃でFP回復',
          '大剣の武器種を3つ以上装備していると攻撃力上昇',
          '潜在する力から、「大剣」を見つけやすくなる',
        ].map(mapper),
      },
      {
        id: nextId('minor'),
        stackable: true,
        name: '特大剣',
        children: [
          '特大剣の攻撃力上昇',
          '特大剣の攻撃でHP回復',
          '特大剣の攻撃でFP回復',
          '特大剣の武器種を3つ以上装備していると攻撃力上昇',
          '潜在する力から、「特大剣」を見つけやすくなる',
        ].map(mapper),
      },
      {
        id: nextId('minor'),
        stackable: true,
        name: '刺剣',
        children: [
          '刺剣の攻撃力上昇',
          '刺剣の攻撃でHP回復',
          '刺剣の攻撃でFP回復',
          '刺剣の武器種を3つ以上装備していると攻撃力上昇',
          '潜在する力から、「刺剣」を見つけやすくなる',
        ].map(mapper),
      },
      {
        id: nextId('minor'),
        stackable: true,
        name: '重刺剣',
        children: [
          '重刺剣の攻撃力上昇',
          '重刺剣の攻撃でHP回復',
          '重刺剣の攻撃でFP回復',
          '重刺剣の武器種を3つ以上装備していると攻撃力上昇',
          '潜在する力から、「重刺剣」を見つけやすくなる',
        ].map(mapper),
      },
      {
        id: nextId('minor'),
        stackable: true,
        name: '曲剣',
        children: [
          '曲剣の攻撃力上昇',
          '曲剣の攻撃でHP回復',
          '曲剣の攻撃でFP回復',
          '曲剣の武器種を3つ以上装備していると攻撃力上昇',
          '潜在する力から、「曲剣」を見つけやすくなる',
        ].map(mapper),
      },
      {
        id: nextId('minor'),
        stackable: true,
        name: '大曲剣',
        children: [
          '大曲剣の攻撃力上昇',
          '大曲剣の攻撃でHP回復',
          '大曲剣の攻撃でFP回復',
          '大曲剣の武器種を3つ以上装備していると攻撃力上昇',
          '潜在する力から、「大曲剣」を見つけやすくなる',
        ].map(mapper),
      },
      {
        id: nextId('minor'),
        stackable: true,
        name: '刀',
        children: [
          '刀の攻撃力上昇',
          '刀の攻撃でHP回復',
          '刀の攻撃でFP回復',
          '刀の武器種を3つ以上装備していると攻撃力上昇',
          '潜在する力から、「刀」を見つけやすくなる',
        ].map(mapper),
      },
      {
        id: nextId('minor'),
        stackable: true,
        name: '両刃剣',
        children: [
          '両刃剣の攻撃力上昇',
          '両刃剣の攻撃でHP回復',
          '両刃剣の攻撃でFP回復',
          '両刃剣の武器種を3つ以上装備していると攻撃力上昇',
          '潜在する力から、「両刃剣」を見つけやすくなる',
        ].map(mapper),
      },
      {
        id: nextId('minor'),
        stackable: true,
        name: '斧',
        children: [
          '斧の攻撃力上昇',
          '斧の攻撃でHP回復',
          '斧の攻撃でFP回復',
          '斧の武器種を3つ以上装備していると攻撃力上昇',
          '潜在する力から、「斧」を見つけやすくなる',
        ].map(mapper),
      },
      {
        id: nextId('minor'),
        stackable: true,
        name: '大斧',
        children: [
          '大斧の攻撃力上昇',
          '大斧の攻撃でHP回復',
          '大斧の攻撃でFP回復',
          '大斧の武器種を3つ以上装備していると攻撃力上昇',
          '潜在する力から、「大斧」を見つけやすくなる',
        ].map(mapper),
      },
      {
        id: nextId('minor'),
        stackable: true,
        name: '槌',
        children: [
          '槌の攻撃力上昇',
          '槌の攻撃でHP回復',
          '槌の攻撃でFP回復',
          '槌の武器種を3つ以上装備していると攻撃力上昇',
          '潜在する力から、「槌」を見つけやすくなる',
        ].map(mapper),
      },
      {
        id: nextId('minor'),
        stackable: true,
        name: 'フレイル',
        children: [
          'フレイルの攻撃力上昇',
          'フレイルの攻撃でHP回復',
          'フレイルの攻撃でFP回復',
          'フレイルの武器種を3つ以上装備していると攻撃力上昇',
          '潜在する力から、「フレイル」を見つけやすくなる',
        ].map(mapper),
      },
      {
        id: nextId('minor'),
        stackable: true,
        name: '大槌',
        children: [
          '大槌の攻撃力上昇',
          '大槌の攻撃でHP回復',
          '大槌の攻撃でFP回復',
          '大槌の武器種を3つ以上装備していると攻撃力上昇',
          '潜在する力から、「大槌」を見つけやすくなる',
        ].map(mapper),
      },
      {
        id: nextId('minor'),
        stackable: true,
        name: '特大武器',
        children: [
          '特大武器の攻撃力上昇',
          '特大武器の攻撃でHP回復',
          '特大武器の攻撃でFP回復',
          '特大武器の武器種を3つ以上装備していると攻撃力上昇',
          '潜在する力から、「特大武器」を見つけやすくなる',
        ].map(mapper),
      },
      {
        id: nextId('minor'),
        stackable: true,
        name: '槍',
        children: [
          '槍の攻撃力上昇',
          '槍の攻撃でHP回復',
          '槍の攻撃でFP回復',
          '槍の武器種を3つ以上装備していると攻撃力上昇',
          '潜在する力から、「槍」を見つけやすくなる',
        ].map(mapper),
      },
      {
        id: nextId('minor'),
        stackable: true,
        name: '大槍',
        children: [
          '大槍の攻撃力上昇',
          '大槍の攻撃でHP回復',
          '大槍の攻撃でFP回復',
          '大槍の武器種を3つ以上装備していると攻撃力上昇',
          '潜在する力から、「大槍」を見つけやすくなる',
        ].map(mapper),
      },
      {
        id: nextId('minor'),
        stackable: true,
        name: '鎌',
        children: [
          '鎌の攻撃力上昇',
          '鎌の攻撃でHP回復',
          '鎌の攻撃でFP回復',
          '鎌の武器種を3つ以上装備していると攻撃力上昇',
          '潜在する力から、「鎌」を見つけやすくなる',
        ].map(mapper),
      },
      {
        id: nextId('minor'),
        stackable: true,
        name: '鞭',
        children: [
          '鞭の攻撃力上昇',
          '鞭の攻撃でHP回復',
          '鞭の攻撃でFP回復',
          '鞭の武器種を3つ以上装備していると攻撃力上昇',
          '潜在する力から、「鞭」を見つけやすくなる',
        ].map(mapper),
      },
      {
        id: nextId('minor'),
        stackable: true,
        name: '拳',
        children: [
          '拳の攻撃力上昇',
          '拳の攻撃でHP回復',
          '拳の攻撃でFP回復',
          '拳の武器種を3つ以上装備していると攻撃力上昇',
          '潜在する力から、「拳」を見つけやすくなる',
        ].map(mapper),
      },
      {
        id: nextId('minor'),
        stackable: true,
        name: '爪',
        children: [
          '爪の攻撃力上昇',
          '爪の攻撃でHP回復',
          '爪の攻撃でFP回復',
          '爪の武器種を3つ以上装備していると攻撃力上昇',
          '潜在する力から、「爪」を見つけやすくなる',
        ].map(mapper),
      },
      {
        id: nextId('minor'),
        stackable: true,
        name: '弓',
        children: [
          '弓の攻撃力上昇',
          '弓の攻撃でHP回復',
          '弓の攻撃でFP回復',
          '弓の武器種を3つ以上装備していると攻撃力上昇',
          '潜在する力から、「弓」を見つけやすくなる',
        ].map(mapper),
      },
      {
        id: nextId('minor'),
        stackable: true,
        name: '大弓',
        children: ['潜在する力から、「大弓」を見つけやすくなる'].map(mapper),
      },
      {
        id: nextId('minor'),
        stackable: true,
        name: 'クロスボウ',
        children: ['潜在する力から、「クロスボウ」を見つけやすくなる'].map(mapper),
      },
      {
        id: nextId('minor'),
        stackable: true,
        name: 'バリスタ',
        children: ['潜在する力から、「バリスタ」を見つけやすくなる'].map(mapper),
      },
      {
        id: nextId('minor'),
        stackable: true,
        name: '松明',
        children: ['潜在する力から、「松明」を見つけやすくなる'].map(mapper),
      },
      {
        id: nextId('minor'),
        stackable: true,
        name: '小盾',
        children: ['小盾の武器種を3つ以上装備していると最大HP上昇', '潜在する力から、「小盾」を見つけやすくなる'].map(
          mapper,
        ),
      },
      {
        id: nextId('minor'),
        stackable: true,
        name: '中盾',
        children: ['中盾の武器種を3つ以上装備していると最大HP上昇', '潜在する力から、「中盾」を見つけやすくなる'].map(
          mapper,
        ),
      },
      {
        id: nextId('minor'),
        stackable: true,
        name: '大盾',
        children: ['大盾の武器種を3つ以上装備していると最大HP上昇', '潜在する力から、「大盾」を見つけやすくなる'].map(
          mapper,
        ),
      },
      {
        id: nextId('minor'),
        stackable: true,
        name: '杖',
        children: ['杖の武器種を3つ以上装備していると最大FP上昇', '潜在する力から、「杖」を見つけやすくなる'].map(
          mapper,
        ),
      },
      {
        id: nextId('minor'),
        stackable: true,
        name: '聖印',
        children: ['聖印の武器種を3つ以上装備していると最大FP上昇', '潜在する力から、「聖印」を見つけやすくなる'].map(
          mapper,
        ),
      },
    ],
  },
]

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
  2010: '爵の夜',
  2011: '爵の暗き夜',
  2020: '識の夜',
  2021: '識の暗き夜',
  2030: '深海の夜',
  2031: '深海の暗き夜',
  2040: '魔の夜',
  2050: '狩人の夜',
  2051: '狩人の暗き夜',
  2060: '霞の夜',
  2061: '霞の暗き夜',
  2100: '王の夜',
}
