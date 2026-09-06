import { HEADLINES } from '@/data/pools'
import type { Persona } from '@/data/personas'
import type { SceneConfig } from '@/data/scenes'
import type { DrawnCard, Orientation } from '@/data/types'
import { pick, mulberry32 } from '@/lib/rng'
import { BAN_WEI_SUFFIX, DO_POOL, DONT_POOL, LUCK_POOL } from '@/data/pools'

export interface ReadingSection {
  key: string
  label: string
  body: string[]
  cardIndex?: number
}

export interface Banwei {
  index: number
  suffix: string
  doList: string[]
  dontList: string[]
}

export interface Verdict {
  support: number
  risk: string
}

export interface Reading {
  seed: number
  sceneId: string
  personaId: string
  question: string
  headline: string
  tagline: string
  sections: ReadingSection[]
  action: string
  luck: string
  banwei?: Banwei
  verdict?: Verdict
  reply?: string
  cards: DrawnCard[]
  mode: 'local' | 'llm'
}

function orient(card: DrawnCard): Orientation {
  return card.reversed ? 'rev' : 'up'
}

/** 引用用户问题前清理尾部标点与空白，避免「…挺清闲啊？，」这类拼接 */
function cleanQuote(q: string, max = 18): string {
  const t = q.trim().replace(/[？?！!。，,.\s]+$/g, '')
  if (!t) return '对方的意思'
  return t.length > max ? t.slice(0, max) + '…' : t
}

const REPLY_TEMPLATES = [
  '「收到，我理解您的意思是{X}，我先按这个方向推进，有偏差您随时纠。」',
  '「好的，这块我排个优先级：现有需求我先把交付做稳，新的事项我们拉个会明确下范围。」',
  '「明白，我先自查一下产出节奏，明天给您一个具体的计划表。」',
  '「哈哈好的，那我把手头这几件事按紧急度过一遍，您看哪个优先？」',
]

const WORK_HUMOR = [
  '下班这件事，看的是排版不是排面——到点收拾东西，比什么都准。',
  '建议把「准点下班」写进今日 KPI，完成率看你自己。',
  '工位是租的，人生是自己的，到点就跑不寒碜。',
]

const COLD_WATER = [
  '冷水来了：真正想回应你的人，不需要你打草稿。',
  '把问题换成「我值得这样的热情吗」，答案会清楚很多。',
  '你缺的不是他的一条消息，是一个能让自己下线的开关。',
  '执念是高利贷，你付的是当下的每一分钟。',
]

const GENERIC_ASK = [
  '这个问题，牌面的答案是：先解决情绪，再解决事情。',
  '用你抽到的这张牌的劲头去干，答案会自己浮出来。',
  '小事听脑子，大事听心，纠结的事听时间。',
  '你已经有倾向了，来问只是想有人给你盖个章——盖了。',
]

/** 本地解读引擎：牌意 × 场景插槽 × 人格语气 三层拼装 */
export function composeReading(
  scene: SceneConfig,
  persona: Persona,
  cards: DrawnCard[],
  seed: number,
  question = '',
): Reading {
  const rand = mulberry32(seed)
  const opener = pick(rand, persona.openers)
  const reaction = pick(rand, persona.reactions)
  const closer = pick(rand, persona.closers)
  const adviceLead = pick(rand, persona.adviceLead)
  const headline = pick(rand, HEADLINES[scene.id] ?? HEADLINES.daily)
  const o = (i: number) => orient(cards[i] ?? cards[0])

  const reading: Reading = {
    seed,
    sceneId: scene.id,
    personaId: persona.id,
    question,
    headline,
    tagline: '',
    sections: [],
    action: '',
    luck: pick(rand, LUCK_POOL),
    cards,
    mode: 'local',
  }

  if (scene.id === 'daily') {
    const c = cards[0]
    const index = 55 + Math.floor(rand() * 41)
    reading.tagline = `${opener} ${c.card.tone[o(0)]}`
    reading.banwei = {
      index,
      suffix: pick(rand, BAN_WEI_SUFFIX),
      doList: pickManyImpl(rand, DO_POOL, 2),
      dontList: pickManyImpl(rand, DONT_POOL, 2),
    }
    reading.sections = [
      { key: 'card', label: '今日牌面', body: [reaction, c.card.insight[o(0)]], cardIndex: 0 },
    ]
    reading.sections[0].body.push(closer)
    reading.action = `${adviceLead}${c.card.action[o(0)]}`
  } else if (scene.id === 'translate') {
    const [a, b, c] = cards
    reading.tagline = `${opener} ${a.card.tone[o(0)]}`
    reading.sections = [
      {
        key: 'surface',
        label: scene.spread.positions[0].label,
        body: [`这句话听上去的画风：${a.card.tone[o(0)]}`, a.card.insight[o(0)]],
        cardIndex: 0,
      },
      {
        key: 'real',
        label: scene.spread.positions[1].label,
        body: [reaction, b.card.insight[o(1)], `关键词：${b.card.keywords[o(1)].slice(0, 2).join(' · ')}`],
        cardIndex: 1,
      },
      {
        key: 'play',
        label: scene.spread.positions[2].label,
        body: [`${adviceLead}${c.card.action[o(2)]}`],
        cardIndex: 2,
      },
    ]
    reading.reply = pick(rand, REPLY_TEMPLATES).replace('{X}', cleanQuote(question))
    // 应对打法段落已含完整建议，不再重复渲染 ACTION 面板
    reading.action = ''
  } else if (scene.id === 'crush') {
    const [a, b, c] = cards
    reading.tagline = `${opener} ${b.card.tone[o(1)]}`
    reading.sections = [
      { key: 'state', label: scene.spread.positions[0].label, body: [a.card.tone[o(0)], a.card.insight[o(0)]], cardIndex: 0 },
      { key: 'feeling', label: scene.spread.positions[1].label, body: [reaction, b.card.insight[o(1)]], cardIndex: 1 },
      { key: 'future', label: scene.spread.positions[2].label, body: [c.card.tone[o(2)], c.card.insight[o(2)]], cardIndex: 2 },
    ]
    reading.action = `${adviceLead}${b.card.action[o(1)]}`
  } else {
    // decide
    const c = cards[0]
    const up = !c.reversed
    const support = up ? 62 + Math.floor(rand() * 27) : 34 + Math.floor(rand() * 25)
    reading.tagline = `${opener} ${c.card.tone[o(0)]}`
    reading.verdict = {
      support,
      risk: `风险点：${c.card.keywords[o(0)][1] ?? c.card.keywords[o(0)][0]}${up ? '，注意分寸' : '，先稳住'}`,
    }
    reading.sections = [{ key: 'verdict', label: '天平裁决', body: [reaction, c.card.insight[o(0)]], cardIndex: 0 }]
    reading.sections[0].body.push(closer)
    reading.action = `${adviceLead}${c.card.action[o(0)]}`
  }

  return reading
}

function pickManyImpl<T>(rand: () => number, arr: readonly T[], n: number): T[] {
  const pool = [...arr]
  const out: T[] = []
  for (let i = 0; i < n && pool.length; i++) out.push(pool.splice(Math.floor(rand() * pool.length), 1)[0])
  return out
}

/** 深潜追问（本地轨）：按意图意图匹配应答 */
export function composeFollowUp(question: string, reading: Reading, persona: Persona, rand: () => number = Math.random): string {
  const q = question.trim()
  let core: string
  if (/回|微信|消息|怎么答|怎么回/.test(q)) {
    core = pick(rand, REPLY_TEMPLATES).replace('{X}', reading.question ? reading.question.slice(0, 14) : '对方')
  } else if (/下班|摸鱼|加班|准点/.test(q)) {
    core = pick(rand, WORK_HUMOR)
  } else if (/海王|还有救|复合|回头|断联|放弃|值得吗/.test(q)) {
    core = pick(rand, COLD_WATER)
  } else if (/后悔|风险|亏/.test(q)) {
    core = reading.verdict ? reading.verdict.risk : '把最坏结果写下来看看——它没你想的那么重，但你大脑把它放大了三倍。'
  } else {
    core = pick(rand, GENERIC_ASK)
  }
  const close = pick(rand, persona.closers)
  return `${core} ${close}`
}
