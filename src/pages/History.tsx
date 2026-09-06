import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { DECK } from '@/data/deck'
import { sceneById } from '@/data/scenes'
import { personaById } from '@/data/personas'
import { cardById } from '@/data/deck'
import { CardFace } from '@/components/TarotCardView'
import { useAppStore } from '@/stores/useAppStore'

const SUITS = [
  { id: 'wands', name: '权杖 · 事业之火' },
  { id: 'cups', name: '圣杯 · 情绪之水' },
  { id: 'swords', name: '宝剑 · 内耗之风' },
  { id: 'pentacles', name: '星币 · 现实之土' },
] as const

const SUIT_VAR: Record<(typeof SUITS)[number]['id'], string> = {
  wands: 'acid',
  cups: 'magenta',
  swords: 'cyan',
  pentacles: 'gold',
}

function DeckGallery() {
  const majors = DECK.filter((c) => c.arcana === 'major')
  return (
    <div className="space-y-5">
      <p className="text-[12px] leading-relaxed text-t2">
        78 张牌全部程序化绘制：每张牌有专属符文构图与配色。大阿尔卡纳按牌义定色，小阿尔卡纳按花色定色（权杖=酸绿 / 圣杯=品红 / 宝剑=青 / 星币=金），徽记纹样对应数字原型。
      </p>
      <section>
        <p className="hud-tag mb-2 text-acid">MAJOR · 大阿尔卡纳 × 22</p>
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
          {majors.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.02, 0.5), duration: 0.3 }}
              className="aspect-[2/3.2]"
              title={`${c.name} ${c.latin}`}
            >
              <CardFace name={c.name} latin={c.latin} roman={c.roman} motif={c.motif} />
            </motion.div>
          ))}
        </div>
      </section>
      {SUITS.map((s) => (
        <section key={s.id}>
          <p className="hud-tag mb-2" style={{ color: `rgb(var(--c-${SUIT_VAR[s.id]}))` }}>
            {s.name} × 14
          </p>
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
            {DECK.filter((c) => c.suit === s.id).map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.02, 0.4), duration: 0.3 }}
                className="aspect-[2/3.2]"
                title={`${c.name} ${c.latin}`}
              >
                <CardFace name={c.name} latin={c.latin} roman={c.roman} motif={c.motif} suit={c.suit} rank={c.rank} />
              </motion.div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

export default function History() {
  const history = useAppStore((s) => s.history)
  const [tab, setTab] = useState<'log' | 'deck'>('log')
  const nav = useNavigate()

  const groups = new Map<string, typeof history>()
  for (const h of history) {
    const day = h.date.slice(0, 10)
    if (!groups.has(day)) groups.set(day, [])
    groups.get(day)!.push(h)
  }

  return (
    <div className="space-y-4 pt-3">
      <section>
        <span className="hud-tag text-acid">LOG · 能量档案</span>
        <h2 className="mt-2 font-display text-[24px]">你的能量档案</h2>
        <div className="mt-3 flex gap-2" role="tablist" aria-label="记录视图切换">
          <button
            role="tab"
            aria-selected={tab === 'log'}
            onClick={() => setTab('log')}
            className={`press rounded-pill border px-4 py-1.5 text-[13px] ${tab === 'log' ? 'border-acid/60 bg-acid/10 text-acid' : 'border-line text-t2'}`}
          >
            抽牌记录
          </button>
          <button
            role="tab"
            aria-selected={tab === 'deck'}
            onClick={() => setTab('deck')}
            className={`press rounded-pill border px-4 py-1.5 text-[13px] ${tab === 'deck' ? 'border-acid/60 bg-acid/10 text-acid' : 'border-line text-t2'}`}
          >
            牌库图鉴 · 78
          </button>
        </div>
      </section>

      {tab === 'deck' ? (
        <DeckGallery />
      ) : (
        <>
          {history.length === 0 && (
            <div className="panel mt-2 flex flex-col items-center p-8 text-center">
              <span className="text-[40px]" aria-hidden="true">🃏</span>
              <p className="mt-3 text-[14px] text-t2">还没有记录，去抽第一张牌吧</p>
              <button onClick={() => nav('/')} className="btn-primary mt-4">回神婆 ▸</button>
            </div>
          )}
          {[...groups.entries()].map(([day, items]) => (
            <section key={day}>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-t3">{day}</p>
              <div className="space-y-2.5">
                {items.map((h) => {
                  const scene = sceneById(h.sceneId)
                  const persona = personaById(h.personaId)
                  return (
                    <div key={h.id} className="panel p-3.5">
                      <div className="flex items-center gap-2">
                        <span className="hud-tag" style={{ color: `rgb(var(--c-${scene?.accent ?? 'acid'}))` }}>
                          {scene?.short ?? h.sceneId}
                        </span>
                        <span className="text-[11px] text-t3">{persona?.name} · {h.mode === 'llm' ? 'LLM' : '本地'}</span>
                        <span className="ml-auto font-mono text-[10px] text-t3">{h.date.slice(11, 16)}</span>
                      </div>
                      {h.question && <p className="mt-1.5 truncate text-[12px] text-t2">Q：{h.question}</p>}
                      <p className="mt-1 font-display text-[15px] text-t1">{h.tagline || h.headline}</p>
                      <p className="mt-1 font-mono text-[11px] text-t3">
                        {h.cards.map((c) => `${cardById(c.id)?.name ?? '?'}${c.reversed ? '逆' : ''}`).join(' · ')}
                      </p>
                    </div>
                  )
                })}
              </div>
            </section>
          ))}
        </>
      )}
    </div>
  )
}
