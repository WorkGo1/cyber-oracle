import type { SceneId } from './types'

export type InputType = 'none' | 'text' | 'problem'

export interface SceneConfig {
  id: SceneId
  name: string
  short: string
  subtitle: string
  desc: string
  accent: 'acid' | 'cyan' | 'magenta' | 'gold'
  motifTag: string // HUD 标签文案
  inputType: InputType
  inputLabel: string
  inputHint: string
  examples: string[]
  spread: { count: number; positions: { key: string; label: string }[] }
  quickAsks: string[]
  dailyLimit?: boolean
}

/** 场景注册表：MVP 四场景；新增场景只改这里 */
export const SCENES: SceneConfig[] = [
  {
    id: 'daily',
    name: '打工人班味运势',
    short: '班味运势',
    subtitle: '每日一抽 · 免费解压',
    desc: '今日班味指数、宜忌清单、扎心但治愈的行动指引，一张牌讲明白。',
    accent: 'acid',
    motifTag: 'DAILY BREW',
    inputType: 'none',
    inputLabel: '',
    inputHint: '',
    examples: [],
    spread: { count: 1, positions: [{ key: 'today', label: '今日能量' }] },
    quickAsks: ['今天能准点下班吗？', '宜忌里哪条最灵？', '给我一句发疯文学'],
    dailyLimit: true,
  },
  {
    id: 'translate',
    name: '老板潜台词翻译器',
    short: '潜台词翻译',
    subtitle: '职场生存 · 话术拆解',
    desc: '把老板/同事那句阴阳怪气丢进来，三张牌翻译表面态度、真实想法和应对打法。',
    accent: 'cyan',
    motifTag: 'SUBTEXT SCAN',
    inputType: 'text',
    inputLabel: '那句让你琢磨半天的话是？',
    inputHint: '例：「你最近工作挺清闲啊？」',
    examples: ['这个方案你再想想', '你最近工作挺清闲啊？', '辛苦了，这边再帮个忙', '有时间吗？聊两句'],
    spread: {
      count: 3,
      positions: [
        { key: 'surface', label: '表面态度' },
        { key: 'real', label: '真实潜台词' },
        { key: 'play', label: '应对打法' },
      ],
    },
    quickAsks: ['那我该怎么回他微信？', '这话要不要当真？', '帮我拟一条高情商回复'],
  },
  {
    id: 'crush',
    name: 'Crush意图探针',
    short: 'Crush探针',
    subtitle: '恋爱脑自救 · 意图扫描',
    desc: '他到底怎么想的？三张牌扫描：他现在的状态、对你的真实感受、走向与阻碍。',
    accent: 'magenta',
    motifTag: 'HEART SCAN',
    inputType: 'text',
    inputLabel: 'ta最近做了什么让你纠结的事？（可跳过）',
    inputHint: '例：消息回得越来越慢，但朋友圈秒赞我',
    examples: ['已读不回但秒赞我朋友圈', '每次都是我主动找ta', '说忙但给别人的动态评论', '见面很热情，线上很冷淡'],
    spread: {
      count: 3,
      positions: [
        { key: 'state', label: 'ta现在的状态' },
        { key: 'feeling', label: '对你的真实感受' },
        { key: 'future', label: '走向与阻碍' },
      ],
    },
    quickAsks: ['我该主动发消息吗？', 'ta是不是纯海王？', '给我泼盆冷水吧'],
  },
  {
    id: 'decide',
    name: '决策天平',
    short: '决策天平',
    subtitle: '纠结星人 · 赛博抛硬币',
    desc: '要不要买？要不要去？把问题抛进来，一张牌给出倾向支持率和风险提示。',
    accent: 'gold',
    motifTag: 'BALANCE',
    inputType: 'problem',
    inputLabel: '你在纠结什么？',
    inputHint: '例：要不要买这件399的外套',
    examples: ['要不要冲动消费买这件衣服', '今晚要不要去社交局', '要不要回复那条消息', '周末要不要回家'],
    spread: { count: 1, positions: [{ key: 'verdict', label: '天平裁决' }] },
    quickAsks: ['如果买了会后悔吗？', '风险点到底在哪？', '给我一个不做它的理由'],
  },
]

export function sceneById(id: string): SceneConfig | undefined {
  return SCENES.find((s) => s.id === id)
}

export const SCENE_ACCENT_VAR: Record<SceneConfig['accent'], string> = {
  acid: '--c-acid',
  cyan: '--c-cyan',
  magenta: '--c-magenta',
  gold: '--c-gold',
}
