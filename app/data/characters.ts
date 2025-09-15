export const characterMap = {
  wylder: { id: 'wylder', name: '追跡者' },
  guardian: { id: 'guardian', name: '守護者' },
  ironeye: { id: 'ironeye', name: '鉄の目' },
  duchess: { id: 'duchess', name: 'レディ' },
  raider: { id: 'raider', name: '無頼漢' },
  revenant: { id: 'revenant', name: '復讐者' },
  recluse: { id: 'recluse', name: '隠者' },
  executor: { id: 'executor', name: '執行者' },
} as const satisfies Record<string, { id: string; name: string }>

export const characterList = Object.values(characterMap)

export type CharId = keyof typeof characterMap
