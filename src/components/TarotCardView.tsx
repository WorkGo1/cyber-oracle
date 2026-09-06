import type { ReactNode } from 'react'
import type { Motif } from '@/data/types'

export type AccentName = 'acid' | 'magenta' | 'cyan' | 'gold' | 'violet' | 'danger'

const ACCENTS: Record<AccentName, string> = {
  acid: '#C8FF1E',
  magenta: '#FF3DB4',
  cyan: '#22E4FF',
  gold: '#FFC838',
  violet: '#8B5CF6',
  danger: '#FF4D5E',
}

/** 大阿尔卡纳专属配色：按牌义情绪分配 */
export const MAJOR_ACCENT: Record<string, AccentName> = {
  fool: 'acid', magician: 'cyan', priestess: 'violet', empress: 'magenta',
  emperor: 'gold', hierophant: 'cyan', lovers: 'magenta', chariot: 'acid',
  strength: 'gold', hermit: 'violet', wheel: 'cyan', justice: 'gold',
  hanged: 'violet', death: 'danger', temperance: 'cyan', devil: 'danger',
  tower: 'danger', star: 'cyan', moon: 'violet', sun: 'gold',
  judgement: 'acid', world: 'gold',
}

export const SUIT_ACCENT: Record<string, AccentName> = {
  wands: 'acid', cups: 'magenta', swords: 'cyan', pentacles: 'gold',
}

/* ---------- 花色符文 ---------- */
function WandGlyph({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <line x1={-6} y1={8} x2={6} y2={-8} stroke="currentColor" strokeWidth={1.6} />
      <path d="M 2 -6 Q 8 -10 10 -4" fill="none" stroke="currentColor" strokeWidth={1.2} />
      <circle cx={10} cy={-4} r={1.4} fill="currentColor" />
    </g>
  )
}
function CupGlyph({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -6 -6 L 6 -6 Q 6 2 0 4 Q -6 2 -6 -6 Z" fill="none" stroke="currentColor" strokeWidth={1.4} />
      <line x1={0} y1={4} x2={0} y2={8} stroke="currentColor" strokeWidth={1.4} />
      <line x1={-4} y1={8} x2={4} y2={8} stroke="currentColor" strokeWidth={1.4} />
    </g>
  )
}
function SwordGlyph({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <line x1={0} y1={-9} x2={0} y2={6} stroke="currentColor" strokeWidth={1.6} />
      <line x1={-5} y1={5} x2={5} y2={5} stroke="currentColor" strokeWidth={1.4} />
      <line x1={0} y1={6} x2={0} y2={9} stroke="currentColor" strokeWidth={1.4} />
    </g>
  )
}
function CoinGlyph({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r={7} fill="none" stroke="currentColor" strokeWidth={1.4} />
      <path d="M 0 -4 L 1.2 -1.2 L 4 -1.2 L 1.8 0.8 L 2.6 3.6 L 0 2 L -2.6 3.6 L -1.8 0.8 L -4 -1.2 L -1.2 -1.2 Z" fill="currentColor" />
    </g>
  )
}

/* ---------- 数字原型徽记（小阿尔卡纳 1-10 专属背纹） ---------- */
function RankEmblem({ rank }: { rank: number }) {
  const em: Record<number, ReactNode> = {
    1: <path d="M 0 14 Q -12 4 -6 -6 M 0 14 Q 12 4 6 -6 M 0 14 L 0 -12" fill="none" strokeWidth={1} strokeDasharray="3 2.5" />,
    2: <path d="M -18 -6 C -8 -14 8 2 18 -6 M -18 6 C -8 14 8 -2 18 6" fill="none" strokeWidth={1} strokeDasharray="3 2.5" />,
    3: <path d="M 0 -16 L 15 10 L -15 10 Z" fill="none" strokeWidth={1} strokeDasharray="3 2.5" />,
    4: <path d="M -14 -14 L -14 14 M 14 -14 L 14 14 M -20 -14 L -8 -14 M 8 -14 L 20 -14 M -20 14 L -8 14 M 8 14 L 20 14" fill="none" strokeWidth={1} strokeDasharray="3 2.5" />,
    5: <path d="M -18 -18 L 18 18 M 18 -18 L -18 18 M -18 0 L 18 0 M 0 -18 L 0 18" fill="none" strokeWidth={0.9} strokeDasharray="2.5 3" opacity={0.9} />,
    6: <path d="M -14 12 L 0 -2 L 14 12 M -14 0 L 0 -14 L 14 0" fill="none" strokeWidth={1} strokeDasharray="3 2.5" />,
    7: <path d="M -16 14 L 16 14 M -12 6 L 12 6 M -8 -2 L 8 -2 M -4 -10 L 4 -10" fill="none" strokeWidth={1} strokeDasharray="3 2.5" />,
    8: <path d="M 0 -16 C 12 -16 12 -4 0 -4 C -12 -4 -12 8 0 8 C 12 8 12 -4 0 -4 C -12 -4 -12 -16 0 -16 Z M 0 8 C 12 8 12 18 0 18 C -12 18 -12 8 0 8" fill="none" strokeWidth={0.9} strokeDasharray="2.5 2.5" transform="translate(0 -1)" />,
    9: <path d="M 6 0 A 12 12 0 1 0 6 14 A 15 15 0 1 1 6 0 Z" fill="none" strokeWidth={1} strokeDasharray="3 2.5" transform="translate(0 -4)" />,
    10: <path d="M -12 -18 L 12 -18 M -10 -10 L 10 -10 M -8 -2 L 8 -2 M -6 6 L 6 6 M -4 14 L 4 14 M -2 20 L 2 20" fill="none" strokeWidth={1} strokeDasharray="2.5 2.5" />,
  }
  return <g stroke="currentColor" opacity={0.28}>{em[rank]}</g>
}

/* ---------- 宫廷牌人像徽记（侍从/骑士/王后/国王） ---------- */
function CourtEmblem({ rank }: { rank: number }) {
  if (rank === 11)
    return (
      <g stroke="currentColor" fill="none">
        <circle cx={0} cy={-8} r={7} strokeWidth={1.3} />
        <path d="M -8 12 Q 0 4 8 12" strokeWidth={1.3} />
        <path d="M -12 -20 L 12 -20 M -10 -24 L 10 -24" strokeWidth={0.9} strokeDasharray="2.5 2" />
        <circle cx={-2.4} cy={-9} r={1.1} fill="currentColor" stroke="none" />
        <circle cx={2.4} cy={-9} r={1.1} fill="currentColor" stroke="none" />
      </g>
    )
  if (rank === 12)
    return (
      <g stroke="currentColor" fill="none">
        <circle cx={0} cy={-6} r={6.5} strokeWidth={1.3} />
        <path d="M -6 -8 L -14 -18 M 6 -8 L 10 -20 M -7 12 L -12 20 M 7 12 L 14 16" strokeWidth={1.2} />
        <path d="M -14 -2 L 14 -2" strokeWidth={0.9} strokeDasharray="2.5 2" />
        <path d="M -2.4 -7 L 2.4 -7 L 1.6 -4.6 L 2.8 -2.6 L -2.8 -2.6 L -1.6 -4.6 Z" fill="currentColor" stroke="none" />
      </g>
    )
  if (rank === 13)
    return (
      <g stroke="currentColor" fill="none">
        <circle cx={0} cy={-4} r={7.5} strokeWidth={1.3} />
        <path d="M -10 -10 L -12 -20 L -5 -14 L 0 -22 L 5 -14 L 12 -20 L 10 -10" strokeWidth={1.3} />
        <path d="M -9 12 Q 0 6 9 12" strokeWidth={1.3} />
        <path d="M -14 18 L 14 18" strokeWidth={0.9} strokeDasharray="2.5 2" />
        <circle cx={-2.6} cy={-5} r={1.1} fill="currentColor" stroke="none" />
        <circle cx={2.6} cy={-5} r={1.1} fill="currentColor" stroke="none" />
      </g>
    )
  return (
    <g stroke="currentColor" fill="none">
      <circle cx={0} cy={-2} r={7.5} strokeWidth={1.3} />
      <path d="M -9 -8 L -9 -18 L -4.5 -12 L 0 -20 L 4.5 -12 L 9 -18 L 9 -8" strokeWidth={1.3} />
      <path d="M -8 14 L 8 14 M -11 18 L 11 18" strokeWidth={1.3} />
      <path d="M -15 -2 L 15 -2 M -15 4 L 15 4" strokeWidth={0.8} strokeDasharray="2.5 2" opacity={0.8} />
      <circle cx={-2.6} cy={-3} r={1.1} fill="currentColor" stroke="none" />
      <circle cx={2.6} cy={-3} r={1.1} fill="currentColor" stroke="none" />
    </g>
  )
}

function pipPositions(n: number): { x: number; y: number }[] {
  const layouts: Record<number, { x: number; y: number }[]> = {
    1: [{ x: 0, y: 0 }],
    2: [{ x: -14, y: -8 }, { x: 14, y: 8 }],
    3: [{ x: 0, y: -16 }, { x: -14, y: 10 }, { x: 14, y: 10 }],
    4: [{ x: -14, y: -14 }, { x: 14, y: -14 }, { x: -14, y: 14 }, { x: 14, y: 14 }],
    5: [{ x: 0, y: 0 }, { x: -16, y: -14 }, { x: 16, y: -14 }, { x: -16, y: 14 }, { x: 16, y: 14 }],
    6: [{ x: -16, y: -16 }, { x: 16, y: -16 }, { x: -16, y: 0 }, { x: 16, y: 0 }, { x: -16, y: 16 }, { x: 16, y: 16 }],
    7: [{ x: 0, y: -20 }, { x: -16, y: -8 }, { x: 16, y: -8 }, { x: -16, y: 6 }, { x: 16, y: 6 }, { x: -8, y: 20 }, { x: 8, y: 20 }],
    8: [{ x: -16, y: -20 }, { x: 16, y: -20 }, { x: -16, y: -7 }, { x: 16, y: -7 }, { x: -16, y: 6 }, { x: 16, y: 6 }, { x: -16, y: 19 }, { x: 16, y: 19 }],
    9: [{ x: 0, y: 0 }, { x: -18, y: -18 }, { x: 0, y: -20 }, { x: 18, y: -18 }, { x: -18, y: 0 }, { x: 18, y: 0 }, { x: -18, y: 18 }, { x: 0, y: 20 }, { x: 18, y: 18 }],
    10: [{ x: -18, y: -22 }, { x: 18, y: -22 }, { x: -18, y: -8 }, { x: 18, y: -8 }, { x: 0, y: 0 }, { x: -18, y: 8 }, { x: 18, y: 8 }, { x: -18, y: 22 }, { x: 18, y: 22 }, { x: 0, y: 14 }],
  }
  if (n <= 10) return layouts[n]
  return n === 11 ? [{ x: 0, y: 10 }] : n === 12 ? [{ x: -14, y: 10 }, { x: 14, y: 10 }] : [{ x: 0, y: 14 }]
}

/** 中央符文构图：大阿尔卡纳专属 + 小阿尔卡纳（徽记 × 花色 pip × 宫廷人像）；颜色由 currentColor 提供 */
export function CardArt({ motif, pips = 0, rank = 0 }: { motif: Motif; pips?: number; rank?: number }) {
  const SuitGlyph = motif === 'wands' ? WandGlyph : motif === 'cups' ? CupGlyph : motif === 'swords' ? SwordGlyph : CoinGlyph

  if (pips > 0 && (motif === 'wands' || motif === 'cups' || motif === 'swords' || motif === 'pentacles')) {
    const pts = pipPositions(pips)
    return (
      <g>
        {rank >= 11 ? <CourtEmblem rank={rank} /> : <RankEmblem rank={rank} />}
        {pts.map((p, i) => (
          <SuitGlyph key={i} x={p.x} y={p.y} s={pips >= 8 ? 0.72 : 0.95} />
        ))}
      </g>
    )
  }

  switch (motif) {
    case 'fool':
      return (
        <g>
          <circle cx={0} cy={-14} r={9} fill="none" stroke="currentColor" strokeWidth={1.4} />
          <circle cx={-3} cy={-16} r={1.5} fill="currentColor" />
          <circle cx={3} cy={-16} r={1.5} fill="currentColor" />
          <path d="M -18 22 Q 0 6 18 20" fill="none" stroke="currentColor" strokeWidth={1.4} strokeDasharray="4 3" />
          <path d="M 18 20 L 26 30" stroke="currentColor" strokeWidth={1.4} />
          <path d="M -10 2 Q 0 -6 10 2" fill="none" stroke="currentColor" strokeWidth={1} />
          <path d="M -22 -22 L -18 -18 M 22 -22 L 18 -18" stroke="currentColor" strokeWidth={1} />
        </g>
      )
    case 'magician':
      return (
        <g>
          <path d="M 0 -18 C 12 -18 12 -6 0 -6 C -12 -6 -12 6 0 6 C 12 6 12 18 0 18 C -12 18 -12 6 0 6 C 12 6 12 -18 0 -18 Z" fill="none" stroke="currentColor" strokeWidth={1.4} />
          <line x1={0} y1={-22} x2={0} y2={24} stroke="currentColor" strokeWidth={1.2} />
          <circle cx={0} cy={-22} r={2} fill="currentColor" />
          <path d="M -20 -20 L -20 -14 M 20 -20 L 20 -14 M -20 20 L -20 14 M 20 20 L 20 14" stroke="currentColor" strokeWidth={1} />
        </g>
      )
    case 'priestess':
      return (
        <g>
          <line x1={-16} y1={-20} x2={-16} y2={20} stroke="currentColor" strokeWidth={1.4} />
          <line x1={16} y1={-20} x2={16} y2={20} stroke="currentColor" strokeWidth={1.4} />
          <path d="M -16 -14 Q 0 -26 16 -14" fill="none" stroke="currentColor" strokeWidth={1} strokeDasharray="3 2" />
          <path d="M 4 -2 A 8 8 0 1 0 4 10 A 10 10 0 1 1 4 -2 Z" fill="currentColor" opacity={0.85} />
          <path d="M -24 0 L -20 0 M 20 0 L 24 0" stroke="currentColor" strokeWidth={1} />
        </g>
      )
    case 'empress':
      return (
        <g>
          <circle cx={0} cy={-8} r={7} fill="none" stroke="currentColor" strokeWidth={1.4} />
          <line x1={0} y1={-1} x2={0} y2={16} stroke="currentColor" strokeWidth={1.4} />
          <line x1={-6} y1={8} x2={6} y2={8} stroke="currentColor" strokeWidth={1.4} />
          <path d="M -14 -18 L -7 -24 L 0 -18 L 7 -24 L 14 -18" fill="none" stroke="currentColor" strokeWidth={1.3} />
          {[[-18, -8], [18, -8], [-14, 20], [14, 20]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={1.6} fill="currentColor" />
          ))}
        </g>
      )
    case 'emperor':
      return (
        <g>
          <rect x={-14} y={-12} width={28} height={24} fill="none" stroke="currentColor" strokeWidth={1.4} />
          <line x1={-14} y1={-12} x2={14} y2={12} stroke="currentColor" strokeWidth={0.8} opacity={0.6} />
          <line x1={14} y1={-12} x2={-14} y2={12} stroke="currentColor" strokeWidth={0.8} opacity={0.6} />
          <circle cx={0} cy={0} r={4} fill="currentColor" opacity={0.9} />
          <path d="M -14 -18 L 14 -18" stroke="currentColor" strokeWidth={1.3} />
          <path d="M -10 -18 L -10 -24 M 0 -18 L 0 -26 M 10 -18 L 10 -24" stroke="currentColor" strokeWidth={1.3} />
          <path d="M -22 -8 L -18 -8 M 18 -8 L 22 -8" stroke="currentColor" strokeWidth={1} />
        </g>
      )
    case 'hierophant':
      return (
        <g>
          <line x1={0} y1={-16} x2={0} y2={16} stroke="currentColor" strokeWidth={1.5} />
          <line x1={-7} y1={-8} x2={7} y2={-8} stroke="currentColor" strokeWidth={1.4} />
          <line x1={-10} y1={0} x2={10} y2={0} stroke="currentColor" strokeWidth={1.4} />
          <circle cx={-14} cy={16} r={4} fill="none" stroke="currentColor" strokeWidth={1.2} />
          <line x1={-14} y1={20} x2={-14} y2={24} stroke="currentColor" strokeWidth={1.2} />
          <circle cx={14} cy={16} r={4} fill="none" stroke="currentColor" strokeWidth={1.2} />
          <line x1={14} y1={20} x2={14} y2={24} stroke="currentColor" strokeWidth={1.2} />
          <path d="M -8 -22 L 8 -22" stroke="currentColor" strokeWidth={1} strokeDasharray="2.5 2" />
        </g>
      )
    case 'lovers':
      return (
        <g>
          <circle cx={-8} cy={0} r={12} fill="none" stroke="currentColor" strokeWidth={1.4} />
          <circle cx={8} cy={0} r={12} fill="none" stroke="currentColor" strokeWidth={1.4} />
          <path d="M 0 16 C -4 12 -8 10 -8 5 C -8 2 -5 0 0 4 C 5 0 8 2 8 5 C 8 10 4 12 0 16 Z" fill="currentColor" opacity={0.85} />
          <path d="M -20 -18 L -8 -10 M 20 -18 L 8 -10" stroke="currentColor" strokeWidth={0.9} strokeDasharray="2.5 2" />
        </g>
      )
    case 'chariot':
      return (
        <g>
          <path d="M -14 -8 L 0 -20 L 14 -8" fill="none" stroke="currentColor" strokeWidth={1.4} />
          <circle cx={0} cy={-14} r={2.4} fill="currentColor" />
          <circle cx={-9} cy={10} r={6} fill="none" stroke="currentColor" strokeWidth={1.4} />
          <circle cx={9} cy={10} r={6} fill="none" stroke="currentColor" strokeWidth={1.4} />
          <rect x={-14} y={-8} width={28} height={10} fill="none" stroke="currentColor" strokeWidth={1.2} />
          <path d="M -22 -12 L -18 -12 M 18 -12 L 22 -12" stroke="currentColor" strokeWidth={1} strokeDasharray="2.5 2" />
        </g>
      )
    case 'strength':
      return (
        <g>
          <path d="M 0 -16 C 10 -16 10 -6 0 -6 C -10 -6 -10 4 0 4 C 10 4 10 14 0 14 C -10 14 -10 4 0 4 C 10 4 10 -16 0 -16 Z" fill="none" stroke="currentColor" strokeWidth={1.4} />
          <circle cx={-6} cy={20} r={3.4} fill="none" stroke="currentColor" strokeWidth={1.2} />
          <circle cx={6} cy={20} r={3.4} fill="none" stroke="currentColor" strokeWidth={1.2} />
          <path d="M 0 -22 L 0 -19" stroke="currentColor" strokeWidth={1.2} />
        </g>
      )
    case 'hermit':
      return (
        <g>
          <path d="M 0 -22 L 10 -12 L 10 4 L 0 14 L -10 4 L -10 -12 Z" fill="none" stroke="currentColor" strokeWidth={1.4} />
          <path d="M 0 -14 L 2.4 -7.6 L 8.8 -7.6 L 3.8 -3.6 L 5.6 2.8 L 0 -1 L -5.6 2.8 L -3.8 -3.6 L -8.8 -7.6 L -2.4 -7.6 Z" fill="currentColor" opacity={0.9} />
          <line x1={16} y1={-20} x2={16} y2={22} stroke="currentColor" strokeWidth={1.3} />
          <circle cx={16} cy={-22} r={2} fill="currentColor" />
          <path d="M -18 20 L -14 20" stroke="currentColor" strokeWidth={1} strokeDasharray="2.5 2" />
        </g>
      )
    case 'wheel':
      return (
        <g>
          <circle r={16} fill="none" stroke="currentColor" strokeWidth={1.4} />
          <circle r={8} fill="none" stroke="currentColor" strokeWidth={1} opacity={0.7} />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <line key={deg} x1={0} y1={-16} x2={0} y2={-8} stroke="currentColor" strokeWidth={1.2} transform={`rotate(${deg})`} />
          ))}
          <path d="M -22 0 L -19 0 M 19 0 L 22 0 M 0 -22 L 0 -19 M 0 19 L 0 22" stroke="currentColor" strokeWidth={1} />
        </g>
      )
    case 'justice':
      return (
        <g>
          <line x1={-16} y1={-10} x2={16} y2={-10} stroke="currentColor" strokeWidth={1.4} />
          <line x1={0} y1={-16} x2={0} y2={20} stroke="currentColor" strokeWidth={1.4} />
          <line x1={-16} y1={-10} x2={-16} y2={0} stroke="currentColor" strokeWidth={1} />
          <line x1={16} y1={-10} x2={16} y2={0} stroke="currentColor" strokeWidth={1} />
          <path d="M -21 0 A 5 5 0 0 0 -11 0 Z" fill="none" stroke="currentColor" strokeWidth={1.2} />
          <path d="M 11 0 A 5 5 0 0 0 21 0 Z" fill="none" stroke="currentColor" strokeWidth={1.2} />
          <path d="M -8 -22 L 8 -22" stroke="currentColor" strokeWidth={1} strokeDasharray="2.5 2" />
        </g>
      )
    case 'hanged':
      return (
        <g>
          <line x1={-14} y1={-18} x2={14} y2={-18} stroke="currentColor" strokeWidth={1.4} />
          <line x1={0} y1={-18} x2={0} y2={-4} stroke="currentColor" strokeWidth={1.2} />
          <circle cx={0} cy={4} r={6} fill="none" stroke="currentColor" strokeWidth={1.4} />
          <path d="M -8 14 L 0 8 L 8 14 L 0 24 Z" fill="none" stroke="currentColor" strokeWidth={1.3} />
          <circle cx={0} cy={4} r={10} fill="none" stroke="currentColor" strokeWidth={0.8} strokeDasharray="2 3" opacity={0.7} />
        </g>
      )
    case 'death':
      return (
        <g>
          <path d="M -14 18 Q 2 10 8 -8" fill="none" stroke="currentColor" strokeWidth={1.5} />
          <path d="M 8 -8 Q 16 -16 22 -10" fill="none" stroke="currentColor" strokeWidth={1.5} />
          <line x1={-10} y1={-14} x2={14} y2={10} stroke="currentColor" strokeWidth={1.2} />
          <circle cx={-14} cy={-14} r={3} fill="currentColor" opacity={0.9} />
          <circle cx={14} cy={16} r={3} fill="currentColor" opacity={0.9} />
          <path d="M -18 -2 L -15 -2 M 15 -2 L 18 -2" stroke="currentColor" strokeWidth={0.9} strokeDasharray="2 2" />
        </g>
      )
    case 'temperance':
      return (
        <g>
          <CupGlyph x={-12} y={-10} s={1.1} />
          <CupGlyph x={12} y={12} s={1.1} />
          <path d="M -6 -6 Q 0 -2 6 4 Q 10 8 6 10" fill="none" stroke="currentColor" strokeWidth={1.2} strokeDasharray="3 2" />
          <path d="M -18 -20 L -14 -20 M 14 -20 L 18 -20" stroke="currentColor" strokeWidth={0.9} strokeDasharray="2.5 2" />
        </g>
      )
    case 'devil':
      return (
        <g>
          <path d="M 0 -18 L 5.3 -5.6 L 18.5 -5.6 L 8 2.2 L 12.3 15 L 0 7 L -12.3 15 L -8 2.2 L -18.5 -5.6 L -5.3 -5.6 Z" fill="none" stroke="currentColor" strokeWidth={1.3} transform="rotate(180)" />
          <line x1={-14} y1={20} x2={14} y2={20} stroke="currentColor" strokeWidth={1.2} strokeDasharray="3 2" />
          <circle cx={-8} cy={24} r={2.4} fill="none" stroke="currentColor" strokeWidth={1.1} />
          <circle cx={8} cy={24} r={2.4} fill="none" stroke="currentColor" strokeWidth={1.1} />
        </g>
      )
    case 'tower':
      return (
        <g>
          <rect x={-8} y={-6} width={16} height={28} fill="none" stroke="currentColor" strokeWidth={1.4} />
          <rect x={-11} y={-12} width={22} height={6} fill="none" stroke="currentColor" strokeWidth={1.2} />
          <path d="M 2 -26 L -4 -14 L 4 -12 L -2 0" fill="none" stroke="currentColor" strokeWidth={1.6} />
          <circle cx={-16} cy={-20} r={1.4} fill="currentColor" />
          <circle cx={18} cy={-14} r={1.4} fill="currentColor" />
          <circle cx={16} cy={4} r={1.4} fill="currentColor" />
          <path d="M -16 12 L -13 12 M 13 16 L 16 16" stroke="currentColor" strokeWidth={0.9} strokeDasharray="2 2" />
        </g>
      )
    case 'star':
      return (
        <g>
          <path d="M 0 -18 L 4.7 -5.9 L 17.6 -5.9 L 7.1 1.8 L 11.4 14.1 L 0 6.6 L -11.4 14.1 L -7.1 1.8 L -17.6 -5.9 L -4.7 -5.9 Z" fill="currentColor" opacity={0.9} />
          {[[-18, -16], [18, -16], [-22, 2], [22, 2], [-14, 16], [14, 16], [0, 22]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={1.6} fill="currentColor" opacity={0.75} />
          ))}
        </g>
      )
    case 'moon':
      return (
        <g>
          <path d="M 6 -16 A 12 12 0 1 0 6 4 A 15 15 0 1 1 6 -16 Z" fill="currentColor" opacity={0.9} />
          <line x1={-16} y1={-6} x2={-16} y2={16} stroke="currentColor" strokeWidth={1.3} />
          <line x1={16} y1={-6} x2={16} y2={16} stroke="currentColor" strokeWidth={1.3} />
          <path d="M -16 18 Q -8 14 0 18 Q 8 22 16 18" fill="none" stroke="currentColor" strokeWidth={1.1} strokeDasharray="3 2" />
          <path d="M -20 -16 L -17 -16 M 17 -20 L 20 -20" stroke="currentColor" strokeWidth={0.9} strokeDasharray="2 2" />
        </g>
      )
    case 'sun':
      return (
        <g>
          <circle r={10} fill="none" stroke="currentColor" strokeWidth={1.5} />
          {Array.from({ length: 12 }, (_, i) => (
            <line key={i} x1={0} y1={-14} x2={0} y2={-19} stroke="currentColor" strokeWidth={1.3} transform={`rotate(${i * 30})`} />
          ))}
          <path d="M 0 -4 L 1.6 -1.2 L 4.8 -1.2 L 2.4 1 L 3.2 4 L 0 2.2 L -3.2 4 L -2.4 1 L -4.8 -1.2 L -1.6 -1.2 Z" fill="currentColor" />
        </g>
      )
    case 'judgement':
      return (
        <g>
          <path d="M -16 -6 L 4 -14 L 4 6 Z" fill="none" stroke="currentColor" strokeWidth={1.4} />
          <path d="M 4 -14 Q 14 -18 18 -12" fill="none" stroke="currentColor" strokeWidth={1.3} />
          <path d="M -14 12 Q -10 18 -4 16 M 0 12 Q 4 18 10 16" fill="none" stroke="currentColor" strokeWidth={1.1} strokeDasharray="2.5 2" />
          <line x1={-18} y1={-16} x2={-6} y2={-22} stroke="currentColor" strokeWidth={1.1} />
        </g>
      )
    case 'world':
      return (
        <g>
          <ellipse rx={16} ry={22} fill="none" stroke="currentColor" strokeWidth={1.4} strokeDasharray="6 3" />
          <circle r={7} fill="none" stroke="currentColor" strokeWidth={1.4} />
          <path d="M 0 -7 L 0 -16 M 0 7 L 0 16 M -7 0 L -16 0 M 7 0 L 16 0" stroke="currentColor" strokeWidth={1} opacity={0.7} />
          <path d="M 0 -2.6 L 0.9 -0.8 L 2.8 -0.8 L 1.3 0.4 L 1.8 2.3 L 0 1.2 L -1.8 2.3 L -1.3 0.4 L -2.8 -0.8 L -0.9 -0.8 Z" fill="currentColor" />
        </g>
      )
    case 'wands':
      return (
        <g>
          <RankEmblem rank={1} />
          <WandGlyph x={0} y={0} s={2} />
        </g>
      )
    case 'cups':
      return (
        <g>
          <RankEmblem rank={1} />
          <CupGlyph x={0} y={0} s={2} />
        </g>
      )
    case 'swords':
      return (
        <g>
          <RankEmblem rank={1} />
          <SwordGlyph x={0} y={0} s={2} />
        </g>
      )
    case 'pentacles':
      return (
        <g>
          <RankEmblem rank={1} />
          <CoinGlyph x={0} y={0} s={2} />
        </g>
      )
    default:
      return null
  }
}

/** 角落符记（四角小十字/点） */
function CornerMarks({ color }: { color: string }) {
  return (
    <g fill={color}>
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy], i) => (
        <g key={i} transform={`translate(${sx * 108} ${sy * 168})`}>
          <rect x={-4} y={-0.7} width={8} height={1.4} opacity={0.55} />
          <rect x={-0.7} y={-4} width={1.4} height={8} opacity={0.55} />
        </g>
      ))}
    </g>
  )
}

/** 完整牌面 v2：分层构图——底色辉光 / 角标 / 水印数字 / 中央符文 / 铭牌 */
export function CardFace({
  name,
  latin,
  roman,
  motif,
  suit,
  rank,
  className,
}: {
  name: string
  latin: string
  roman: string
  motif: Motif
  suit?: string
  rank?: number
  className?: string
}) {
  const accent: AccentName = suit ? SUIT_ACCENT[suit] ?? 'acid' : MAJOR_ACCENT[motif] ?? 'acid'
  const color = ACCENTS[accent]
  const isMinor = Boolean(suit && rank)
  return (
    <div
      className={`relative flex h-full w-full flex-col items-center overflow-hidden rounded-[10px] border bg-gradient-to-b from-[#10101c] via-[#0c0c16] to-[#08080f] ${className ?? ''}`}
      style={{ borderColor: `${color}55`, boxShadow: `inset 0 0 26px rgba(0,0,0,.65), 0 0 14px ${color}22` }}
    >
      {/* 底纹：径向辉光 + 网格 */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 90% 55% at 50% 42%, ${color}1f, transparent 70%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `linear-gradient(${color}12 1px, transparent 1px), linear-gradient(90deg, ${color}12 1px, transparent 1px)`,
          backgroundSize: '14px 14px',
        }}
      />
      <div className="pointer-events-none absolute inset-1.5 rounded-[7px] border" style={{ borderColor: `${color}30` }} />
      {/* 水印罗马数字 */}
      <div
        className="pointer-events-none absolute right-1 top-6 select-none font-cyber text-[64px] font-black leading-none"
        style={{ color: `${color}14`, writingMode: 'vertical-rl' }}
      >
        {roman}
      </div>
      {/* 角标 */}
      <svg viewBox="-116 -176 232 352" className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden="true">
        <CornerMarks color={color} />
      </svg>

      {/* 顶部：罗马数字 + 花色徽标 */}
      <div className="relative z-10 mt-1.5 flex items-center gap-1.5">
        <span className="font-cyber text-[11px] font-bold tracking-[0.2em]" style={{ color }}>{roman}</span>
        {isMinor && (
          <span className="font-mono text-[7px] uppercase tracking-[0.18em] text-t3">{suit}</span>
        )}
      </div>

      {/* 中央符文（弹性区，修复高度塌陷） */}
      <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center px-2 py-1">
        <svg viewBox="-32 -34 64 68" className="h-full w-auto max-w-full" style={{ color, filter: `drop-shadow(0 0 6px ${color}66)` }} aria-hidden="true">
          <CardArt motif={motif} pips={isMinor ? rank! : 0} rank={rank ?? 0} />
        </svg>
      </div>

      {/* 铭牌 */}
      <div className="relative z-10 mb-1.5 w-full px-1.5 text-center">
        <div className="font-display text-[13px] leading-none text-t1">{name}</div>
        <div className="mt-0.5 truncate font-mono text-[8px] uppercase tracking-[0.15em] text-t3">{latin}</div>
      </div>
    </div>
  )
}

/** 牌背：符文环 + 之眼（全牌组统一，塔罗惯例） */
export function CardBack({ className }: { className?: string }) {
  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden rounded-[10px] border border-acid/40 bg-[#0a0a12] ${className ?? ''}`}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 90% 55% at 50% 45%, rgba(200,255,30,0.09), transparent 70%)' }}
      />
      <div className="pointer-events-none absolute inset-1 rounded-[7px] border border-acid/20" />
      <svg viewBox="-30 -46 60 92" className="h-[86%] w-auto">
        <g stroke="#C8FF1E" fill="none">
          <circle r={17} strokeWidth={1.1} opacity={0.9} />
          <circle r={12.5} strokeWidth={0.7} strokeDasharray="2.5 2" opacity={0.8} />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <line key={deg} x1={0} y1={-22} x2={0} y2={-17} strokeWidth={0.9} transform={`rotate(${deg})`} />
          ))}
          <path d="M -9 2 A 9 9 0 1 1 9 2 Q 0 12 -9 2 Z" strokeWidth={1.2} />
          <circle cx={0} cy={-1} r={2.6} strokeWidth={1.2} />
          <circle cx={0} cy={-1} r={0.9} fill="#C8FF1E" stroke="none" />
          <path d="M -10 -28 L 0 -34 L 10 -28 M -10 28 L 0 34 L 10 28" strokeWidth={0.9} opacity={0.7} />
        </g>
      </svg>
      <div className="absolute bottom-1.5 font-mono text-[7px] uppercase tracking-[0.3em] text-acid/50">CYBER ORACLE</div>
    </div>
  )
}
