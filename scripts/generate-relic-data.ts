#!/usr/bin/env tsx

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { omit } from 'es-toolkit'
import { relicEffectMap } from '../app/data/relicEffects.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

type RelicEffect = {
  id: string
  name: string
  stacksWithSelf: boolean
  stacksAcrossLevels?: boolean
  hasDemeritEffect?: boolean
}

type OptionItem = {
  id: string
  name: string
  maxStacks: number
  children?: OptionItem[]
}

type NestedItems = {
  category: string
  children: {
    category: string
    children: OptionItem[]
  }[]
}[]

const allItems: RelicEffect[] = Object.entries(relicEffectMap).map(([id, data]) => ({ id, ...data }))

/**
 * 遺物効果名からオプションを生成する
 *
 * @param name - 遺物効果名
 */
function createOptionFromName(name: string): OptionItem {
  const exactMatch = allItems.find((item) => item.name === name)
  const relatedItems = findRelatedItems(name)

  // 完全一致する遺物効果が存在しない場合、接頭辞にマッチする遺物効果を子項目として持つ
  if (!exactMatch) {
    return {
      id: relatedItems.map((item) => item.id).join(','),
      name,
      maxStacks: countMaxStacks(relatedItems),
      children: relatedItems.map((item) => createOptionFromName(item.name)),
    }
  }

  const optionItem = omit(exactMatch, ['stacksWithSelf', 'stacksAcrossLevels'])

  // 関連する遺物効果が1つしかない場合、子項目を持たない
  if (relatedItems.length <= 1) {
    return { ...optionItem, maxStacks: countMaxStacks(exactMatch) }
  }

  // 関連する遺物効果が複数ある場合、子項目を持つ
  return {
    ...optionItem,
    id: relatedItems.map((item) => item.id).join(','),
    maxStacks: countMaxStacks(relatedItems),
    children: relatedItems.map((item) =>
      item.name === name
        ? { id: exactMatch.id, name: item.name, maxStacks: countMaxStacks(item) }
        : createOptionFromName(item.name),
    ),
  }
}

function countMaxStacks(itemOrItems: RelicEffect | RelicEffect[]): number {
  if (Array.isArray(itemOrItems)) {
    const items = itemOrItems
    if (items.some((item) => item.stacksWithSelf)) return 6

    return items.length
  }

  const item = itemOrItems
  return item.stacksWithSelf ? 6 : 1
}

/**
 * 遺物効果名の接頭辞から関連する遺物効果を検索する
 *
 * @param namePrefix - 遺物効果名
 */
function findRelatedItems(namePrefix: string): RelicEffect[] {
  return allItems.filter((item) => item.name.startsWith(namePrefix)).toSorted((a, b) => a.name.localeCompare(b.name))
}

/**
 * 遺物効果のオプションを生成する
 *
 * @param names - 遺物効果名の配列
 */
function options(...names: string[]): OptionItem[] {
  return names.map(createOptionFromName)
}

/**
 * 武器種のオプションを生成する
 *
 * @param name - 武器種名
 */
function weaponOptions(name: string): OptionItem[] {
  return options(
    `${name}の攻撃力上昇`,
    `${name}の攻撃でHP回復`,
    `${name}の攻撃でFP回復`,
    `${name}の武器種を3つ以上装備していると攻撃力上昇`,
    `潜在する力から、「${name}」を見つけやすくなる`,
  )
}

/**
 * relicCategoriesを生成する
 */
function generateRelicCategories(): NestedItems {
  return [
    {
      category: '全般',
      children: [
        {
          category: '能力値',
          children: options(
            '最大HP上昇',
            '最大FP上昇',
            '最大スタミナ上昇',
            '生命力',
            '精神力',
            '持久力',
            '筋力',
            '技量',
            '知力',
            '信仰',
            '神秘',
            '強靭度',
            '魔術師塔の仕掛けが解除される度、最大FP上昇',
            '小砦の強敵を倒す度、取得ルーン増加、発見力上昇',
            '大教会の強敵を倒す度、最大HP上昇',
            '大野営地の強敵を倒す度、最大スタミナ上昇',
            '遺跡の強敵を倒す度、神秘上昇',
          ),
        },
        {
          category: '攻撃力',
          children: options(
            '物理攻撃力上昇',
            '属性攻撃力上昇',
            '魔力攻撃力上昇',
            '炎攻撃力上昇',
            '雷攻撃力上昇',
            '聖攻撃力上昇',
            '通常攻撃の1段目強化',
            '致命の一撃強化',
            '魔術強化',
            '祈祷強化',
            '咆哮とブレス強化',
            '両手持ちの、体勢を崩す力上昇',
            '二刀持ちの、体勢を崩す力上昇',
            '武器の持ち替え時、物理攻撃力上昇',
            '属性攻撃力が付加された時、属性攻撃力上昇',
            '攻撃を受けると攻撃力上昇',
            '封牢の囚を倒す度、攻撃力上昇',
            '夜の侵入者を倒す度、攻撃力上昇',
            'ガードカウンター強化',
            'ガードカウンターに、自身の現在HPの一部を加える',
            '脂アイテム使用時、追加で物理攻撃力上昇',
            '投擲壺の攻撃力上昇',
            '投擲ナイフの攻撃力上昇',
            '輝石、重力石アイテムの攻撃力上昇',
            '調香術強化',
          ),
        },
        {
          category: 'スキル／アーツ',
          children: options(
            'スキルクールタイム軽減',
            'アーツゲージ蓄積増加',
            '敵を倒した時のアーツゲージ蓄積増加',
            '致命の一撃で、アーツゲージ蓄積増加',
            'ガード成功時、アーツゲージを蓄積',
          ),
        },
        {
          category: '魔術／祈祷',
          children: options(
            '輝剣の魔術を強化',
            '石堀りの魔術を強化',
            'カーリアの剣の魔術を強化',
            '不可視の魔術を強化',
            '結晶人の魔術を強化',
            '重力の魔術を強化',
            '茨の魔術を強化',
            '黄金律原理主義の祈祷を強化',
            '王都古竜信仰の祈祷を強化',
            '巨人の火の祈祷を強化',
            '神狩りの祈祷を強化',
            '獣の祈祷を強化',
            '狂い火の祈祷を強化',
            '竜餐の祈祷を強化',
          ),
        },
        {
          category: 'カット率',
          children: options(
            '物理カット率上昇',
            '属性カット率上昇',
            '魔力カット率上昇',
            '炎カット率上昇',
            '雷カット率上昇',
            '聖カット率上昇',
            'HP低下時、カット率上昇',
            'ダメージで吹き飛ばされた時、強靭度とカット率上昇',
          ),
        },
        {
          category: '状態異常耐性',
          children: options(
            '毒耐性上昇',
            '腐敗耐性上昇',
            '出血耐性上昇',
            '冷気耐性上昇',
            '睡眠耐性上昇',
            '発狂耐性上昇',
            '抗死耐性上昇',
          ),
        },
        {
          category: '回復',
          children: options(
            'HP持続回復',
            'HP低下時、周囲の味方を含めHPをゆっくりと回復',
            'ガード成功時、HP回復',
            '刺突カウンター発生時、HP回復',
            'ダメージを受けた直後、攻撃によりHPの一部を回復',
            '苔薬などのアイテム使用でHP回復',
            '聖杯瓶の回復量上昇',
            '消費FP軽減',
            '攻撃連続時、FP回復',
            '発狂状態になると、FP持続回復',
            '攻撃命中時、スタミナ回復',
            '致命の一撃で、スタミナ回復速度上昇',
          ),
        },
        {
          category: 'アクション',
          children: options(
            '致命の一撃で、ルーンを取得',
            '武器の持ち替え時、いずれかの属性攻撃力を付加',
            'ガード中、敵に狙われやすくなる',
            'ジェスチャー「あぐら」により、発狂が蓄積',
            '毒状態の敵に対する攻撃を強化',
            '腐敗状態の敵に対する攻撃を強化',
            '凍傷状態の敵に対する攻撃を強化',
            '周囲で毒／腐敗状態発生時、攻撃力上昇',
            '周囲で凍傷状態の発生時、自身の姿を隠す',
            '周囲で睡眠状態の発生時、攻撃力上昇',
            '周囲で発狂状態の発生時、攻撃力上昇',
          ),
        },
        {
          category: '出撃時の武器（戦技）',
          children: options(
            '出撃時の武器の戦技を「我慢」にする',
            '出撃時の武器の戦技を「クイックステップ」にする',
            '出撃時の武器の戦技を「嵐脚」にする',
            '出撃時の武器の戦技を「デターミネーション」にする',
            '出撃時の武器の戦技を「輝剣の円陣」にする',
            '出撃時の武器の戦技を「グラビタス」にする',
            '出撃時の武器の戦技を「炎撃」にする',
            '出撃時の武器の戦技を「溶岩噴火」にする',
            '出撃時の武器の戦技を「落雷」にする',
            '出撃時の武器の戦技を「雷撃斬」にする',
            '出撃時の武器の戦技を「聖なる刃」にする',
            '出撃時の武器の戦技を「祈りの一撃」にする',
            '出撃時の武器の戦技を「毒の霧」にする',
            '出撃時の武器の戦技を「毒蛾は二度舞う」にする',
            '出撃時の武器の戦技を「血の刃」にする',
            '出撃時の武器の戦技を「切腹」にする',
            '出撃時の武器の戦技を「冷気の霧」にする',
            '出撃時の武器の戦技を「霜踏み」にする',
            '出撃時の武器の戦技を「白い影の誘い」にする',
            '出撃時の武器の戦技を「アローレイン」にする',
          ),
        },
        {
          category: '出撃時の武器（付加）',
          children: options(
            '出撃時の武器に魔力攻撃力を付加',
            '出撃時の武器に炎攻撃力を付加',
            '出撃時の武器に雷攻撃力を付加',
            '出撃時の武器に聖攻撃力を付加',
            '出撃時の武器に毒の状態異常を付加',
            '出撃時の武器に出血の状態異常を付加',
            '出撃時の武器に冷気の状態異常を付加',
          ),
        },
        {
          category: '出撃時のアイテム',
          children: options(
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
          ),
        },
        {
          category: '出撃時のアイテム(結晶の雫)',
          children: options(
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
          ),
        },
        {
          category: 'マップ環境',
          children: options(
            '埋もれ宝の位置を地図に表示',
            '出撃中、ショップでの購入に必要なルーンが割引',
            '出撃中、ショップでの購入に必要なルーンが大割引',
          ),
        },
        {
          category: 'チームメンバー',
          children: options(
            '自身と味方の取得ルーン増加',
            '自身を除く、周囲の味方のスタミナ回復速度上昇',
            '聖杯瓶の回復を、周囲の味方に分配',
            '敵を倒した時、自身を除く周囲の味方のHPを回復',
            'アイテムの効果が周囲の味方にも発動',
          ),
        },
      ],
    },
    {
      category: '特定キャラクターのみ',
      children: [
        {
          category: '追跡者',
          children: options(
            '【追跡者】アビリティ発動時、アーツゲージ増加',
            '【追跡者】スキル使用時、通常攻撃で炎を纏った追撃を行う（大剣のみ）',
            '【追跡者】スキルの使用回数+1',
            '【追跡者】アーツ発動時、周囲を延焼',
            '【追跡者】精神力上昇、生命力低下',
            '【追跡者】知力/信仰上昇、筋力/技量低下',
            '【追跡者】スキルに、出血の状態異常を付加',
          ),
        },
        {
          category: '守護者',
          children: options(
            '【守護者】アビリティ発動中、ガード成功時、衝撃波が発生',
            '【守護者】スキルの持続時間延長',
            '【守護者】アーツ発動時、周囲の味方のHPを徐々に回復',
            '【守護者】斧槍タメ攻撃時、つむじ風が発生',
            '【守護者】筋力/技量上昇、生命力低下',
            '【守護者】精神力/信仰上昇、生命力低下',
            '【守護者】スキル使用時、周囲の味方のカット率上昇',
          ),
        },
        {
          category: '鉄の目',
          children: options(
            '【鉄の目】スキルの使用回数+1',
            '【鉄の目】アーツのタメ発動時、毒の状態異常を付加',
            '【鉄の目】アーツ発動後、刺突カウンター強化',
            '【鉄の目】弱点の持続時間を延長させる',
            '【鉄の目】生命力/筋力上昇、技量低下',
            '【鉄の目】神秘上昇、技量低下',
            '【鉄の目】スキルに毒の状態異常を付加して毒状態の敵に大ダメージ',
          ),
        },
        {
          category: 'レディ',
          children: options(
            '【レディ】スキルのダメージ上昇',
            '【レディ】アーツ発動中、敵撃破で攻撃力上昇',
            '【レディ】短剣による連続攻撃時、周囲の敵に直近の出来事を再演',
            '【レディ】背後からの致命の一撃後、自身の姿を見え難くし、足音を消す',
            '【レディ】生命力/筋力上昇、精神力低下',
            '【レディ】精神力/信仰上昇、知力低下',
            '【レディ】スキル使用時、僅かに無敵',
          ),
        },
        {
          category: '無頼漢',
          children: options(
            '【無頼漢】スキル中に攻撃を受けると攻撃力と最大スタミナ上昇',
            '【無頼漢】アーツの効果時間延長',
            'トーテム・ステラの周囲で敵を倒した時、HP回復',
            'トーテム・ステラの周囲で、強靭度上昇',
            '【無頼漢】精神力/知力上昇、生命力/持久力低下',
            '【無頼漢】神秘上昇、生命力低下',
            '【無頼漢】スキル命中時、敵の攻撃力低下',
          ),
        },
        {
          category: '復讐者',
          children: options(
            '【復讐者】アーツ発動時、霊炎の爆発を発生',
            '【復讐者】アーツ発動時、自身のHPと引き換えに周囲の味方のHPを全回復',
            '【復讐者】アーツ発動時、ファミリーと味方を強化',
            '【復讐者】ファミリーと共闘中の間、自身を強化',
            '【復讐者】生命力/持久力上昇、精神力低下',
            '【復讐者】筋力上昇、信仰低下',
            '【復讐者】アビリティ発動時、最大FP上昇',
          ),
        },
        {
          category: '隠者',
          children: options(
            '【隠者】アーツ発動時、自身が出血状態になり、攻撃力上昇',
            '【隠者】アーツ発動時、最大HP上昇',
            '【隠者】属性痕を集めた時、「魔術の地」が発動',
            '【隠者】生命力/持久力/技量上昇、知力/信仰低下',
            '【隠者】知力/信仰上昇、精神力低下',
            '【隠者】属性痕を集めた時、対応する属性カット率上昇',
          ),
        },
        {
          category: '執行者',
          children: options(
            '【執行者】スキル中の攻撃力上昇、攻撃時にHP減少',
            '【執行者】スキル中、妖刀が解放状態になるとHP回復',
            '【執行者】アーツ発動中、咆哮でHP回復',
            '【執行者】生命力/持久力上昇、神秘低下',
            '【執行者】技量/神秘上昇、生命力低下',
            '【執行者】アビリティ発動時、HPをゆっくりと回復',
          ),
        },
      ],
    },
    {
      category: '特定武器のみ',
      children: [
        {
          category: '短剣',
          children: weaponOptions('短剣'),
        },
        {
          category: '直剣',
          children: weaponOptions('直剣'),
        },
        {
          category: '大剣',
          children: weaponOptions('大剣'),
        },
        {
          category: '特大剣',
          children: weaponOptions('特大剣'),
        },
        {
          category: '刺剣',
          children: weaponOptions('刺剣'),
        },
        {
          category: '重刺剣',
          children: weaponOptions('重刺剣'),
        },
        {
          category: '曲剣',
          children: weaponOptions('曲剣'),
        },
        {
          category: '大曲剣',
          children: weaponOptions('大曲剣'),
        },
        {
          category: '刀',
          children: weaponOptions('刀'),
        },
        {
          category: '両刃剣',
          children: weaponOptions('両刃剣'),
        },
        {
          category: '斧',
          children: weaponOptions('斧'),
        },
        {
          category: '大斧',
          children: weaponOptions('大斧'),
        },
        {
          category: '槌',
          children: weaponOptions('槌'),
        },
        {
          category: 'フレイル',
          children: weaponOptions('フレイル'),
        },
        {
          category: '大槌',
          children: weaponOptions('大槌'),
        },
        {
          category: '特大武器',
          children: weaponOptions('特大武器'),
        },
        {
          category: '槍',
          children: weaponOptions('槍'),
        },
        {
          category: '大槍',
          children: weaponOptions('大槍'),
        },
        {
          category: '鎌',
          children: weaponOptions('鎌'),
        },
        {
          category: '鞭',
          children: weaponOptions('鞭'),
        },
        {
          category: '拳',
          children: weaponOptions('拳'),
        },
        {
          category: '爪',
          children: weaponOptions('爪'),
        },
        {
          category: '弓',
          children: weaponOptions('弓'),
        },
        {
          category: '大弓',
          children: options('潜在する力から、「大弓」を見つけやすくなる'),
        },
        {
          category: 'クロスボウ',
          children: options('潜在する力から、「クロスボウ」を見つけやすくなる'),
        },
        {
          category: 'バリスタ',
          children: options('潜在する力から、「バリスタ」を見つけやすくなる'),
        },
        {
          category: '松明',
          children: options('潜在する力から、「松明」を見つけやすくなる'),
        },
        {
          category: '小盾',
          children: options(
            '小盾の武器種を3つ以上装備していると最大HP上昇',
            '潜在する力から、「小盾」を見つけやすくなる',
          ),
        },
        {
          category: '中盾',
          children: options(
            '中盾の武器種を3つ以上装備していると最大HP上昇',
            '潜在する力から、「中盾」を見つけやすくなる',
          ),
        },
        {
          category: '大盾',
          children: options(
            '大盾の武器種を3つ以上装備していると最大HP上昇',
            '潜在する力から、「大盾」を見つけやすくなる',
          ),
        },
        {
          category: '杖',
          children: options('杖の武器種を3つ以上装備していると最大FP上昇', '潜在する力から、「杖」を見つけやすくなる'),
        },
        {
          category: '聖印',
          children: options(
            '聖印の武器種を3つ以上装備していると最大FP上昇',
            '潜在する力から、「聖印」を見つけやすくなる',
          ),
        },
      ],
    },
  ]
}

/**
 * relicEffectGroupsを生成する
 */
function generateRelicEffectGroups(): number[][] {
  const relicCategories = generateRelicCategories()

  return relicCategories
    .flatMap((item) => item.children.flatMap((item) => item.children))
    .reduce<number[][]>((groups, item) => {
      if (item.children == null || !item.id.includes(',')) return groups

      return groups.concat([item.children.map((item) => Number(item.id))])
    }, [])
}

/**
 * TypeScript型定義を生成する
 */
function generateTypeDefinitions(): string {
  return `export type RelicCategoryItem = {
  id: string
  name: string
  maxStacks: number
  hasDemeritEffect?: boolean
  children?: RelicCategoryItem[]
}

export type NestedItems = {
  category: string
  children: {
    category: string
    children: RelicCategoryItem[]
  }[]
}[]`
}

/**
 * relicCategories.tsファイルを生成する
 */
function generateRelicCategoriesFile(): string {
  const relicCategories = generateRelicCategories()
  const typeDefinitions = generateTypeDefinitions()

  return `// このファイルは自動生成されています。
// 変更する場合は scripts/generate-relic-data.ts を編集してください。

${typeDefinitions}

export const relicCategories: NestedItems = ${JSON.stringify(relicCategories, null, 2)}`
}

/**
 * relicEffectGroups.tsファイルを生成する
 */
function generateRelicEffectGroupsFile(): string {
  const groups = generateRelicEffectGroups()

  return `// このファイルは自動生成されています。
// 変更する場合は scripts/generate-relic-data.ts を編集してください。

/**
 * 遺物効果のグループ定義
 *
 * 同じ基底効果名を持つ異なるレベルの効果をグループ化する。
 * 個別選択と中カテゴリ選択で同じ結果になるように統合処理で使用される。
 */
export const relicEffectGroups: number[][] = ${JSON.stringify(groups, null, 2)}`
}

/**
 * メイン処理
 */
async function main() {
  const outputDir = path.join(__dirname, '../app/data/generated')

  // 出力ディレクトリを作成
  await fs.mkdir(outputDir, { recursive: true })

  // relicCategories.tsを生成
  const relicCategoriesContent = generateRelicCategoriesFile()
  const relicCategoriesPath = path.join(outputDir, 'relicCategories.ts')

  await fs.writeFile(relicCategoriesPath, relicCategoriesContent, 'utf-8')

  // relicEffectGroups.tsを生成
  const stacksGroupsContent = generateRelicEffectGroupsFile()
  const stacksGroupsPath = path.join(outputDir, 'relicEffectGroups.ts')

  await fs.writeFile(stacksGroupsPath, stacksGroupsContent, 'utf-8')

  console.log('✅ Generated files:')
  console.log(`   - ${relicCategoriesPath}`)
  console.log(`   - ${stacksGroupsPath}`)
}

main()
