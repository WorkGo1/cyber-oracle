import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { DrawnCard } from '@/data/types'
import { CardBack, CardFace } from '@/components/TarotCardView'
import { sfx } from '@/lib/audio'
import { haptic } from '@/lib/haptics'
import { useAppStore } from '@/stores/useAppStore'

type Stage = 'shuffle' | 'cut' | 'flip'

const GLOW: Record<string, string> = {
  acid: 'shadow-glow-acid',
  cyan: 'shadow-glow-cyan',
  magenta: 'shadow-glow-magenta',
  gold: 'shadow-glow-gold',
  violet: 'shadow-glow-violet',
}

const CARD_W = 96
const CARD_H = 154

/** 三段式抽牌仪式：洗牌 → 切牌 → 翻牌 */
export function Ritual({
  cards,
  positions,
  accent,
  onDone,
}: {
  cards: DrawnCard[]
  positions?: string[]
  accent: string
  onDone: () => void
}) {
  const hapticOn = useAppStore((s) => s.hapticOn)
  const [stage, setStage] = useState<Stage>('shuffle')
  const [shuffling, setShuffling] = useState(false)
  const [cutIndex, setCutIndex] = useState<number | null>(null)
  const [flipped, setFlipped] = useState<boolean[]>(() => cards.map(() => false))

  const vibe = (kind: 'light' | 'medium' | 'success') => {
    if (hapticOn) haptic(kind)
  }

  const startShuffle = () => {
    if (shuffling) return
    sfx.shuffle()
    vibe('medium')
    setShuffling(true)
    setTimeout(() => sfx.shuffle(), 700)
    setTimeout(() => {
      setShuffling(false)
      setStage('cut')
    }, 1800)
  }

  const chooseCut = (i: number) => {
    sfx.cut()
    vibe('medium')
    setCutIndex(i)
    setTimeout(() => setStage('flip'), 500)
  }

  const flipAt = (i: number) => {
    if (flipped[i]) return
    sfx.flip()
    vibe('light')
    const next = [...flipped]
    next[i] = true
    setFlipped(next)
    const allFlipped = next.every(Boolean)
    if (allFlipped) {
      setTimeout(() => {
        sfx.reveal()
        vibe('success')
      }, 650)
    }
  }

  const skip = () => {
    setFlipped(cards.map(() => true))
    setStage('flip')
    onDone()
  }

  const allFlipped = flipped.every(Boolean)

  return (
    <div className="flex flex-col items-center pt-2">
      {/* 提示区 */}
      <div className="mb-1 min-h-[72px] text-center">
        <AnimatePresence mode="wait">
          {stage === 'shuffle' && (
            <motion.div key="s1" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <div className="hud-tag mx-auto" style={{ color: `rgb(var(--c-${accent}))` }}>STEP 1/3 · SHUFFLE</div>
              <p className="mt-2 text-[14px] text-t1">闭上眼，把问题在心里过一遍</p>
              <p className="mt-0.5 text-[12px] text-t3">然后按下洗牌，把杂念抖出去</p>
            </motion.div>
          )}
          {stage === 'cut' && (
            <motion.div key="s2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <div className="hud-tag mx-auto" style={{ color: `rgb(var(--c-${accent}))` }}>STEP 2/3 · CUT</div>
              <p className="mt-2 text-[14px] text-t1">凭直觉选一叠，切断你的犹豫</p>
            </motion.div>
          )}
          {stage === 'flip' && (
            <motion.div key="s3" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <div className="hud-tag mx-auto" style={{ color: `rgb(var(--c-${accent}))` }}>STEP 3/3 · REVEAL</div>
              <p className="mt-2 text-[14px] text-t1">逐张点开，答案自己会说话</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 牌区 */}
      <div className="relative flex h-[240px] w-full items-center justify-center">
        {stage === 'shuffle' && (
          <div className="relative" style={{ width: CARD_W, height: CARD_H }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className={`absolute inset-0 rounded-[10px] ${GLOW[accent] ?? GLOW.acid}`}
                animate={
                  shuffling
                    ? {
                        x: [0, (i % 2 === 0 ? 1 : -1) * (34 + i * 9), (i % 2 === 0 ? -1 : 1) * 20, 0],
                        y: [0, -14 - i * 5, 8, 0],
                        rotate: [0, (i - 2) * 9, (2 - i) * 7, 0],
                      }
                    : { x: 0, y: i * 1.5, rotate: 0 }
                }
                transition={
                  shuffling
                    ? { duration: 0.9, repeat: 1, ease: 'easeInOut' }
                    : { type: 'spring', stiffness: 300, damping: 22 }
                }
                style={{ zIndex: 5 - i }}
              >
                <CardBack />
              </motion.div>
            ))}
          </div>
        )}

        {stage === 'cut' && (
          <div className="flex items-end gap-3">
            {[0, 1, 2].map((i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: cutIndex === null || cutIndex === i ? 1 : 0.25,
                  y: 0,
                  scale: cutIndex === i ? 1.06 : 1,
                }}
                onClick={() => cutIndex === null && chooseCut(i)}
                className="press relative"
                style={{ width: CARD_W * 0.82, height: CARD_H * 0.82, rotate: `${(i - 1) * 5}deg` }}
                aria-label={`切牌位置 ${i + 1}`}
              >
                <div className="absolute inset-0" style={{ transform: `translateY(${-i * 1}px)` }}>
                  <CardBack />
                </div>
                <div className="absolute inset-x-0 -bottom-6 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-t3">
                  {['左', '中', '右'][i]}
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {stage === 'flip' && (
          <div className="flex items-center justify-center gap-3">
            {cards.map((d, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 24, rotate: (i - (cards.length - 1) / 2) * 6 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22, delay: i * 0.08 }}
                onClick={() => flipAt(i)}
                className="relative"
                style={{ width: cards.length > 2 ? CARD_W * 0.9 : CARD_W, height: cards.length > 2 ? CARD_H * 0.9 : CARD_H, perspective: 900 }}
                aria-label={`第 ${i + 1} 张牌，${flipped[i] ? '已翻开' : '点击翻开'}`}
              >
                <motion.div
                  className="relative h-full w-full"
                  style={{ transformStyle: 'preserve-3d' }}
                  animate={{ rotateY: flipped[i] ? 180 : 0 }}
                  transition={{ duration: 0.55, ease: [0.2, 0.7, 0.2, 1] }}
                >
                  <div className={`absolute inset-0 ${flipped[i] ? '' : GLOW[accent] ?? ''}`} style={{ backfaceVisibility: 'hidden' }}>
                    <CardBack />
                  </div>
                  <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                    <div className="h-full w-full" style={{ transform: d.reversed ? 'rotate(180deg)' : undefined }}>
                      <CardFace
                        name={d.card.name}
                        latin={d.card.latin}
                        roman={d.card.roman}
                        motif={d.card.motif}
                        suit={d.card.suit}
                        rank={d.card.rank}
                      />
                    </div>
                  </div>
                </motion.div>
                {flipped[i] && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-x-0 -bottom-7 text-center"
                  >
                    <span className="hud-tag" style={{ color: `rgb(var(--c-${accent}))` }}>
                      {d.reversed ? '逆位' : '正位'} · {positions?.[i] ?? `#${i + 1}`}
                    </span>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* 操作区 */}
      <div className="mt-10 flex w-full flex-col items-center gap-3">
        {stage === 'shuffle' && (
          <button
            onClick={startShuffle}
            disabled={shuffling}
            className="btn-primary w-full max-w-[300px]"
            style={{ background: `rgb(var(--c-${accent}))` }}
          >
            {shuffling ? '洗牌中…' : '开始洗牌'}
          </button>
        )}
        {stage === 'flip' && allFlipped && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => {
              sfx.tap()
              onDone()
            }}
            className="btn-primary w-full max-w-[300px]"
            style={{ background: `rgb(var(--c-${accent}))` }}
          >
            揭晓解读 ▸
          </motion.button>
        )}
        <button onClick={skip} className="min-h-[44px] px-4 text-[12px] text-t3 underline-offset-4 hover:text-t2 hover:underline">
          跳过仪式，直接解读
        </button>
      </div>
    </div>
  )
}
