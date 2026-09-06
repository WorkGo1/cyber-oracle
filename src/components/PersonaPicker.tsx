import { motion } from 'framer-motion'
import type { PersonaId } from '@/data/types'
import { PERSONAS } from '@/data/personas'
import { sfx } from '@/lib/audio'
import { haptic } from '@/lib/haptics'

const ACCENT: Record<string, { text: string; border: string }> = {
  magenta: { text: 'text-magenta', border: 'border-magenta/60' },
  cyan: { text: 'text-cyan', border: 'border-cyan/60' },
  acid: { text: 'text-acid', border: 'border-acid/60' },
  violet: { text: 'text-violet', border: 'border-violet/60' },
}

export function PersonaPicker({
  value,
  recommended,
  onChange,
  onConfirm,
}: {
  value: PersonaId
  recommended: PersonaId
  onChange: (id: PersonaId) => void
  onConfirm: () => void
}) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        {PERSONAS.map((p, i) => {
          const active = p.id === value
          const a = ACCENT[p.accent]
          return (
            <motion.button
              key={p.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.35 }}
              onClick={() => {
                sfx.tap()
                haptic('light')
                onChange(p.id)
              }}
              className={`panel press relative flex min-h-[132px] flex-col items-start p-3.5 text-left ${
                active ? `${a.border} ${a.text}` : ''
              }`}
              aria-pressed={active}
            >
              {p.id === recommended && (
                <span className="absolute right-2 top-2 rounded-hud border border-line px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-t3">
                  推荐
                </span>
              )}
              <span className="text-[26px]" aria-hidden="true">{p.avatar}</span>
              <div className={`mt-1.5 font-display text-[16px] leading-tight ${active ? a.text : 'text-t1'}`}>{p.name}</div>
              <p className="mt-1 text-[11px] leading-snug text-t2">{p.tagline}</p>
            </motion.button>
          )
        })}
      </div>
      <p className="mt-3 min-h-[36px] text-center text-[12px] leading-relaxed text-t2">
        {PERSONAS.find((p) => p.id === value)?.desc}
      </p>
      <button
        onClick={() => {
          sfx.tap()
          haptic('medium')
          onConfirm()
        }}
        className="btn-primary mt-2 w-full"
      >
        就选 ta，开始仪式 ▸
      </button>
    </div>
  )
}
