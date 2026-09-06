import { MAJORS } from './majors'
import { RANKS, SUITS } from './minors'
import type { Orientation, TarotCard } from './types'

export const MINOR_CN = { wands: '权杖', cups: '圣杯', swords: '宝剑', pentacles: '星币' } as const

function buildMinor(suitId: 'wands' | 'cups' | 'swords' | 'pentacles', rank: number): TarotCard {
  const suit = SUITS.find((s) => s.id === suitId)!
  const rankData = RANKS[rank - 1]
  return {
    id: `${suitId}-${String(rank).padStart(2, '0')}`,
    arcana: 'minor',
    name: `${MINOR_CN[suitId]}${rank === 1 ? 'A' : ['二', '三', '四', '五', '六', '七', '八', '九', '十', '侍从', '骑士', '王后', '国王'][rank - 2]}`,
    latin: `${suitId.charAt(0).toUpperCase() + suitId.slice(1)} ${rankData.label}`,
    roman: rankData.label,
    motif: suit.motif,
    suit: suitId,
    rank,
    keywords: {
      up: [...suit.keywords.up, rankData.title],
      rev: [...suit.keywords.rev, rankData.title],
    },
    tone: {
      up: `${rankData.up}——${suit.tone.up}`,
      rev: `${rankData.rev}，${suit.tone.rev}`,
    },
    insight: {
      up: `${suit.insight.up}（当前议题：${rankData.title}）`,
      rev: `${suit.insight.rev}（当前议题：${rankData.title}）`,
    },
    action: suit.action,
  }
}

export const DECK: TarotCard[] = [
  ...MAJORS.map((m): TarotCard => ({ ...m, arcana: 'major' })),
  ...(['wands', 'cups', 'swords', 'pentacles'] as const).flatMap((s) =>
    Array.from({ length: 14 }, (_, i) => buildMinor(s, i + 1)),
  ),
]

export function cardById(id: string): TarotCard | undefined {
  return DECK.find((c) => c.id === id)
}

export function cardKeywords(card: TarotCard, orientation: Orientation): string[] {
  return card.keywords[orientation]
}
