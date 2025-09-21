import { mockRelic } from './relic'

function genId(prefix: string) {
  let counter = 0

  return () => {
    return `${prefix}${++counter}`
  }
}

const nextId = genId('datasets-relic-')

// 小壺商人で販売される遺物
export const storeRelics = [
  mockRelic.red({ id: nextId(), effects: [7110000, 7120900, 7230000] }),
  mockRelic.green({ id: nextId(), effects: [7005600, 7000001, 7001001] }),
  mockRelic.red({ id: nextId(), effects: [7010500, 7000301, 7000401] }),
  mockRelic.blue({ id: nextId(), effects: [7033400, 7000001, 7000201] }),
  mockRelic.green({ id: nextId(), effects: [7290000, 7000401, 7000501] }),
  mockRelic.yellow({ id: nextId(), effects: [7032900, 7000101, 7000501] }),
  mockRelic.yellow({ id: nextId(), effects: [7280000, 7000201, 7000401] }),
  mockRelic.blue({ id: nextId(), effects: [7030000, 7000001, 7000301] }),
  mockRelic.blue({ id: nextId(), effects: [7011200, 7000601, 7000701] }),
  mockRelic.red({ id: nextId(), effects: [7011700, 7000401, 7000701] }),
  mockRelic.red({ id: nextId(), effects: [7040500, 7121000] }),
  mockRelic.green({ id: nextId(), effects: [7010200, 7090100] }),
  mockRelic.yellow({ id: nextId(), effects: [7003000, 7003400] }),
  mockRelic.yellow({ id: nextId(), effects: [7003100, 7003500] }),
  mockRelic.blue({ id: nextId(), effects: [7003200, 7003600] }),
  mockRelic.blue({ id: nextId(), effects: [7000102, 7003300] }),
  mockRelic.green({ id: nextId(), effects: [7030900, 7000202] }),
  mockRelic.blue({ id: nextId(), effects: [7030700, 7000002] }),
  mockRelic.red({ id: nextId(), effects: [7000901, 7002600] }),
  mockRelic.green({ id: nextId(), effects: [7000801, 7002700] }),
  mockRelic.green({ id: nextId(), effects: [7000801, 7002800] }),
  mockRelic.red({ id: nextId(), effects: [7000901, 7002900] }),
  mockRelic.red({ id: nextId(), effects: [7121100] }),
  mockRelic.blue({ id: nextId(), effects: [7120000] }),
  mockRelic.yellow({ id: nextId(), effects: [7122400] }),
  mockRelic.green({ id: nextId(), effects: [7123300] }),
  mockRelic.red({ id: nextId(), effects: [7040300, 7040400] }),
  mockRelic.yellow({ id: nextId(), effects: [7040200] }),
]

// コレクターの看板で販売される遺物
export const collectorsRelics = [
  mockRelic.blue({ id: nextId(), effects: [7010500, 7122900, 7001602] }),
  mockRelic.red({ id: nextId(), effects: [7033400, 7030600, 7000202] }),
  mockRelic.green({ id: nextId(), effects: [7031800, 7040200, 7000801] }),
  mockRelic.green({ id: nextId(), effects: [7082500, 7060100, 7001500] }),
  mockRelic.red({ id: nextId(), effects: [7034600, 7260000, 7000902] }),
  mockRelic.yellow({ id: nextId(), effects: [7310000, 7332300, 7000202] }),
  mockRelic.blue({ id: nextId(), effects: [7031200, 7050100, 7126000] }),
  mockRelic.yellow({ id: nextId(), effects: [7034400, 7036100, 7030600] }),
  mockRelic.red({ id: nextId(), effects: [7012200, 7012300, 7000002] }),
  mockRelic.green({ id: nextId(), effects: [7006000, 7040000, 7001002] }),
  mockRelic.red({ id: nextId(), effects: [7006100, 7100100, 7000202] }),
  mockRelic.yellow({ id: nextId(), effects: [7060000, 7070000, 7120900] }),
  mockRelic.blue({ id: nextId(), effects: [7126000, 7126001, 7126002] }),
]

// 固有遺物
export const uniqueRelics = [
  mockRelic.blue({ id: nextId(), effects: [7035900, 7040400, 7000000], itemId: 10002 }),
  mockRelic.green({ id: nextId(), effects: [10000, 7000402], itemId: 10000 }),
  mockRelic.blue({ id: nextId(), effects: [10001, 7000602], itemId: 10001 }),
]

// 夜の王の遺物
export const nightLoadsRelics = [
  mockRelic.yellow({ id: nextId(), effects: [7100110, 7120100], itemId: 2000 }),
  mockRelic.blue({ id: nextId(), effects: [7040201, 7030800, 7035100], itemId: 2010 }),
  mockRelic.yellow({ id: nextId(), effects: [7000190, 7120500, 7260710], itemId: 2020 }),
  mockRelic.red({ id: nextId(), effects: [7000090, 7010200, 7050100], itemId: 2030 }),
  mockRelic.red({ id: nextId(), effects: [7230001, 7035400, 7035500], itemId: 2040 }),
  mockRelic.green({ id: nextId(), effects: [7000290, 7150000, 7160000], itemId: 2050 }),
  mockRelic.yellow({ id: nextId(), effects: [7260700, 7123900, 7260400], itemId: 2060 }),
  mockRelic.blue({ id: nextId(), effects: [7035700, 7035800, 7035900], itemId: 2100 }),
]

// 常夜の王の遺物
export const darkNightRelics = [
  mockRelic.yellow({ id: nextId(), effects: [7100110, 10001, 7001602], itemId: 2001 }),
  mockRelic.red({ id: nextId(), effects: [7040201, 7040200, 7031900], itemId: 2011 }),
  mockRelic.green({ id: nextId(), effects: [7000190, 10000, 7060100], itemId: 2021 }),
  mockRelic.blue({ id: nextId(), effects: [7000090, 7001100, 7012200], itemId: 2031 }),
  mockRelic.blue({ id: nextId(), effects: [10001, 7035400, 7035500], itemId: 2041 }),
  mockRelic.yellow({ id: nextId(), effects: [7000290, 7035800, 7090000], itemId: 2051 }),
  mockRelic.green({ id: nextId(), effects: [7260700, 7120400, 7006200], itemId: 2061 }),
]

// 追憶の遺物
export const remembranceRelics = [
  mockRelic.red({ id: nextId(), effects: [7020000, 7001400], itemId: 11000 }),
  mockRelic.red({ id: nextId(), effects: [7010500, 7033200, 7100100], itemId: 11001 }),
  mockRelic.red({ id: nextId(), effects: [7032400, 7000902, 7000702], itemId: 11002 }),
  mockRelic.red({ id: nextId(), effects: [7011600, 7341800], itemId: 12000 }),
  mockRelic.red({ id: nextId(), effects: [7011000, 7000802], itemId: 12001 }),
  mockRelic.red({ id: nextId(), effects: [7012000, 7033400, 7000002], itemId: 12002 }),
  mockRelic.yellow({ id: nextId(), effects: [7280000, 7031900], itemId: 13001 }),
  mockRelic.yellow({ id: nextId(), effects: [7034700, 7120300, 7332400], itemId: 13002 }),
  mockRelic.yellow({ id: nextId(), effects: [7290000, 7035800], itemId: 14000 }),
  mockRelic.green({ id: nextId(), effects: [7010700, 7330000], itemId: 14001 }),
  mockRelic.green({ id: nextId(), effects: [7032700, 7001100, 7000002], itemId: 14002 }),
  mockRelic.blue({ id: nextId(), effects: [7031300, 7000302], itemId: 15000 }),
  mockRelic.yellow({ id: nextId(), effects: [7090300, 7090000, 7001002], itemId: 15002 }),
  mockRelic.blue({ id: nextId(), effects: [7220000, 7110000], itemId: 16001 }),
  mockRelic.blue({ id: nextId(), effects: [7011200, 7010900, 7090000], itemId: 16002 }),
  mockRelic.green({ id: nextId(), effects: [7032800, 7001500], itemId: 17001 }),
  mockRelic.green({ id: nextId(), effects: [7034100, 7032900, 7000502], itemId: 17002 }),
  mockRelic.green({ id: nextId(), effects: [7034500, 7000402], itemId: 18000 }),
  mockRelic.red({ id: nextId(), effects: [7011700, 7012200, 7036100], itemId: 18002 }),
]

export const defaultPreset = [
  ...storeRelics,
  ...uniqueRelics,
  ...nightLoadsRelics,
  ...darkNightRelics,
  ...remembranceRelics,
]
