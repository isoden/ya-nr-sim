import { characterMap } from './characters'
import { RelicColor } from './relics'

export type SlotColor = (typeof SlotColor)[keyof typeof SlotColor]
export const SlotColor = {
  ...RelicColor,
  Free: 'Free',
} as const satisfies Record<string, string>

/**
 * 献器の定義
 */
export class Vessel {
  /** 献器のID */
  private static readonly idPrefix = 'vessel-'
  private static idCounter = 0

  /** 献器のIDを生成 */
  private static generateId(): string {
    return `${Vessel.idPrefix}${Vessel.idCounter++}`
  }

  static new(options: { name: string; slots: SlotColor[] }): Vessel {
    return new Vessel(this.generateId(), options.name, options.slots)
  }

  private constructor(
    public id: string,

    /** 献器の名前 */
    public name: string,

    /** スロットの色 */
    public slots: SlotColor[],
  ) {}
}

/** 共通の献器 */
const sharedVessels = [
  Vessel.new({
    name: '黄金樹の聖杯',
    slots: [SlotColor.Yellow, SlotColor.Yellow, SlotColor.Yellow],
  }),
  Vessel.new({
    name: '霊樹の聖杯',
    slots: [SlotColor.Green, SlotColor.Green, SlotColor.Green],
  }),
  Vessel.new({
    name: '巨人樹の聖杯',
    slots: [SlotColor.Blue, SlotColor.Blue, SlotColor.Blue],
  }),
]

/** 追跡者の献器 */
const WylderVessels = [
  Vessel.new({
    name: '追跡者の器',
    slots: [SlotColor.Red, SlotColor.Red, SlotColor.Blue],
  }),
  Vessel.new({
    name: '追跡者の盃',
    slots: [SlotColor.Yellow, SlotColor.Green, SlotColor.Green],
  }),
  Vessel.new({
    name: '追跡者の高杯',
    slots: [SlotColor.Red, SlotColor.Yellow, SlotColor.Free],
  }),
  Vessel.new({
    name: '煤けた追跡者の器',
    slots: [SlotColor.Blue, SlotColor.Blue, SlotColor.Yellow],
  }),
  Vessel.new({
    name: '封じられた追跡者の器',
    slots: [SlotColor.Blue, SlotColor.Red, SlotColor.Red],
  }),
]

/** 守護者の献器 */
const GuardianVessels = [
  Vessel.new({
    name: '守護者の器',
    slots: [SlotColor.Red, SlotColor.Yellow, SlotColor.Yellow],
  }),
  Vessel.new({
    name: '守護者の盃',
    slots: [SlotColor.Blue, SlotColor.Blue, SlotColor.Green],
  }),
  Vessel.new({
    name: '守護者の高杯',
    slots: [SlotColor.Blue, SlotColor.Yellow, SlotColor.Free],
  }),
  Vessel.new({
    name: '煤けた守護者の器',
    slots: [SlotColor.Red, SlotColor.Green, SlotColor.Green],
  }),
  Vessel.new({
    name: '封じられた守護者の器',
    slots: [SlotColor.Yellow, SlotColor.Yellow, SlotColor.Red],
  }),
]

/** 鉄の目の献器 */
const IroneyeVessels = [
  Vessel.new({
    name: '鉄の目の器',
    slots: [SlotColor.Yellow, SlotColor.Green, SlotColor.Green],
  }),
  Vessel.new({
    name: '鉄の目の盃',
    slots: [SlotColor.Red, SlotColor.Blue, SlotColor.Yellow],
  }),
  Vessel.new({
    name: '鉄の目の高杯',
    slots: [SlotColor.Red, SlotColor.Green, SlotColor.Free],
  }),
  Vessel.new({
    name: '煤けた鉄の目の器',
    slots: [SlotColor.Blue, SlotColor.Yellow, SlotColor.Yellow],
  }),
  Vessel.new({
    name: '封じられた鉄の目の器',
    slots: [SlotColor.Green, SlotColor.Green, SlotColor.Yellow],
  }),
]

/** レディの献器 */
const DuchessVessels = [
  Vessel.new({
    name: 'レディの器',
    slots: [SlotColor.Red, SlotColor.Blue, SlotColor.Blue],
  }),
  Vessel.new({
    name: 'レディの盃',
    slots: [SlotColor.Yellow, SlotColor.Yellow, SlotColor.Green],
  }),
  Vessel.new({
    name: 'レディの高杯',
    slots: [SlotColor.Blue, SlotColor.Yellow, SlotColor.Free],
  }),
  Vessel.new({
    name: '煤けたレディの器',
    slots: [SlotColor.Red, SlotColor.Red, SlotColor.Green],
  }),
  Vessel.new({
    name: '封じられたレディの器',
    slots: [SlotColor.Blue, SlotColor.Blue, SlotColor.Red],
  }),
]

/** 無頼漢の献器 */
const RaiderVessels = [
  Vessel.new({
    name: '無頼漢の器',
    slots: [SlotColor.Red, SlotColor.Green, SlotColor.Green],
  }),
  Vessel.new({
    name: '無頼漢の盃',
    slots: [SlotColor.Red, SlotColor.Blue, SlotColor.Yellow],
  }),
  Vessel.new({
    name: '無頼漢の高杯',
    slots: [SlotColor.Red, SlotColor.Red, SlotColor.Free],
  }),
  Vessel.new({
    name: '煤けた無頼漢の器',
    slots: [SlotColor.Blue, SlotColor.Blue, SlotColor.Green],
  }),
  Vessel.new({
    name: '封じられた無頼漢の器',
    slots: [SlotColor.Green, SlotColor.Green, SlotColor.Red],
  }),
]

/** 復讐者の献器 */
const RevenantVessels = [
  Vessel.new({
    name: '復讐者の器',
    slots: [SlotColor.Blue, SlotColor.Blue, SlotColor.Yellow],
  }),
  Vessel.new({
    name: '復讐者の盃',
    slots: [SlotColor.Red, SlotColor.Red, SlotColor.Green],
  }),
  Vessel.new({
    name: '復讐者の高杯',
    slots: [SlotColor.Blue, SlotColor.Green, SlotColor.Free],
  }),
  Vessel.new({
    name: '煤けた復讐者の器',
    slots: [SlotColor.Red, SlotColor.Yellow, SlotColor.Yellow],
  }),
  Vessel.new({
    name: '封じられた復讐者の器',
    slots: [SlotColor.Yellow, SlotColor.Blue, SlotColor.Blue],
  }),
]

/** 隠者の献器 */
const RecluseVessels = [
  Vessel.new({
    name: '隠者の器',
    slots: [SlotColor.Blue, SlotColor.Blue, SlotColor.Green],
  }),
  Vessel.new({
    name: '隠者の盃',
    slots: [SlotColor.Red, SlotColor.Blue, SlotColor.Yellow],
  }),
  Vessel.new({
    name: '隠者の高杯',
    slots: [SlotColor.Yellow, SlotColor.Green, SlotColor.Free],
  }),
  Vessel.new({
    name: '煤けた隠者の器',
    slots: [SlotColor.Red, SlotColor.Red, SlotColor.Yellow],
  }),
  Vessel.new({
    name: '封じられた隠者の器',
    slots: [SlotColor.Green, SlotColor.Blue, SlotColor.Blue],
  }),
]

/** 執行者の献器 */
const ExecutorVessels = [
  Vessel.new({
    name: '執行者の器',
    slots: [SlotColor.Red, SlotColor.Yellow, SlotColor.Yellow],
  }),
  Vessel.new({
    name: '執行者の盃',
    slots: [SlotColor.Red, SlotColor.Blue, SlotColor.Green],
  }),
  Vessel.new({
    name: '執行者の高杯',
    slots: [SlotColor.Blue, SlotColor.Yellow, SlotColor.Free],
  }),
  Vessel.new({
    name: '煤けた執行者の器',
    slots: [SlotColor.Red, SlotColor.Red, SlotColor.Blue],
  }),
  Vessel.new({
    name: '封じられた執行者の器',
    slots: [SlotColor.Yellow, SlotColor.Yellow, SlotColor.Red],
  }),
]

export const vesselsByCharacterMap = {
  [characterMap.wylder.id]: [...WylderVessels, ...sharedVessels],
  [characterMap.guardian.id]: [...GuardianVessels, ...sharedVessels],
  [characterMap.ironeye.id]: [...IroneyeVessels, ...sharedVessels],
  [characterMap.duchess.id]: [...DuchessVessels, ...sharedVessels],
  [characterMap.raider.id]: [...RaiderVessels, ...sharedVessels],
  [characterMap.revenant.id]: [...RevenantVessels, ...sharedVessels],
  [characterMap.recluse.id]: [...RecluseVessels, ...sharedVessels],
  [characterMap.executor.id]: [...ExecutorVessels, ...sharedVessels],
}
