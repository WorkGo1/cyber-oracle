import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { POOL_SEEDS } from '@/data/pools'
import { hashString } from '@/lib/rng'
import { todayKey } from '@/lib/date'
import { sfx } from '@/lib/audio'
import { haptic } from '@/lib/haptics'
import { useAppStore } from '@/stores/useAppStore'

interface PoolNote {
  text: string
  card: string
  date: string
}

const USER_KEY = 'cyber-oracle-pool-user'

function loadUserNotes(): PoolNote[] {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) ?? '[]') as PoolNote[]
  } catch {
    return []
  }
}

export default function Pool() {
  const personaId = useAppStore((s) => s.personaId)
  void personaId
  const [userNotes, setUserNotes] = useState<PoolNote[]>(loadUserNotes)
  const [input, setInput] = useState('')
  const [fished, setFished] = useState<PoolNote | null>(null)
  const [fishTick, setFishTick] = useState(0)

  const allSeeds = useMemo(
    () => POOL_SEEDS.map((s) => ({ text: s.text, card: s.card, date: 'seed' })),
    [],
  )

  const onlineCount = useMemo(() => 800 + (hashString(todayKey()) % 2600), [])

  function fish() {
    sfx.reveal()
    haptic('medium')
    const pool = [...allSeeds, ...userNotes]
    const pickOne = pool[Math.floor(Math.random() * pool.length)]
    setFished(pickOne)
    setFishTick((t) => t + 1)
  }

  function throwNote() {
    const text = input.trim()
    if (!text) return
    sfx.tap()
    haptic('success')
    const note: PoolNote = { text, card: '未抽牌', date: todayKey() }
    const next = [note, ...userNotes]
    setUserNotes(next)
    localStorage.setItem(USER_KEY, JSON.stringify(next))
    setInput('')
  }

  const resonance = fished ? 300 + (hashString(fished.card + todayKey() + String(fishTick)) % 4200) : 0

  return (
    <div className="space-y-4 pt-3">
      <section>
        <div className="flex items-center justify-between">
          <span className="hud-tag text-violet">ENERGY POOL</span>
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-t3">
            <span className="inline-block h-1.5 w-1.5 animate-blink rounded-full bg-violet" />
            {onlineCount} 人在线漂浮
          </span>
        </div>
        <h2 className="mt-2 font-display text-[26px] leading-tight text-t1">
          赛博<span className="text-violet">能量树洞</span>
        </h2>
        <p className="mt-1 text-[13px] leading-relaxed text-t2">
          把今天的糟心事扔进来，或者捞一张别人掉的牌——你熬的夜，全国有人陪你熬。
        </p>
      </section>

      {/* 捞卡 */}
      <section className="panel border-violet/30 p-4">
        <div className="flex items-center justify-between">
          <span className="hud-tag text-violet">捞一张陌生人的牌</span>
          <button onClick={fish} className="btn-ghost min-h-[40px] px-4 text-[13px] text-violet" style={{ borderColor: 'rgb(var(--c-violet))' }}>
            捞 ▸
          </button>
        </div>
        <AnimatePresence mode="wait">
          {fished ? (
            <motion.div
              key={fishTick}
              initial={{ opacity: 0, y: 16, rotate: -2 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 rounded-btn border border-violet/30 bg-violet/5 p-3.5"
            >
              <p className="text-[14px] leading-relaxed text-t1">「{fished.text}」</p>
              <p className="mt-2 font-mono text-[11px] text-violet">
                —— 一张 {fished.card} · 此刻还有 {resonance} 人和你共振
              </p>
            </motion.div>
          ) : (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-[13px] text-t3">
              池子里漂着全国打工人的今日碎片…
            </motion.p>
          )}
        </AnimatePresence>
      </section>

      {/* 扔纸条 */}
      <section className="panel p-4">
        <span className="hud-tag text-violet">扔一句进池子</span>
        <div className="mt-2 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && throwNote()}
            placeholder="匿名吐槽 / 祝福，50 字内"
            maxLength={50}
            className="min-h-[44px] flex-1 rounded-btn border border-line bg-bg px-3 text-[13px] text-t1 outline-none placeholder:text-t3 focus:border-violet/50"
          />
          <button onClick={throwNote} disabled={!input.trim()} className="btn-ghost min-w-[64px] px-4 text-[13px] font-bold text-violet" style={{ borderColor: 'rgb(var(--c-violet))' }}>
            扔
          </button>
        </div>
        {userNotes.length > 0 && (
          <div className="mt-3 space-y-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-t3">我扔过的（{userNotes.length}）</p>
            {userNotes.slice(0, 5).map((n, i) => (
              <div key={i} className="rounded-btn border border-line bg-bg p-2.5">
                <p className="text-[13px] text-t1">「{n.text}」</p>
                <p className="mt-1 font-mono text-[10px] text-t3">{n.date} · 已入池</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <p className="text-center font-mono text-[9px] uppercase tracking-[0.2em] text-t3">
        OFFLINE DEMO POOL · 离线演示池（内容为本机生成与保存）
      </p>
    </div>
  )
}
