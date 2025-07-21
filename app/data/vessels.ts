import { RelicColor } from './relics'

/**
 * 器・杯・高杯・聖杯の定義
 */
export class Vessel {
  static new(options: { name: string; slots: RelicColor[] }): Vessel {
    return new Vessel(options.name, options.slots)
  }

  private constructor(
    /** 器の名前 */
    public name: string,

    /** スロットの色 */
    public slots: RelicColor[],
  ) { }
}

/** 共通の器 */
const sharedVessels = [
  Vessel.new({
    name: '黄金樹の聖杯',
    slots: [RelicColor.Yellow, RelicColor.Yellow, RelicColor.Yellow],
  }),
  Vessel.new({
    name: '霊樹の聖杯',
    slots: [RelicColor.Green, RelicColor.Green, RelicColor.Green],
  }),
  Vessel.new({
    name: '巨人樹の聖杯',
    slots: [RelicColor.Blue, RelicColor.Blue, RelicColor.Blue],
  }),
]

/** 追跡者の器 */
const WylderVessels = [
  Vessel.new({
    name: '追跡者の器',
    slots: [RelicColor.Red, RelicColor.Red, RelicColor.Blue],
  }),
  Vessel.new({
    name: '追跡者の盃',
    slots: [RelicColor.Yellow, RelicColor.Green, RelicColor.Green],
  }),
  Vessel.new({
    name: '追跡者の高杯',
    slots: [RelicColor.Red, RelicColor.Yellow, RelicColor.Free],
  }),
  Vessel.new({
    name: '煤けた追跡者の器',
    slots: [RelicColor.Blue, RelicColor.Blue, RelicColor.Yellow],
  }),
  Vessel.new({
    name: '封じられた追跡者の器',
    slots: [RelicColor.Blue, RelicColor.Red, RelicColor.Red],
  }),
]

/** 守護者の器 */
const GuardianVessels = [
  Vessel.new({
    name: '守護者の器',
    slots: [RelicColor.Red, RelicColor.Yellow, RelicColor.Yellow],
  }),
  Vessel.new({
    name: '守護者の盃',
    slots: [RelicColor.Blue, RelicColor.Blue, RelicColor.Green],
  }),
  Vessel.new({
    name: '守護者の高杯',
    slots: [RelicColor.Blue, RelicColor.Yellow, RelicColor.Free],
  }),
  Vessel.new({
    name: '煤けた守護者の器',
    slots: [RelicColor.Red, RelicColor.Green, RelicColor.Green],
  }),
  Vessel.new({
    name: '封じられた守護者の器',
    slots: [RelicColor.Yellow, RelicColor.Yellow, RelicColor.Red],
  }),
]

/** 鉄の目の器 */
const IroneyeVessels = [
  Vessel.new({
    name: '鉄の目の器',
    slots: [RelicColor.Yellow, RelicColor.Green, RelicColor.Green],
  }),
  Vessel.new({
    name: '鉄の目の盃',
    slots: [RelicColor.Red, RelicColor.Blue, RelicColor.Yellow],
  }),
  Vessel.new({
    name: '鉄の目の高杯',
    slots: [RelicColor.Red, RelicColor.Green, RelicColor.Free],
  }),
  Vessel.new({
    name: '煤けた鉄の目の器',
    slots: [RelicColor.Blue, RelicColor.Yellow, RelicColor.Yellow],
  }),
  Vessel.new({
    name: '封じられた鉄の目の器',
    slots: [RelicColor.Green, RelicColor.Green, RelicColor.Yellow],
  }),
]

/** レディの器 */
const DuchessVessels = [
  Vessel.new({
    name: 'レディの器',
    slots: [RelicColor.Red, RelicColor.Blue, RelicColor.Blue],
  }),
  Vessel.new({
    name: 'レディの盃',
    slots: [RelicColor.Yellow, RelicColor.Yellow, RelicColor.Green],
  }),
  Vessel.new({
    name: 'レディの高杯',
    slots: [RelicColor.Blue, RelicColor.Yellow, RelicColor.Free],
  }),
  Vessel.new({
    name: '煤けたレディの器',
    slots: [RelicColor.Red, RelicColor.Red, RelicColor.Green],
  }),
  Vessel.new({
    name: '封じられたレディの器',
    slots: [RelicColor.Blue, RelicColor.Blue, RelicColor.Red],
  }),
]

/** 無頼漢の器 */
const RaiderVessels = [
  Vessel.new({
    name: '無頼漢の器',
    slots: [RelicColor.Red, RelicColor.Green, RelicColor.Green],
  }),
  Vessel.new({
    name: '無頼漢の盃',
    slots: [RelicColor.Red, RelicColor.Blue, RelicColor.Yellow],
  }),
  Vessel.new({
    name: '無頼漢の高杯',
    slots: [RelicColor.Red, RelicColor.Red, RelicColor.Free],
  }),
  Vessel.new({
    name: '煤けた無頼漢の器',
    slots: [RelicColor.Blue, RelicColor.Blue, RelicColor.Green],
  }),
  Vessel.new({
    name: '封じられた無頼漢の器',
    slots: [RelicColor.Green, RelicColor.Green, RelicColor.Red],
  }),
]

/** 復讐者の器 */
const RevenantVessels = [
  Vessel.new({
    name: '復讐者の器',
    slots: [RelicColor.Blue, RelicColor.Blue, RelicColor.Yellow],
  }),
  Vessel.new({
    name: '復讐者の盃',
    slots: [RelicColor.Red, RelicColor.Red, RelicColor.Green],
  }),
  Vessel.new({
    name: '復讐者の高杯',
    slots: [RelicColor.Blue, RelicColor.Green, RelicColor.Free],
  }),
  Vessel.new({
    name: '煤けた復讐者の器',
    slots: [RelicColor.Red, RelicColor.Yellow, RelicColor.Yellow],
  }),
  Vessel.new({
    name: '封じられた復讐者の器',
    slots: [RelicColor.Yellow, RelicColor.Blue, RelicColor.Blue],
  }),
]

/** 隠者の器 */
const RecluseVessels = [
  Vessel.new({
    name: '隠者の器',
    slots: [RelicColor.Blue, RelicColor.Blue, RelicColor.Green],
  }),
  Vessel.new({
    name: '隠者の盃',
    slots: [RelicColor.Red, RelicColor.Blue, RelicColor.Yellow],
  }),
  Vessel.new({
    name: '隠者の高杯',
    slots: [RelicColor.Yellow, RelicColor.Green, RelicColor.Free],
  }),
  Vessel.new({
    name: '煤けた隠者の器',
    slots: [RelicColor.Red, RelicColor.Red, RelicColor.Yellow],
  }),
  Vessel.new({
    name: '封じられた隠者の器',
    slots: [RelicColor.Green, RelicColor.Blue, RelicColor.Blue],
  }),
]

/** 執行者の器 */
const ExecutorVessels = [
  Vessel.new({
    name: '執行者の器',
    slots: [RelicColor.Red, RelicColor.Yellow, RelicColor.Yellow],
  }),
  Vessel.new({
    name: '執行者の盃',
    slots: [RelicColor.Red, RelicColor.Blue, RelicColor.Green],
  }),
  Vessel.new({
    name: '執行者の高杯',
    slots: [RelicColor.Blue, RelicColor.Yellow, RelicColor.Free],
  }),
  Vessel.new({
    name: '煤けた執行者の器',
    slots: [RelicColor.Red, RelicColor.Red, RelicColor.Blue],
  }),
  Vessel.new({
    name: '封じられた執行者の器',
    slots: [RelicColor.Yellow, RelicColor.Yellow, RelicColor.Red],
  }),
]

export const vesselsByCharacterMap: Record<string, Vessel[]> = {
  ['追跡者']: [...WylderVessels, ...sharedVessels],
  ['守護者']: [...GuardianVessels, ...sharedVessels],
  ['鉄の目']: [...IroneyeVessels, ...sharedVessels],
  ['レディ']: [...DuchessVessels, ...sharedVessels],
  ['無頼漢']: [...RaiderVessels, ...sharedVessels],
  ['復讐者']: [...RevenantVessels, ...sharedVessels],
  ['隠者']: [...RecluseVessels, ...sharedVessels],
  ['執行者']: [...ExecutorVessels, ...sharedVessels],
}
