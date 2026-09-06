import { DEFAULT_LLM, type LLMConfig } from '@/engine/llm'
import { todayKey } from '@/lib/date'
import type { Orientation, PersonaId } from '@/data/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface HistoryEntry {
  id: string
  date: string // ISO
  sceneId: string
  personaId: PersonaId
  question: string
  headline: string
  tagline: string
  action: string
  cards: { id: string; reversed: boolean }[]
  mode: 'local' | 'llm'
}

export interface DailyState {
  date: string
  headline?: string
  tagline?: string
  banweiIndex?: number
  cardId?: string
  reversed?: boolean
}

interface AppState {
  personaId: PersonaId
  soundOn: boolean
  hapticOn: boolean
  useLLM: boolean
  llm: LLMConfig
  history: HistoryEntry[]
  daily: DailyState | null
  setPersona: (id: PersonaId) => void
  setSound: (v: boolean) => void
  setHaptic: (v: boolean) => void
  setUseLLM: (v: boolean) => void
  setLLM: (cfg: LLMConfig) => void
  addHistory: (entry: HistoryEntry) => void
  markDaily: (d: DailyState) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      personaId: 'spicy',
      soundOn: true,
      hapticOn: true,
      useLLM: false,
      llm: DEFAULT_LLM,
      history: [],
      daily: null,
      setPersona: (id) => set({ personaId: id }),
      setSound: (v) => set({ soundOn: v }),
      setHaptic: (v) => set({ hapticOn: v }),
      setUseLLM: (v) => set({ useLLM: v }),
      setLLM: (cfg) => set({ llm: cfg }),
      addHistory: (entry) =>
        set((s) => ({ history: [entry, ...s.history].slice(0, 100) })),
      markDaily: (d) => set({ daily: d }),
    }),
    {
      name: 'cyber-oracle-v1',
    },
  ),
)

export function canDailyDraw(daily: DailyState | null): boolean {
  return !daily || daily.date !== todayKey()
}

export function cardIdWithOrientation(id: string, reversed: boolean): { id: string; reversed: Orientation } {
  return { id, reversed: reversed ? 'rev' : 'up' }
}
