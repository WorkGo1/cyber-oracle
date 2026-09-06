import type { Persona } from '@/data/personas'
import type { SceneConfig } from '@/data/scenes'
import type { DrawnCard } from '@/data/types'

export interface LLMConfig {
  baseUrl: string
  apiKey: string
  model: string
}

export const DEFAULT_LLM: LLMConfig = { baseUrl: '', apiKey: '', model: 'gpt-4o-mini' }

export function isLLMReady(cfg: LLMConfig): boolean {
  return Boolean(cfg.baseUrl && cfg.apiKey && cfg.model)
}

function cardBrief(cards: DrawnCard[]): string {
  return cards
    .map((d, i) => `${i +1}. ${d.card.name}（${d.reversed ? '逆位' : '正位'}）— 关键词：${d.card.keywords[d.reversed ? 'rev' : 'up'].slice(0, 3).join('、')}`)
    .join('\n')
}

/** 组装系统提示词：人格 × 场景 × 牌面（结构参照 Vision Prompt 模板） */
export function buildSystemPrompt(persona: Persona, scene: SceneConfig, cards: DrawnCard[]): string {
  const slots =
    scene.id === 'daily'
      ? '1.【牌面一句话定调】 2.【现状剖析】 3.【行动指引】'
      : scene.spread.positions.map((p, i) => `${i + 1}.【${p.label}】`).join(' ') +
        ' ' +
        (scene.id === 'translate' ? '4.【高情商回复示例】' : scene.id === 'decide' ? '再给一个倾向支持率（%）与风险点' : '')
  return [
    `# Role\n${persona.systemPrompt}\n你精通塔罗象征学与当代青年心理学，服务对象是约2000年前后出生的中国年轻打工人/学生。`,
    `# 调性\n人话 + 轻互联网热梗 + 心理学共情。拒绝晦涩传统神秘学术语（不得出现"圣杯三预示"这类表述，用牌名+人话）。拒绝说教。毒舌不伤人，治愈不灌汤。`,
    `# Context\n场景：${scene.name}（${scene.subtitle}）。\n用户的问题/输入：${'{question}'}\n抽到的牌：\n${cardBrief(cards)}`,
    `# Output Requirements\n${slots}\n最后单独一行以「幸运补给：」开头，给一个具体的今日转运小彩蛋（如：喝一杯少糖乌龙茶、对老板已读不回5分钟）。\n# 排版规则（必须遵守）\n- 每个小节的标题行单独成行，格式为【标题】（如【表面态度】），不要用 Markdown 的 **、#、-、1. 等符号\n- 正文用短段落，段落间空行；不要输出列表符号、表格、代码块\n- 全文200-350字`,
  ].join('\n\n')
}

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ParsedLLMReading {
  tagline: string
  sections: { key: string; label: string; body: string[] }[]
  luck?: string
}

/** 行首标题模式：【标签】 / **标签** / ### 标签（可带 1. 编号与冒号）（LLM 常无视格式指令返回 Markdown） */
const HEADER_RE = [
  /^【(.+?)】\s*(.*)$/,
  /^\*\*(.+?)\*\*\s*[:：]?\s*(.*)$/,
  /^#{1,4}\s+(.+?)\s*[:：]?\s*(.*)$/,
]

function cleanLine(s: string): string {
  return s.replace(/\*\*/g, '').replace(/`/g, '').trim()
}

/** 把 LLM 输出解析回结构化解读；兼容【】与 Markdown 标题，无标签时整段兜底 */
export function parseStructuredReading(text: string): ParsedLLMReading {
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
  const sections: ParsedLLMReading['sections'] = []
  const preamble: string[] = []
  let luck: string | undefined
  for (const rawLine of lines) {
    const raw = rawLine.replace(/^\d+\s*[.、)]\s*/, '') // 去编号前缀
    const plain = cleanLine(raw)
    if (/^幸运补给[:：]?/.test(plain)) {
      luck = plain.replace(/^幸运补给[:：]\s*/, '') || undefined
      continue
    }
    let matched = false
    for (const re of HEADER_RE) {
      const m = raw.match(re)
      if (m) {
        const label = cleanLine(m[1])
        const rest = m[2] ? cleanLine(m[2]) : ''
        // 幸运补给若以标题行形式出现，其后内容并入 luck
        if (/幸运补给/.test(label)) {
          luck = rest || luck || undefined
        } else {
          sections.push({ key: `llm-${sections.length}`, label, body: rest ? [rest] : [] })
        }
        matched = true
        break
      }
    }
    if (matched) continue
    if (sections.length === 0) preamble.push(plain)
    else sections[sections.length - 1].body.push(plain)
  }
  const tagline = (preamble[0] ?? sections[0]?.body[0] ?? '').slice(0, 60)
  return { tagline, sections, luck }
}

/** LLM 请求超时：2 分钟（慢模型/长解读也够用） */
export const LLM_TIMEOUT_MS = 120000

/** OpenAI 兼容 chat/completions 调用；失败抛错由上层降级本地轨 */
export async function llmChat(cfg: LLMConfig, messages: LLMMessage[], timeoutMs: number = LLM_TIMEOUT_MS): Promise<string> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const url = cfg.baseUrl.replace(/\/+$/, '') + '/chat/completions'
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cfg.apiKey}`,
      },
      body: JSON.stringify({
        model: cfg.model,
        messages,
        temperature: 0.9,
        max_tokens: 800,
      }),
      signal: ctrl.signal,
    })
    if (!res.ok) throw new Error(`LLM HTTP ${res.status}`)
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] }
    const text = data.choices?.[0]?.message?.content?.trim()
    if (!text) throw new Error('LLM 空响应')
    return text
  } finally {
    clearTimeout(timer)
  }
}
