export type Orientation = 'up' | 'rev'
export type PersonaId = 'spicy' | 'soft' | 'mentor' | 'witch'
export type SceneId = 'daily' | 'translate' | 'crush' | 'decide'
export type Suit = 'wands' | 'cups' | 'swords' | 'pentacles'
export type Motif =
  | 'fool' | 'magician' | 'priestess' | 'empress' | 'emperor' | 'hierophant'
  | 'lovers' | 'chariot' | 'strength' | 'hermit' | 'wheel' | 'justice'
  | 'hanged' | 'death' | 'temperance' | 'devil' | 'tower' | 'star'
  | 'moon' | 'sun' | 'judgement' | 'world'
  | 'wands' | 'cups' | 'swords' | 'pentacles'

export interface CardKeywords {
  up: string[]
  rev: string[]
}

export interface MajorCardData {
  id: string
  number: number
  name: string
  latin: string
  roman: string
  motif: Motif
  keywords: CardKeywords
  tone: Record<Orientation, string>
  insight: Record<Orientation, string>
  action: Record<Orientation, string>
}

export interface SuitData {
  id: Suit
  name: string
  domain: string
  motif: Motif
  keywords: CardKeywords
  tone: Record<Orientation, string>
  insight: Record<Orientation, string>
  action: Record<Orientation, string>
}

export interface RankData {
  rank: number
  label: string
  title: string
  up: string
  rev: string
}

export interface TarotCard {
  id: string
  arcana: 'major' | 'minor'
  name: string
  latin: string
  roman: string
  motif: Motif
  suit?: Suit
  rank?: number
  keywords: CardKeywords
  tone: Record<Orientation, string>
  insight: Record<Orientation, string>
  action: Record<Orientation, string>
}

export interface DrawnCard {
  card: TarotCard
  reversed: boolean
}
