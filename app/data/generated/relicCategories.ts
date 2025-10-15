// このファイルは自動生成されています。
// 変更する場合は scripts/generate-relic-data.ts を編集してください。

export type RelicCategoryItem = {
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
}[]

export const relicCategories: NestedItems = [
  {
    category: '全般',
    children: [
      {
        category: '能力値',
        children: [
          {
            id: '6610400,7000090',
            name: '最大HP上昇',
            maxStacks: 6,
            children: [
              {
                id: '6610400',
                name: '最大HP上昇(+10%)',
                hasDemeritEffect: true,
                maxStacks: 6,
              },
              {
                id: '7000090',
                name: '最大HP上昇(+100)',
                hasDemeritEffect: false,
                maxStacks: 1,
              },
            ],
          },
          {
            id: '6610500,7000190',
            name: '最大FP上昇',
            maxStacks: 6,
            children: [
              {
                id: '6610500',
                name: '最大FP上昇(+15%)',
                hasDemeritEffect: true,
                maxStacks: 6,
              },
              {
                id: '7000190',
                name: '最大FP上昇(+25)',
                hasDemeritEffect: false,
                maxStacks: 1,
              },
            ],
          },
          {
            id: '7000290,6610600',
            name: '最大スタミナ上昇',
            maxStacks: 6,
            children: [
              {
                id: '7000290',
                name: '最大スタミナ上昇(+10)',
                hasDemeritEffect: false,
                maxStacks: 1,
              },
              {
                id: '6610600',
                name: '最大スタミナ上昇(1.12倍)',
                hasDemeritEffect: true,
                maxStacks: 6,
              },
            ],
          },
          {
            id: '7000000,7000001,7000002',
            name: '生命力',
            maxStacks: 6,
            children: [
              {
                id: '7000000',
                name: '生命力+1',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
              {
                id: '7000001',
                name: '生命力+2',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
              {
                id: '7000002',
                name: '生命力+3',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
            ],
          },
          {
            id: '7000100,7000101,7000102',
            name: '精神力',
            maxStacks: 6,
            children: [
              {
                id: '7000100',
                name: '精神力+1',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
              {
                id: '7000101',
                name: '精神力+2',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
              {
                id: '7000102',
                name: '精神力+3',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
            ],
          },
          {
            id: '7000200,7000201,7000202',
            name: '持久力',
            maxStacks: 6,
            children: [
              {
                id: '7000200',
                name: '持久力+1',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
              {
                id: '7000201',
                name: '持久力+2',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
              {
                id: '7000202',
                name: '持久力+3',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
            ],
          },
          {
            id: '7000300,7000301,7000302',
            name: '筋力',
            maxStacks: 6,
            children: [
              {
                id: '7000300',
                name: '筋力+1',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
              {
                id: '7000301',
                name: '筋力+2',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
              {
                id: '7000302',
                name: '筋力+3',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
            ],
          },
          {
            id: '7000400,7000401,7000402',
            name: '技量',
            maxStacks: 6,
            children: [
              {
                id: '7000400',
                name: '技量+1',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
              {
                id: '7000401',
                name: '技量+2',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
              {
                id: '7000402',
                name: '技量+3',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
            ],
          },
          {
            id: '7000500,7000501,7000502',
            name: '知力',
            maxStacks: 6,
            children: [
              {
                id: '7000500',
                name: '知力+1',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
              {
                id: '7000501',
                name: '知力+2',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
              {
                id: '7000502',
                name: '知力+3',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
            ],
          },
          {
            id: '7000600,7000601,7000602',
            name: '信仰',
            maxStacks: 6,
            children: [
              {
                id: '7000600',
                name: '信仰+1',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
              {
                id: '7000601',
                name: '信仰+2',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
              {
                id: '7000602',
                name: '信仰+3',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
            ],
          },
          {
            id: '7000700,7000701,7000702',
            name: '神秘',
            maxStacks: 6,
            children: [
              {
                id: '7000700',
                name: '神秘+1',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
              {
                id: '7000701',
                name: '神秘+2',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
              {
                id: '7000702',
                name: '神秘+3',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
            ],
          },
          {
            id: '7001000,7001001,7001002',
            name: '強靭度',
            maxStacks: 6,
            children: [
              {
                id: '7001000',
                name: '強靭度+1',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
              {
                id: '7001001',
                name: '強靭度+2',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
              {
                id: '7001002',
                name: '強靭度+3',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
            ],
          },
          {
            id: '7060100',
            name: '魔術師塔の仕掛けが解除される度、最大FP上昇',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6060400',
            name: '小砦の強敵を倒す度、取得ルーン増加、発見力上昇',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6060300',
            name: '大教会の強敵を倒す度、最大HP上昇',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6060600',
            name: '大野営地の強敵を倒す度、最大スタミナ上昇',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6060500',
            name: '遺跡の強敵を倒す度、神秘上昇',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
        ],
      },
      {
        category: '攻撃力',
        children: [
          {
            id: '7001400,7001401,7001402,6001400,6001401',
            name: '物理攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 6,
            children: [
              {
                id: '7001400',
                name: '物理攻撃力上昇',
                maxStacks: 6,
              },
              {
                id: '7001401',
                name: '物理攻撃力上昇+1',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
              {
                id: '7001402',
                name: '物理攻撃力上昇+2',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
              {
                id: '6001400',
                name: '物理攻撃力上昇+3',
                hasDemeritEffect: true,
                maxStacks: 6,
              },
              {
                id: '6001401',
                name: '物理攻撃力上昇+4',
                hasDemeritEffect: true,
                maxStacks: 6,
              },
            ],
          },
          {
            id: '6610800,6610801,6610802',
            name: '属性攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 6,
            children: [
              {
                id: '6610800',
                name: '属性攻撃力上昇',
                maxStacks: 6,
              },
              {
                id: '6610801',
                name: '属性攻撃力上昇+1',
                hasDemeritEffect: true,
                maxStacks: 6,
              },
              {
                id: '6610802',
                name: '属性攻撃力上昇+2',
                hasDemeritEffect: true,
                maxStacks: 6,
              },
            ],
          },
          {
            id: '7001500,7001501,7001502,6001500,6001501',
            name: '魔力攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 6,
            children: [
              {
                id: '7001500',
                name: '魔力攻撃力上昇',
                maxStacks: 6,
              },
              {
                id: '7001501',
                name: '魔力攻撃力上昇+1',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
              {
                id: '7001502',
                name: '魔力攻撃力上昇+2',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
              {
                id: '6001500',
                name: '魔力攻撃力上昇+3',
                hasDemeritEffect: true,
                maxStacks: 6,
              },
              {
                id: '6001501',
                name: '魔力攻撃力上昇+4',
                hasDemeritEffect: true,
                maxStacks: 6,
              },
            ],
          },
          {
            id: '7001600,7001601,7001602,6001600,6001601',
            name: '炎攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 6,
            children: [
              {
                id: '7001600',
                name: '炎攻撃力上昇',
                maxStacks: 6,
              },
              {
                id: '7001601',
                name: '炎攻撃力上昇+1',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
              {
                id: '7001602',
                name: '炎攻撃力上昇+2',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
              {
                id: '6001600',
                name: '炎攻撃力上昇+3',
                hasDemeritEffect: true,
                maxStacks: 6,
              },
              {
                id: '6001601',
                name: '炎攻撃力上昇+4',
                hasDemeritEffect: true,
                maxStacks: 6,
              },
            ],
          },
          {
            id: '7001700,7001701,7001702,6001700,6001701',
            name: '雷攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 6,
            children: [
              {
                id: '7001700',
                name: '雷攻撃力上昇',
                maxStacks: 6,
              },
              {
                id: '7001701',
                name: '雷攻撃力上昇+1',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
              {
                id: '7001702',
                name: '雷攻撃力上昇+2',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
              {
                id: '6001700',
                name: '雷攻撃力上昇+3',
                hasDemeritEffect: true,
                maxStacks: 6,
              },
              {
                id: '6001701',
                name: '雷攻撃力上昇+4',
                hasDemeritEffect: true,
                maxStacks: 6,
              },
            ],
          },
          {
            id: '7001800,7001801,7001802,6001800,6001801',
            name: '聖攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 6,
            children: [
              {
                id: '7001800',
                name: '聖攻撃力上昇',
                maxStacks: 6,
              },
              {
                id: '7001801',
                name: '聖攻撃力上昇+1',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
              {
                id: '7001802',
                name: '聖攻撃力上昇+2',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
              {
                id: '6001800',
                name: '聖攻撃力上昇+3',
                hasDemeritEffect: true,
                maxStacks: 6,
              },
              {
                id: '6001801',
                name: '聖攻撃力上昇+4',
                hasDemeritEffect: true,
                maxStacks: 6,
              },
            ],
          },
          {
            id: '7040000',
            name: '通常攻撃の1段目強化',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7040200,7040201',
            name: '致命の一撃強化',
            hasDemeritEffect: false,
            maxStacks: 6,
            children: [
              {
                id: '7040200',
                name: '致命の一撃強化',
                maxStacks: 6,
              },
              {
                id: '7040201',
                name: '致命の一撃強化+1',
                hasDemeritEffect: false,
                maxStacks: 1,
              },
            ],
          },
          {
            id: '6611200,6611201,6611202',
            name: '魔術強化',
            hasDemeritEffect: false,
            maxStacks: 6,
            children: [
              {
                id: '6611200',
                name: '魔術強化',
                maxStacks: 6,
              },
              {
                id: '6611201',
                name: '魔術強化+1',
                hasDemeritEffect: true,
                maxStacks: 6,
              },
              {
                id: '6611202',
                name: '魔術強化+2',
                hasDemeritEffect: true,
                maxStacks: 6,
              },
            ],
          },
          {
            id: '6611300,6611301,6611302',
            name: '祈祷強化',
            hasDemeritEffect: false,
            maxStacks: 6,
            children: [
              {
                id: '6611300',
                name: '祈祷強化',
                maxStacks: 6,
              },
              {
                id: '6611301',
                name: '祈祷強化+1',
                hasDemeritEffect: true,
                maxStacks: 6,
              },
              {
                id: '6611302',
                name: '祈祷強化+2',
                hasDemeritEffect: true,
                maxStacks: 6,
              },
            ],
          },
          {
            id: '7043000',
            name: '咆哮とブレス強化',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7006000',
            name: '両手持ちの、体勢を崩す力上昇',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7006100',
            name: '二刀持ちの、体勢を崩す力上昇',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7035900',
            name: '武器の持ち替え時、物理攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7035800',
            name: '属性攻撃力が付加された時、属性攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '10001',
            name: '攻撃を受けると攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7060000',
            name: '封牢の囚を倒す度、攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7060200',
            name: '夜の侵入者を倒す度、攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7040100,6040100,6040101',
            name: 'ガードカウンター強化',
            hasDemeritEffect: false,
            maxStacks: 6,
            children: [
              {
                id: '7040100',
                name: 'ガードカウンター強化',
                maxStacks: 6,
              },
              {
                id: '6040100',
                name: 'ガードカウンター強化+1',
                hasDemeritEffect: true,
                maxStacks: 6,
              },
              {
                id: '6040101',
                name: 'ガードカウンター強化+2',
                hasDemeritEffect: true,
                maxStacks: 6,
              },
            ],
          },
          {
            id: '7150000',
            name: 'ガードカウンターに、自身の現在HPの一部を加える',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7030900,6030900,6030901',
            name: '脂アイテム使用時、追加で物理攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 3,
            children: [
              {
                id: '7030900',
                name: '脂アイテム使用時、追加で物理攻撃力上昇',
                maxStacks: 1,
              },
              {
                id: '6030900',
                name: '脂アイテム使用時、追加で物理攻撃力上昇+1',
                hasDemeritEffect: true,
                maxStacks: 1,
              },
              {
                id: '6030901',
                name: '脂アイテム使用時、追加で物理攻撃力上昇+2',
                hasDemeritEffect: true,
                maxStacks: 1,
              },
            ],
          },
          {
            id: '7040300,6040300,6040301',
            name: '投擲壺の攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 6,
            children: [
              {
                id: '7040300',
                name: '投擲壺の攻撃力上昇',
                maxStacks: 6,
              },
              {
                id: '6040300',
                name: '投擲壺の攻撃力上昇+1',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
              {
                id: '6040301',
                name: '投擲壺の攻撃力上昇+2',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
            ],
          },
          {
            id: '7040400,6040400,6040401',
            name: '投擲ナイフの攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 6,
            children: [
              {
                id: '7040400',
                name: '投擲ナイフの攻撃力上昇',
                maxStacks: 6,
              },
              {
                id: '6040400',
                name: '投擲ナイフの攻撃力上昇+1',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
              {
                id: '6040401',
                name: '投擲ナイフの攻撃力上昇+2',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
            ],
          },
          {
            id: '7040500,6040500,6040501',
            name: '輝石、重力石アイテムの攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 6,
            children: [
              {
                id: '7040500',
                name: '輝石、重力石アイテムの攻撃力上昇',
                maxStacks: 6,
              },
              {
                id: '6040500',
                name: '輝石、重力石アイテムの攻撃力上昇+1',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
              {
                id: '6040501',
                name: '輝石、重力石アイテムの攻撃力上昇+2',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
            ],
          },
          {
            id: '7043100,6043100',
            name: '調香術強化',
            hasDemeritEffect: false,
            maxStacks: 6,
            children: [
              {
                id: '7043100',
                name: '調香術強化',
                maxStacks: 6,
              },
              {
                id: '6043100',
                name: '調香術強化+1',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
            ],
          },
        ],
      },
      {
        category: 'スキル／アーツ',
        children: [
          {
            id: '7000800,7000801,7000802',
            name: 'スキルクールタイム軽減',
            maxStacks: 6,
            children: [
              {
                id: '7000800',
                name: 'スキルクールタイム軽減+1',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
              {
                id: '7000801',
                name: 'スキルクールタイム軽減+2',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
              {
                id: '7000802',
                name: 'スキルクールタイム軽減+3',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
            ],
          },
          {
            id: '7000900,7000901,7000902',
            name: 'アーツゲージ蓄積増加',
            maxStacks: 6,
            children: [
              {
                id: '7000900',
                name: 'アーツゲージ蓄積増加+1',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
              {
                id: '7000901',
                name: 'アーツゲージ蓄積増加+2',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
              {
                id: '7000902',
                name: 'アーツゲージ蓄積増加+3',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
            ],
          },
          {
            id: '7090000,6090000',
            name: '敵を倒した時のアーツゲージ蓄積増加',
            hasDemeritEffect: false,
            maxStacks: 2,
            children: [
              {
                id: '7090000',
                name: '敵を倒した時のアーツゲージ蓄積増加',
                maxStacks: 1,
              },
              {
                id: '6090000',
                name: '敵を倒した時のアーツゲージ蓄積増加+1',
                hasDemeritEffect: true,
                maxStacks: 1,
              },
            ],
          },
          {
            id: '7030800,6030800',
            name: '致命の一撃で、アーツゲージ蓄積増加',
            hasDemeritEffect: false,
            maxStacks: 2,
            children: [
              {
                id: '7030800',
                name: '致命の一撃で、アーツゲージ蓄積増加',
                maxStacks: 1,
              },
              {
                id: '6030800',
                name: '致命の一撃で、アーツゲージ蓄積増加+1',
                hasDemeritEffect: true,
                maxStacks: 1,
              },
            ],
          },
          {
            id: '7030600,6030600',
            name: 'ガード成功時、アーツゲージを蓄積',
            hasDemeritEffect: false,
            maxStacks: 2,
            children: [
              {
                id: '7030600',
                name: 'ガード成功時、アーツゲージを蓄積',
                maxStacks: 1,
              },
              {
                id: '6030600',
                name: 'ガード成功時、アーツゲージを蓄積+1',
                hasDemeritEffect: true,
                maxStacks: 1,
              },
            ],
          },
        ],
      },
      {
        category: '魔術／祈祷',
        children: [
          {
            id: '7043400',
            name: '輝剣の魔術を強化',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7043200',
            name: '石堀りの魔術を強化',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7043300',
            name: 'カーリアの剣の魔術を強化',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7043500',
            name: '不可視の魔術を強化',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7043600',
            name: '結晶人の魔術を強化',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7043700',
            name: '重力の魔術を強化',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7043800',
            name: '茨の魔術を強化',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7044000',
            name: '黄金律原理主義の祈祷を強化',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7044100',
            name: '王都古竜信仰の祈祷を強化',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7044200',
            name: '巨人の火の祈祷を強化',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7044300',
            name: '神狩りの祈祷を強化',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7044400',
            name: '獣の祈祷を強化',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7044500',
            name: '狂い火の祈祷を強化',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7044600',
            name: '竜餐の祈祷を強化',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
        ],
      },
      {
        category: 'カット率',
        children: [
          {
            id: '7006200,6611001,6611002',
            name: '物理カット率上昇',
            hasDemeritEffect: false,
            maxStacks: 6,
            children: [
              {
                id: '7006200',
                name: '物理カット率上昇',
                maxStacks: 6,
              },
              {
                id: '6611001',
                name: '物理カット率上昇+1',
                hasDemeritEffect: true,
                maxStacks: 6,
              },
              {
                id: '6611002',
                name: '物理カット率上昇+2',
                hasDemeritEffect: true,
                maxStacks: 6,
              },
            ],
          },
          {
            id: '6611100,6611101,6611102',
            name: '属性カット率上昇',
            hasDemeritEffect: false,
            maxStacks: 6,
            children: [
              {
                id: '6611100',
                name: '属性カット率上昇',
                maxStacks: 6,
              },
              {
                id: '6611101',
                name: '属性カット率上昇+1',
                hasDemeritEffect: true,
                maxStacks: 6,
              },
              {
                id: '6611102',
                name: '属性カット率上昇+2',
                hasDemeritEffect: true,
                maxStacks: 6,
              },
            ],
          },
          {
            id: '7002600,6002600,6002601',
            name: '魔力カット率上昇',
            hasDemeritEffect: false,
            maxStacks: 6,
            children: [
              {
                id: '7002600',
                name: '魔力カット率上昇',
                maxStacks: 6,
              },
              {
                id: '6002600',
                name: '魔力カット率上昇+1',
                hasDemeritEffect: true,
                maxStacks: 6,
              },
              {
                id: '6002601',
                name: '魔力カット率上昇+2',
                hasDemeritEffect: true,
                maxStacks: 6,
              },
            ],
          },
          {
            id: '7002700,6002700,6002701',
            name: '炎カット率上昇',
            hasDemeritEffect: false,
            maxStacks: 6,
            children: [
              {
                id: '7002700',
                name: '炎カット率上昇',
                maxStacks: 6,
              },
              {
                id: '6002700',
                name: '炎カット率上昇+1',
                hasDemeritEffect: true,
                maxStacks: 6,
              },
              {
                id: '6002701',
                name: '炎カット率上昇+2',
                hasDemeritEffect: true,
                maxStacks: 6,
              },
            ],
          },
          {
            id: '7002800,6002800,6002801',
            name: '雷カット率上昇',
            hasDemeritEffect: false,
            maxStacks: 6,
            children: [
              {
                id: '7002800',
                name: '雷カット率上昇',
                maxStacks: 6,
              },
              {
                id: '6002800',
                name: '雷カット率上昇+1',
                hasDemeritEffect: true,
                maxStacks: 6,
              },
              {
                id: '6002801',
                name: '雷カット率上昇+2',
                hasDemeritEffect: true,
                maxStacks: 6,
              },
            ],
          },
          {
            id: '7002900,6002900,6002901',
            name: '聖カット率上昇',
            hasDemeritEffect: false,
            maxStacks: 6,
            children: [
              {
                id: '7002900',
                name: '聖カット率上昇',
                maxStacks: 6,
              },
              {
                id: '6002900',
                name: '聖カット率上昇+1',
                hasDemeritEffect: true,
                maxStacks: 6,
              },
              {
                id: '6002901',
                name: '聖カット率上昇+2',
                hasDemeritEffect: true,
                maxStacks: 6,
              },
            ],
          },
          {
            id: '7012300',
            name: 'HP低下時、カット率上昇',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7240000',
            name: 'ダメージで吹き飛ばされた時、強靭度とカット率上昇',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
        ],
      },
      {
        category: '状態異常耐性',
        children: [
          {
            id: '7003000,6003000,6003001',
            name: '毒耐性上昇',
            hasDemeritEffect: false,
            maxStacks: 6,
            children: [
              {
                id: '7003000',
                name: '毒耐性上昇',
                maxStacks: 6,
              },
              {
                id: '6003000',
                name: '毒耐性上昇+1',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
              {
                id: '6003001',
                name: '毒耐性上昇+2',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
            ],
          },
          {
            id: '7003400,6003400,6003401',
            name: '腐敗耐性上昇',
            hasDemeritEffect: false,
            maxStacks: 6,
            children: [
              {
                id: '7003400',
                name: '腐敗耐性上昇',
                maxStacks: 6,
              },
              {
                id: '6003400',
                name: '腐敗耐性上昇+1',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
              {
                id: '6003401',
                name: '腐敗耐性上昇+2',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
            ],
          },
          {
            id: '7003100,6003100,6003101',
            name: '出血耐性上昇',
            hasDemeritEffect: false,
            maxStacks: 6,
            children: [
              {
                id: '7003100',
                name: '出血耐性上昇',
                maxStacks: 6,
              },
              {
                id: '6003100',
                name: '出血耐性上昇+1',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
              {
                id: '6003101',
                name: '出血耐性上昇+2',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
            ],
          },
          {
            id: '7003500,6003500,6003501',
            name: '冷気耐性上昇',
            hasDemeritEffect: false,
            maxStacks: 6,
            children: [
              {
                id: '7003500',
                name: '冷気耐性上昇',
                maxStacks: 6,
              },
              {
                id: '6003500',
                name: '冷気耐性上昇+1',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
              {
                id: '6003501',
                name: '冷気耐性上昇+2',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
            ],
          },
          {
            id: '7003200,6003200,6003201',
            name: '睡眠耐性上昇',
            hasDemeritEffect: false,
            maxStacks: 6,
            children: [
              {
                id: '7003200',
                name: '睡眠耐性上昇',
                maxStacks: 6,
              },
              {
                id: '6003200',
                name: '睡眠耐性上昇+1',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
              {
                id: '6003201',
                name: '睡眠耐性上昇+2',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
            ],
          },
          {
            id: '7003600,6003600,6003601',
            name: '発狂耐性上昇',
            hasDemeritEffect: false,
            maxStacks: 6,
            children: [
              {
                id: '7003600',
                name: '発狂耐性上昇',
                maxStacks: 6,
              },
              {
                id: '6003600',
                name: '発狂耐性上昇+1',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
              {
                id: '6003601',
                name: '発狂耐性上昇+2',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
            ],
          },
          {
            id: '7003300,6003300,6003301',
            name: '抗死耐性上昇',
            hasDemeritEffect: false,
            maxStacks: 6,
            children: [
              {
                id: '7003300',
                name: '抗死耐性上昇',
                maxStacks: 6,
              },
              {
                id: '6003300',
                name: '抗死耐性上昇+1',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
              {
                id: '6003301',
                name: '抗死耐性上昇+2',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
            ],
          },
        ],
      },
      {
        category: '回復',
        children: [
          {
            id: '7001100',
            name: 'HP持続回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7012200',
            name: 'HP低下時、周囲の味方を含めHPをゆっくりと回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7036100',
            name: 'ガード成功時、HP回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7160000,6160000',
            name: '刺突カウンター発生時、HP回復',
            hasDemeritEffect: false,
            maxStacks: 2,
            children: [
              {
                id: '7160000',
                name: '刺突カウンター発生時、HP回復',
                maxStacks: 1,
              },
              {
                id: '6160000',
                name: '刺突カウンター発生時、HP回復+1',
                hasDemeritEffect: true,
                maxStacks: 1,
              },
            ],
          },
          {
            id: '7005600,6005600,6005601',
            name: 'ダメージを受けた直後、攻撃によりHPの一部を回復',
            hasDemeritEffect: false,
            maxStacks: 3,
            children: [
              {
                id: '7005600',
                name: 'ダメージを受けた直後、攻撃によりHPの一部を回復',
                maxStacks: 1,
              },
              {
                id: '6005600',
                name: 'ダメージを受けた直後、攻撃によりHPの一部を回復+1',
                hasDemeritEffect: true,
                maxStacks: 1,
              },
              {
                id: '6005601',
                name: 'ダメージを受けた直後、攻撃によりHPの一部を回復+2',
                hasDemeritEffect: true,
                maxStacks: 1,
              },
            ],
          },
          {
            id: '7030200,6030200,6030201',
            name: '苔薬などのアイテム使用でHP回復',
            hasDemeritEffect: false,
            maxStacks: 3,
            children: [
              {
                id: '7030200',
                name: '苔薬などのアイテム使用でHP回復',
                maxStacks: 1,
              },
              {
                id: '6030200',
                name: '苔薬などのアイテム使用でHP回復+1',
                hasDemeritEffect: false,
                maxStacks: 1,
              },
              {
                id: '6030201',
                name: '苔薬などのアイテム使用でHP回復+2',
                hasDemeritEffect: false,
                maxStacks: 1,
              },
            ],
          },
          {
            id: '6611400',
            name: '聖杯瓶の回復量上昇',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6610700,6610701,6610702',
            name: '消費FP軽減',
            hasDemeritEffect: false,
            maxStacks: 6,
            children: [
              {
                id: '6610700',
                name: '消費FP軽減',
                maxStacks: 6,
              },
              {
                id: '6610701',
                name: '消費FP軽減+1',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
              {
                id: '6610702',
                name: '消費FP軽減+2',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
            ],
          },
          {
            id: '10000',
            name: '攻撃連続時、FP回復',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7035500',
            name: '発狂状態になると、FP持続回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7100100,7100110',
            name: '攻撃命中時、スタミナ回復',
            hasDemeritEffect: false,
            maxStacks: 2,
            children: [
              {
                id: '7100100',
                name: '攻撃命中時、スタミナ回復',
                maxStacks: 1,
              },
              {
                id: '7100110',
                name: '攻撃命中時、スタミナ回復+1',
                hasDemeritEffect: false,
                maxStacks: 1,
              },
            ],
          },
          {
            id: '7035100,6035100',
            name: '致命の一撃で、スタミナ回復速度上昇',
            hasDemeritEffect: false,
            maxStacks: 2,
            children: [
              {
                id: '7035100',
                name: '致命の一撃で、スタミナ回復速度上昇',
                maxStacks: 1,
              },
              {
                id: '6035100',
                name: '致命の一撃で、スタミナ回復速度上昇+1',
                hasDemeritEffect: false,
                maxStacks: 1,
              },
            ],
          },
        ],
      },
      {
        category: 'アクション',
        children: [
          {
            id: '7031900,6031900,6031901',
            name: '致命の一撃で、ルーンを取得',
            hasDemeritEffect: false,
            maxStacks: 6,
            children: [
              {
                id: '7031900',
                name: '致命の一撃で、ルーンを取得',
                maxStacks: 6,
              },
              {
                id: '6031900',
                name: '致命の一撃で、ルーンを取得+1',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
              {
                id: '6031901',
                name: '致命の一撃で、ルーンを取得+2',
                hasDemeritEffect: false,
                maxStacks: 6,
              },
            ],
          },
          {
            id: '7035700',
            name: '武器の持ち替え時、いずれかの属性攻撃力を付加',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7030700',
            name: 'ガード中、敵に狙われやすくなる',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7035400',
            name: 'ジェスチャー「あぐら」により、発狂が蓄積',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7260000,6260000,6260001',
            name: '毒状態の敵に対する攻撃を強化',
            hasDemeritEffect: false,
            maxStacks: 3,
            children: [
              {
                id: '7260000',
                name: '毒状態の敵に対する攻撃を強化',
                maxStacks: 1,
              },
              {
                id: '6260000',
                name: '毒状態の敵に対する攻撃を強化+1',
                hasDemeritEffect: true,
                maxStacks: 1,
              },
              {
                id: '6260001',
                name: '毒状態の敵に対する攻撃を強化+2',
                hasDemeritEffect: true,
                maxStacks: 1,
              },
            ],
          },
          {
            id: '7260300,6260300,6260301',
            name: '腐敗状態の敵に対する攻撃を強化',
            hasDemeritEffect: false,
            maxStacks: 3,
            children: [
              {
                id: '7260300',
                name: '腐敗状態の敵に対する攻撃を強化',
                maxStacks: 1,
              },
              {
                id: '6260300',
                name: '腐敗状態の敵に対する攻撃を強化+1',
                hasDemeritEffect: true,
                maxStacks: 1,
              },
              {
                id: '6260301',
                name: '腐敗状態の敵に対する攻撃を強化+2',
                hasDemeritEffect: true,
                maxStacks: 1,
              },
            ],
          },
          {
            id: '7260400,6260400,6260401',
            name: '凍傷状態の敵に対する攻撃を強化',
            hasDemeritEffect: false,
            maxStacks: 3,
            children: [
              {
                id: '7260400',
                name: '凍傷状態の敵に対する攻撃を強化',
                maxStacks: 1,
              },
              {
                id: '6260400',
                name: '凍傷状態の敵に対する攻撃を強化+1',
                hasDemeritEffect: true,
                maxStacks: 1,
              },
              {
                id: '6260401',
                name: '凍傷状態の敵に対する攻撃を強化+2',
                hasDemeritEffect: true,
                maxStacks: 1,
              },
            ],
          },
          {
            id: '7260710',
            name: '周囲で毒／腐敗状態発生時、攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7260700',
            name: '周囲で凍傷状態の発生時、自身の姿を隠す',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6600000,6600001',
            name: '周囲で睡眠状態の発生時、攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 2,
            children: [
              {
                id: '6600000',
                name: '周囲で睡眠状態の発生時、攻撃力上昇',
                maxStacks: 1,
              },
              {
                id: '6600001',
                name: '周囲で睡眠状態の発生時、攻撃力上昇+1',
                hasDemeritEffect: true,
                maxStacks: 1,
              },
            ],
          },
          {
            id: '6600100,6600101',
            name: '周囲で発狂状態の発生時、攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 2,
            children: [
              {
                id: '6600100',
                name: '周囲で発狂状態の発生時、攻撃力上昇',
                maxStacks: 1,
              },
              {
                id: '6600101',
                name: '周囲で発狂状態の発生時、攻撃力上昇+1',
                hasDemeritEffect: true,
                maxStacks: 1,
              },
            ],
          },
        ],
      },
      {
        category: '出撃時の武器（戦技）',
        children: [
          {
            id: '7124300',
            name: '出撃時の武器の戦技を「我慢」にする',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7124400',
            name: '出撃時の武器の戦技を「クイックステップ」にする',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7124500',
            name: '出撃時の武器の戦技を「嵐脚」にする',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7124600',
            name: '出撃時の武器の戦技を「デターミネーション」にする',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7122700',
            name: '出撃時の武器の戦技を「輝剣の円陣」にする',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7122800',
            name: '出撃時の武器の戦技を「グラビタス」にする',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7122900',
            name: '出撃時の武器の戦技を「炎撃」にする',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7123000',
            name: '出撃時の武器の戦技を「溶岩噴火」にする',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7123100',
            name: '出撃時の武器の戦技を「落雷」にする',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7123200',
            name: '出撃時の武器の戦技を「雷撃斬」にする',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7123300',
            name: '出撃時の武器の戦技を「聖なる刃」にする',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7123400',
            name: '出撃時の武器の戦技を「祈りの一撃」にする',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7123500',
            name: '出撃時の武器の戦技を「毒の霧」にする',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7123600',
            name: '出撃時の武器の戦技を「毒蛾は二度舞う」にする',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7123700',
            name: '出撃時の武器の戦技を「血の刃」にする',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7123800',
            name: '出撃時の武器の戦技を「切腹」にする',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7123900',
            name: '出撃時の武器の戦技を「冷気の霧」にする',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7124000',
            name: '出撃時の武器の戦技を「霜踏み」にする',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7124100',
            name: '出撃時の武器の戦技を「白い影の誘い」にする',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7124700',
            name: '出撃時の武器の戦技を「アローレイン」にする',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
        ],
      },
      {
        category: '出撃時の武器（付加）',
        children: [
          {
            id: '7120000',
            name: '出撃時の武器に魔力攻撃力を付加',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7120100',
            name: '出撃時の武器に炎攻撃力を付加',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7120200',
            name: '出撃時の武器に雷攻撃力を付加',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7120300',
            name: '出撃時の武器に聖攻撃力を付加',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7120500',
            name: '出撃時の武器に毒の状態異常を付加',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7120600',
            name: '出撃時の武器に出血の状態異常を付加',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7120400',
            name: '出撃時の武器に冷気の状態異常を付加',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
        ],
      },
      {
        category: '出撃時のアイテム',
        children: [
          {
            id: '7126000',
            name: '出撃時に「星光の欠片」を持つ',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7121100',
            name: '出撃時に「火炎壺」を持つ',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7121200',
            name: '出撃時に「魔力壺」を持つ',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7121300',
            name: '出撃時に「雷壺」を持つ',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7121400',
            name: '出撃時に「聖水壺」を持つ',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7121500',
            name: '出撃時に「骨の毒投げ矢」を持つ',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7121600',
            name: '出撃時に「結晶投げ矢」を持つ',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7121700',
            name: '出撃時に「スローイングダガー」を持つ',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7121800',
            name: '出撃時に「屑輝石」を持つ',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7121900',
            name: '出撃時に「塊の重力石」を持つ',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7122000',
            name: '出撃時に「誘惑の枝」を持つ',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '6624100',
            name: '出撃時に「火花の香り」を持つ',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6624400',
            name: '出撃時に「毒の噴霧」を持つ',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6624200',
            name: '出撃時に「鉄壺の香薬」を持つ',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6624000',
            name: '出撃時に「高揚の香り」を持つ',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6624500',
            name: '出撃時に「酸の噴霧」を持つ',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6624300',
            name: '出撃時に「狂熱の香薬」を持つ',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7122100',
            name: '出撃時に「呪霊喚びの鈴」を持つ',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7122200',
            name: '出撃時に「火脂」を持つ',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7122300',
            name: '出撃時に「魔力脂」を持つ',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7122400',
            name: '出撃時に「雷脂」を持つ',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7122500',
            name: '出撃時に「聖脂」を持つ',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7122600',
            name: '出撃時に「盾脂」を持つ',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7121000',
            name: '出撃時に「小さなポーチ」を持つ',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7120900',
            name: '出撃時に「石剣の鍵」を持つ',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
        ],
      },
      {
        category: '出撃時のアイテム(結晶の雫)',
        children: [
          {
            id: '6621100',
            name: '出撃時に「緋色の結晶雫」を持つ',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6621000',
            name: '出撃時に「緋溢れの結晶雫」を持つ',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6621600',
            name: '出撃時に「緋湧きの結晶雫」を持つ',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6621200',
            name: '出撃時に「青色の結晶雫」を持つ',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6621700',
            name: '出撃時に「緑湧きの結晶雫」を持つ',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6621800',
            name: '出撃時に「真珠色の硬雫」を持つ',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6621300',
            name: '出撃時に「斑彩色の硬雫」を持つ',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6622300',
            name: '出撃時に「鉛色の硬雫」を持つ',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6622900',
            name: '出撃時に「魔力纏いの割れ雫」を持つ',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6622800',
            name: '出撃時に「炎纏いの割れ雫」を持つ',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6623000',
            name: '出撃時に「雷纏いの割れ雫」を持つ',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6623100',
            name: '出撃時に「聖纏いの割れ雫」を持つ',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6622700',
            name: '出撃時に「岩棘の割れ雫」を持つ',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6622000',
            name: '出撃時に「大棘の割れ雫」を持つ',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6621900',
            name: '出撃時に「連棘の割れ雫」を持つ',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6622400',
            name: '出撃時に「細枝の割れ雫」を持つ',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6622100',
            name: '出撃時に「風の結晶雫」を持つ',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6621400',
            name: '出撃時に「緋色の泡雫」を持つ',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6622500',
            name: '出撃時に「緋色渦の泡雫」を持つ',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6621500',
            name: '出撃時に「真珠色の泡雫」を持つ',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6622600',
            name: '出撃時に「青色の秘雫」を持つ',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6622200',
            name: '出撃時に「破裂した結晶雫」を持つ',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
        ],
      },
      {
        category: 'マップ環境',
        children: [
          {
            id: '7070000',
            name: '埋もれ宝の位置を地図に表示',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7230000',
            name: '出撃中、ショップでの購入に必要なルーンが割引',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7230001',
            name: '出撃中、ショップでの購入に必要なルーンが大割引',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
        ],
      },
      {
        category: 'チームメンバー',
        children: [
          {
            id: '7110000',
            name: '自身と味方の取得ルーン増加',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7050000',
            name: '自身を除く、周囲の味方のスタミナ回復速度上昇',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7010200',
            name: '聖杯瓶の回復を、周囲の味方に分配',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7090100',
            name: '敵を倒した時、自身を除く周囲の味方のHPを回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7050100',
            name: 'アイテムの効果が周囲の味方にも発動',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
        ],
      },
    ],
  },
  {
    category: '特定キャラクターのみ',
    children: [
      {
        category: '追跡者',
        children: [
          {
            id: '7032400',
            name: '【追跡者】アビリティ発動時、アーツゲージ増加',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7020000',
            name: '【追跡者】スキル使用時、通常攻撃で炎を纏った追撃を行う（大剣のみ）',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7033200',
            name: '【追跡者】スキルの使用回数+1',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7010500',
            name: '【追跡者】アーツ発動時、周囲を延焼',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6640000',
            name: '【追跡者】精神力上昇、生命力低下',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6640100',
            name: '【追跡者】知力/信仰上昇、筋力/技量低下',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6500000',
            name: '【追跡者】スキルに、出血の状態異常を付加',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
        ],
      },
      {
        category: '守護者',
        children: [
          {
            id: '7033400',
            name: '【守護者】アビリティ発動中、ガード成功時、衝撃波が発生',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7011000',
            name: '【守護者】スキルの持続時間延長',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7012000',
            name: '【守護者】アーツ発動時、周囲の味方のHPを徐々に回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7011600',
            name: '【守護者】斧槍タメ攻撃時、つむじ風が発生',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6641000',
            name: '【守護者】筋力/技量上昇、生命力低下',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6641100',
            name: '【守護者】精神力/信仰上昇、生命力低下',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6500100',
            name: '【守護者】スキル使用時、周囲の味方のカット率上昇',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
        ],
      },
      {
        category: '鉄の目',
        children: [
          {
            id: '7270100',
            name: '【鉄の目】スキルの使用回数+1',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7034600',
            name: '【鉄の目】アーツのタメ発動時、毒の状態異常を付加',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7034700',
            name: '【鉄の目】アーツ発動後、刺突カウンター強化',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7280000',
            name: '【鉄の目】弱点の持続時間を延長させる',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6642100',
            name: '【鉄の目】生命力/筋力上昇、技量低下',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6642000',
            name: '【鉄の目】神秘上昇、技量低下',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6500200',
            name: '【鉄の目】スキルに毒の状態異常を付加して毒状態の敵に大ダメージ',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
        ],
      },
      {
        category: 'レディ',
        children: [
          {
            id: '7290000',
            name: '【レディ】スキルのダメージ上昇',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7032700',
            name: '【レディ】アーツ発動中、敵撃破で攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7010700',
            name: '【レディ】短剣による連続攻撃時、周囲の敵に直近の出来事を再演',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7031800',
            name: '【レディ】背後からの致命の一撃後、自身の姿を見え難くし、足音を消す',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6643000',
            name: '【レディ】生命力/筋力上昇、精神力低下',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6643100',
            name: '【レディ】精神力/信仰上昇、知力低下',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6500300',
            name: '【レディ】スキル使用時、僅かに無敵',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
        ],
      },
      {
        category: '無頼漢',
        children: [
          {
            id: '7031300',
            name: '【無頼漢】スキル中に攻撃を受けると攻撃力と最大スタミナ上昇',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7310000',
            name: '【無頼漢】アーツの効果時間延長',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7090300',
            name: 'トーテム・ステラの周囲で敵を倒した時、HP回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7030000',
            name: 'トーテム・ステラの周囲で、強靭度上昇',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6644000',
            name: '【無頼漢】精神力/知力上昇、生命力/持久力低下',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6644100',
            name: '【無頼漢】神秘上昇、生命力低下',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6500400',
            name: '【無頼漢】スキル命中時、敵の攻撃力低下',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
        ],
      },
      {
        category: '復讐者',
        children: [
          {
            id: '7011200',
            name: '【復讐者】アーツ発動時、霊炎の爆発を発生',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7010900',
            name: '【復讐者】アーツ発動時、自身のHPと引き換えに周囲の味方のHPを全回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7031200',
            name: '【復讐者】アーツ発動時、ファミリーと味方を強化',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7220000',
            name: '【復讐者】ファミリーと共闘中の間、自身を強化',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6645000',
            name: '【復讐者】生命力/持久力上昇、精神力低下',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6645100',
            name: '【復讐者】筋力上昇、信仰低下',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6500500',
            name: '【復讐者】アビリティ発動時、最大FP上昇',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
        ],
      },
      {
        category: '隠者',
        children: [
          {
            id: '7032900',
            name: '【隠者】アーツ発動時、自身が出血状態になり、攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7034100',
            name: '【隠者】アーツ発動時、最大HP上昇',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7032800',
            name: '【隠者】属性痕を集めた時、「魔術の地」が発動',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6646000',
            name: '【隠者】生命力/持久力/技量上昇、知力/信仰低下',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6646100',
            name: '【隠者】知力/信仰上昇、精神力低下',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6500600',
            name: '【隠者】属性痕を集めた時、対応する属性カット率上昇',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
        ],
      },
      {
        category: '執行者',
        children: [
          {
            id: '7034400',
            name: '【執行者】スキル中の攻撃力上昇、攻撃時にHP減少',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7034500',
            name: '【執行者】スキル中、妖刀が解放状態になるとHP回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7011700',
            name: '【執行者】アーツ発動中、咆哮でHP回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6647000',
            name: '【執行者】生命力/持久力上昇、神秘低下',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6647100',
            name: '【執行者】技量/神秘上昇、生命力低下',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6500700',
            name: '【執行者】アビリティ発動時、HPをゆっくりと回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
        ],
      },
    ],
  },
  {
    category: '特定武器のみ',
    children: [
      {
        category: '短剣',
        children: [
          {
            id: '7330000',
            name: '短剣の攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7340000',
            name: '短剣の攻撃でHP回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7350000',
            name: '短剣の攻撃でFP回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7080000',
            name: '短剣の武器種を3つ以上装備していると攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6630000',
            name: '潜在する力から、「短剣」を見つけやすくなる',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
        ],
      },
      {
        category: '直剣',
        children: [
          {
            id: '7330100',
            name: '直剣の攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7340100',
            name: '直剣の攻撃でHP回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7350100',
            name: '直剣の攻撃でFP回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7080100',
            name: '直剣の武器種を3つ以上装備していると攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6630100',
            name: '潜在する力から、「直剣」を見つけやすくなる',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
        ],
      },
      {
        category: '大剣',
        children: [
          {
            id: '7330200',
            name: '大剣の攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7340200',
            name: '大剣の攻撃でHP回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7350200',
            name: '大剣の攻撃でFP回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7080200',
            name: '大剣の武器種を3つ以上装備していると攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6630200',
            name: '潜在する力から、「大剣」を見つけやすくなる',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
        ],
      },
      {
        category: '特大剣',
        children: [
          {
            id: '7330300',
            name: '特大剣の攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7340300',
            name: '特大剣の攻撃でHP回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7350300',
            name: '特大剣の攻撃でFP回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7080300',
            name: '特大剣の武器種を3つ以上装備していると攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6630300',
            name: '潜在する力から、「特大剣」を見つけやすくなる',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
        ],
      },
      {
        category: '刺剣',
        children: [
          {
            id: '7330800',
            name: '刺剣の攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7340800',
            name: '刺剣の攻撃でHP回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7350800',
            name: '刺剣の攻撃でFP回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7080800',
            name: '刺剣の武器種を3つ以上装備していると攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6630800',
            name: '潜在する力から、「刺剣」を見つけやすくなる',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
        ],
      },
      {
        category: '重刺剣',
        children: [
          {
            id: '7330900',
            name: '重刺剣の攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7340900',
            name: '重刺剣の攻撃でHP回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7350900',
            name: '重刺剣の攻撃でFP回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7080900',
            name: '重刺剣の武器種を3つ以上装備していると攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6630900',
            name: '潜在する力から、「重刺剣」を見つけやすくなる',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
        ],
      },
      {
        category: '曲剣',
        children: [
          {
            id: '7330400',
            name: '曲剣の攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7340400',
            name: '曲剣の攻撃でHP回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7350400',
            name: '曲剣の攻撃でFP回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7080400',
            name: '曲剣の武器種を3つ以上装備していると攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6630400',
            name: '潜在する力から、「曲剣」を見つけやすくなる',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
        ],
      },
      {
        category: '大曲剣',
        children: [
          {
            id: '7330500',
            name: '大曲剣の攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7340500',
            name: '大曲剣の攻撃でHP回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7350500',
            name: '大曲剣の攻撃でFP回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7080500',
            name: '大曲剣の武器種を3つ以上装備していると攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6630500',
            name: '潜在する力から、「大曲剣」を見つけやすくなる',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
        ],
      },
      {
        category: '刀',
        children: [
          {
            id: '7330600',
            name: '刀の攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7340600',
            name: '刀の攻撃でHP回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7350600',
            name: '刀の攻撃でFP回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7080600',
            name: '刀の武器種を3つ以上装備していると攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6630600',
            name: '潜在する力から、「刀」を見つけやすくなる',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
        ],
      },
      {
        category: '両刃剣',
        children: [
          {
            id: '7330700',
            name: '両刃剣の攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7340700',
            name: '両刃剣の攻撃でHP回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7350700',
            name: '両刃剣の攻撃でFP回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7080700',
            name: '両刃剣の武器種を3つ以上装備していると攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6630700',
            name: '潜在する力から、「両刃剣」を見つけやすくなる',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
        ],
      },
      {
        category: '斧',
        children: [
          {
            id: '7331000',
            name: '斧の攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7341000',
            name: '斧の攻撃でHP回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7351000',
            name: '斧の攻撃でFP回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7081000',
            name: '斧の武器種を3つ以上装備していると攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6631000',
            name: '潜在する力から、「斧」を見つけやすくなる',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
        ],
      },
      {
        category: '大斧',
        children: [
          {
            id: '7331100',
            name: '大斧の攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7341100',
            name: '大斧の攻撃でHP回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7351100',
            name: '大斧の攻撃でFP回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7081100',
            name: '大斧の武器種を3つ以上装備していると攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6631100',
            name: '潜在する力から、「大斧」を見つけやすくなる',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
        ],
      },
      {
        category: '槌',
        children: [
          {
            id: '7331200',
            name: '槌の攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7341200',
            name: '槌の攻撃でHP回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7351200',
            name: '槌の攻撃でFP回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7081200',
            name: '槌の武器種を3つ以上装備していると攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6631200',
            name: '潜在する力から、「槌」を見つけやすくなる',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
        ],
      },
      {
        category: 'フレイル',
        children: [
          {
            id: '7331400',
            name: 'フレイルの攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7341400',
            name: 'フレイルの攻撃でHP回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7351400',
            name: 'フレイルの攻撃でFP回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7081400',
            name: 'フレイルの武器種を3つ以上装備していると攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6631400',
            name: '潜在する力から、「フレイル」を見つけやすくなる',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
        ],
      },
      {
        category: '大槌',
        children: [
          {
            id: '7331300',
            name: '大槌の攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7341300',
            name: '大槌の攻撃でHP回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7351300',
            name: '大槌の攻撃でFP回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7081300',
            name: '大槌の武器種を3つ以上装備していると攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6631300',
            name: '潜在する力から、「大槌」を見つけやすくなる',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
        ],
      },
      {
        category: '特大武器',
        children: [
          {
            id: '7332300',
            name: '特大武器の攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7342300',
            name: '特大武器の攻撃でHP回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7352300',
            name: '特大武器の攻撃でFP回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7082300',
            name: '特大武器の武器種を3つ以上装備していると攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6632200',
            name: '潜在する力から、「特大武器」を見つけやすくなる',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
        ],
      },
      {
        category: '槍',
        children: [
          {
            id: '7331500',
            name: '槍の攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7341500',
            name: '槍の攻撃でHP回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7351500',
            name: '槍の攻撃でFP回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7081500',
            name: '槍の武器種を3つ以上装備していると攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6631500',
            name: '潜在する力から、「槍」を見つけやすくなる',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
        ],
      },
      {
        category: '大槍',
        children: [
          {
            id: '7331700',
            name: '大槍の攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7341700',
            name: '大槍の攻撃でHP回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7351700',
            name: '大槍の攻撃でFP回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7081700',
            name: '大槍の武器種を3つ以上装備していると攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6631600',
            name: '潜在する力から、「大槍」を見つけやすくなる',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
        ],
      },
      {
        category: '鎌',
        children: [
          {
            id: '7331900',
            name: '鎌の攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7341900',
            name: '鎌の攻撃でHP回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7351900',
            name: '鎌の攻撃でFP回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7081900',
            name: '鎌の武器種を3つ以上装備していると攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6631800',
            name: '潜在する力から、「鎌」を見つけやすくなる',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
        ],
      },
      {
        category: '鞭',
        children: [
          {
            id: '7332200',
            name: '鞭の攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7342200',
            name: '鞭の攻撃でHP回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7352200',
            name: '鞭の攻撃でFP回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7082200',
            name: '鞭の武器種を3つ以上装備していると攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6632100',
            name: '潜在する力から、「鞭」を見つけやすくなる',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
        ],
      },
      {
        category: '拳',
        children: [
          {
            id: '7332000',
            name: '拳の攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7342000',
            name: '拳の攻撃でHP回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7352000',
            name: '拳の攻撃でFP回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7082000',
            name: '拳の武器種を3つ以上装備していると攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6631900',
            name: '潜在する力から、「拳」を見つけやすくなる',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
        ],
      },
      {
        category: '爪',
        children: [
          {
            id: '7332100',
            name: '爪の攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7342100',
            name: '爪の攻撃でHP回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7352100',
            name: '爪の攻撃でFP回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7082100',
            name: '爪の武器種を3つ以上装備していると攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6632000',
            name: '潜在する力から、「爪」を見つけやすくなる',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
        ],
      },
      {
        category: '弓',
        children: [
          {
            id: '7332400',
            name: '弓の攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 6,
          },
          {
            id: '7342400',
            name: '弓の攻撃でHP回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7352400',
            name: '弓の攻撃でFP回復',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '7082400',
            name: '弓の武器種を3つ以上装備していると攻撃力上昇',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6632300',
            name: '潜在する力から、「弓」を見つけやすくなる',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
        ],
      },
      {
        category: '大弓',
        children: [
          {
            id: '6632400',
            name: '潜在する力から、「大弓」を見つけやすくなる',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
        ],
      },
      {
        category: 'クロスボウ',
        children: [
          {
            id: '6632500',
            name: '潜在する力から、「クロスボウ」を見つけやすくなる',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
        ],
      },
      {
        category: 'バリスタ',
        children: [
          {
            id: '6632600',
            name: '潜在する力から、「バリスタ」を見つけやすくなる',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
        ],
      },
      {
        category: '松明',
        children: [
          {
            id: '6633200',
            name: '潜在する力から、「松明」を見つけやすくなる',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
        ],
      },
      {
        category: '小盾',
        children: [
          {
            id: '7082700',
            name: '小盾の武器種を3つ以上装備していると最大HP上昇',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6632700',
            name: '潜在する力から、「小盾」を見つけやすくなる',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
        ],
      },
      {
        category: '中盾',
        children: [
          {
            id: '7082800',
            name: '中盾の武器種を3つ以上装備していると最大HP上昇',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6632800',
            name: '潜在する力から、「中盾」を見つけやすくなる',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
        ],
      },
      {
        category: '大盾',
        children: [
          {
            id: '7082900',
            name: '大盾の武器種を3つ以上装備していると最大HP上昇',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6632900',
            name: '潜在する力から、「大盾」を見つけやすくなる',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
        ],
      },
      {
        category: '杖',
        children: [
          {
            id: '7082500',
            name: '杖の武器種を3つ以上装備していると最大FP上昇',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6633000',
            name: '潜在する力から、「杖」を見つけやすくなる',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
        ],
      },
      {
        category: '聖印',
        children: [
          {
            id: '7082600',
            name: '聖印の武器種を3つ以上装備していると最大FP上昇',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
          {
            id: '6633100',
            name: '潜在する力から、「聖印」を見つけやすくなる',
            hasDemeritEffect: false,
            maxStacks: 1,
          },
        ],
      },
    ],
  },
]
