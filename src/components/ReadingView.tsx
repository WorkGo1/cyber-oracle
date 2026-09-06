import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Persona } from '@/data/personas'
import type { SceneConfig } from '@/data/scenes'
import { composeFollowUp, type Reading } from '@/engine/interpret'
import { isLLMReady, llmChat, type LLMConfig } from '@/engine/llm'
import { sfx } from '@/lib/audio'
import { haptic } from '@/lib/haptics'
import { ShareCardModal } from '@/components/ShareCardModal'

const ACCENT: Record<string, { text: string; bar: string; glow: string; btn: string }> = {
  acid: { text: 'text-acid', bar: 'bg-acid', glow: 'shadow-glow-acid', btn: '#C8FF1E' },
  cyan: { text: 'text-cyan', bar: 'bg-cyan', glow: 'shadow-glow-cyan', btn: '#22E4FF' },
  magenta: { text: 'text-magenta', bar: 'bg-magenta', glow: 'shadow-glow-magenta', btn: '#FF3DB4' },
  gold: { text: 'text-gold', bar: 'bg-gold', glow: 'shadow-glow-gold', btn: '#FFC838' },
  violet: { text: 'text-violet', bar: 'bg-violet', glow: 'shadow-glow-violet', btn: '#8B5CF6' },
}

function FollowUp({
  scene,
  persona,
  reading,
  llm,
  useLLM,
  accent,
}: {
  scene: SceneConfig
  persona: Persona
  reading: Reading
  llm: LLMConfig
  useLLM: boolean
  accent: string
}) {
  const [turns, setTurns] = useState<{ q: string; a: string }[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const max = 3
  const left = max - turns.length
  const a = ACCENT[accent] ?? ACCENT.acid

  async function ask(q: string) {
    const question = q.trim()
    if (!question || busy || left <= 0) return
    setBusy(true)
    setInput('')
    sfx.tap()
    let answer: string
    try {
      if (useLLM && isLLMReady(llm)) {
        const history: { role: 'user' | 'assistant'; content: string }[] = [
          { role: 'user', content: `我的问题：${reading.question || scene.name}` },
          {
            role: 'assistant',
            content: reading.sections.map((s) => `【${s.label}】${s.body.join(' ')}`).join('\n'),
          },
        ]
        answer = await llmChat(llm, [
          { role: 'system', content: `${persona.systemPrompt}\n用户已抽完牌并获得解读，现在进入追问环节，基于当前牌阵继续回答，保持人格与调性，50-120字。` },
          ...history,
          { role: 'user', content: question },
        ])
      } else {
        await new Promise((r) => setTimeout(r, 500))
        answer = composeFollowUp(question, reading, persona)
      }
    } catch {
      answer = composeFollowUp(question, reading, persona)
    }
    setTurns((t) => [...t, { q: question, a: answer }])
    setBusy(false)
  }

  return (
    <div className="panel p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="hud-tag">DEEP DIVE · 深潜追问</span>
        <span className="font-mono text-[10px] text-t3">剩余 {left} 轮</span>
      </div>
      {turns.length > 0 && (
        <div className="mb-3 space-y-2.5">
          {turns.map((t, i) => (
            <div key={i} className="space-y-1.5">
              <div className="ml-auto w-fit max-w-[85%] rounded-btn rounded-br-hud bg-surface2 px-3 py-2 text-[13px] text-t1">
                {t.q}
              </div>
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-fit max-w-[92%] rounded-btn rounded-bl-hud border border-line bg-bg px-3 py-2 text-[13px] leading-relaxed text-t1"
              >
                {t.a}
              </motion.div>
            </div>
          ))}
          {busy && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-fit max-w-[92%] rounded-btn rounded-bl-hud border border-line bg-bg px-3 py-2 text-[13px] text-t2"
            >
              <span className="mr-1.5 inline-block h-2 w-2 animate-blink rounded-full" style={{ background: ACCENT[accent]?.btn }} />
              {persona.name}思考中…
            </motion.div>
          )}
        </div>
      )}
      {busy && turns.length === 0 && (
        <p className="mb-3 flex items-center gap-2 text-[13px] text-t2">
          <span className="inline-block h-2 w-2 animate-blink rounded-full" style={{ background: ACCENT[accent]?.btn }} />
          {persona.name}思考中…
        </p>
      )}
      {left > 0 ? (
        <>
          <div className="mb-2 flex flex-wrap gap-1.5">
            {scene.quickAsks
              .filter((q) => !turns.some((t) => t.q === q))
              .map((q) => (
              <button
                key={q}
                disabled={busy}
                onClick={() => ask(q)}
                className="press rounded-pill border border-line px-3 py-1.5 text-[12px] text-t2 transition-colors active:border-acid/50 active:text-t1 disabled:opacity-40"
              >
                {q}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && ask(input)}
              placeholder="追问点什么…"
              maxLength={60}
              className="min-h-[44px] flex-1 rounded-btn border border-line bg-bg px-3 text-[13px] text-t1 outline-none placeholder:text-t3 focus:border-acid/50"
            />
            <button
              onClick={() => ask(input)}
              disabled={busy || !input.trim()}
              className="btn-ghost min-w-[52px] px-3 font-bold"
              style={{ color: a.btn, borderColor: a.btn }}
            >
              {busy ? '…' : '问'}
            </button>
          </div>
        </>
      ) : (
        <p className="text-[12px] text-t3">本轮深潜已用完。想继续聊，可以再抽一张看看能量的流动。</p>
      )}
    </div>
  )
}

export function ReadingView({
  reading,
  scene,
  persona,
  llm,
  useLLM,
  fallbackNote,
}: {
  reading: Reading
  scene: SceneConfig
  persona: Persona
  llm: LLMConfig
  useLLM: boolean
  fallbackNote?: string
}) {
  const [shareOpen, setShareOpen] = useState(false)
  const a = ACCENT[scene.accent] ?? ACCENT.acid

  return (
    <div className="space-y-3.5 pb-2">
      {/* 人设横幅 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between rounded-card border border-line bg-surface px-4 py-3"
      >
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-t3">TODAY'S PERSONA</p>
          <p className={`mt-0.5 font-display text-[17px] ${a.text}`}>今日人设：{reading.headline}</p>
        </div>
        <span className={`hud-tag ${reading.mode === 'llm' ? 'border-acid/40 text-acid' : ''}`}>
          {reading.mode === 'llm' ? 'LLM 实时解读' : '本地解读'}
        </span>
      </motion.div>

      {/* AI 降级说明 */}
      {reading.mode === 'local' && fallbackNote && (
        <div className="rounded-card border border-gold/40 bg-gold/5 px-4 py-3">
          <p className="text-[12px] leading-relaxed text-gold">
            ⚡ AI 请求失败（{fallbackNote}），本次由本地解读引擎完成。可到「设置」重新测试连通。
          </p>
        </div>
      )}

      {/* 定调 */}
      {reading.tagline && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.05 } }}
          className={`panel relative overflow-hidden p-4 ${a.glow}`}
        >
          <span className={`absolute inset-y-0 left-0 w-[3px] ${a.bar}`} />
          <p className="font-display text-[18px] leading-snug text-t1">{reading.tagline}</p>
        </motion.div>
      )}

      {/* 班味指数（daily） */}
      <AnimatePresence>
        {reading.banwei && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="panel p-4">
            <div className="flex items-end justify-between">
              <span className="hud-tag">BAN WEI · 班味指数</span>
              <span className="text-[11px] text-t2">{reading.banwei.suffix}</span>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="font-cyber text-[44px] font-bold leading-none text-acid drop-shadow-[0_0_12px_rgba(200,255,30,0.5)]">
                {reading.banwei.index}
              </span>
              <span className="font-cyber text-lg text-t2">%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-pill bg-surface2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${reading.banwei.index}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                className="h-full rounded-pill bg-gradient-to-r from-acid/60 to-acid"
              />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-btn border border-acid/25 bg-acid/5 p-2.5">
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-acid">宜 · DO</p>
                <ul className="mt-1 space-y-0.5">
                  {reading.banwei.doList.map((x) => (
                    <li key={x} className="text-[12px] text-t1">▸ {x}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-btn border border-danger/25 bg-danger/5 p-2.5">
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-danger">忌 · DON'T</p>
                <ul className="mt-1 space-y-0.5">
                  {reading.banwei.dontList.map((x) => (
                    <li key={x} className="text-[12px] text-t1">▸ {x}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 裁决（decide） */}
      <AnimatePresence>
        {reading.verdict && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="panel p-4">
            <span className="hud-tag text-gold">VERDICT · 天平读数</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="font-cyber text-[44px] font-bold leading-none text-gold drop-shadow-[0_0_12px_rgba(255,200,56,0.5)]">
                {reading.verdict.support}
              </span>
              <span className="font-cyber text-lg text-t2">% 支持去干</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-pill bg-surface2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${reading.verdict.support}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                className="h-full rounded-pill bg-gradient-to-r from-gold/50 to-gold"
              />
            </div>
            <p className="mt-2 text-[13px] text-t2">{reading.verdict.risk}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 解读段落 */}
      {reading.sections.map((s, i) => (
        <motion.div
          key={s.key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.1 + i * 0.07 } }}
          className="panel relative overflow-hidden p-4"
        >
          <span className={`absolute inset-y-0 left-0 w-[3px] ${a.bar}`} />
          <div className="mb-1.5 flex items-center gap-2">
            <span className={`hud-tag ${a.text}`}>{s.label}</span>
            {s.cardIndex !== undefined && reading.cards[s.cardIndex] && (
              <span className="font-mono text-[10px] text-t3">
                {reading.cards[s.cardIndex].card.name} · {reading.cards[s.cardIndex].reversed ? '逆位' : '正位'}
              </span>
            )}
          </div>
          <div className="space-y-1.5">
            {s.body.map((p, j) => (
              <p key={j} className="text-[14px] leading-[1.75] text-t1">{p}</p>
            ))}
          </div>
        </motion.div>
      ))}

      {/* 高情商回复示例 */}
      {reading.reply && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="panel border-cyan/30 p-4">
          <span className="hud-tag text-cyan">REPLY · 高情商回法</span>
          <p className="mt-2 rounded-btn bg-cyan/5 p-3 text-[14px] leading-relaxed text-cyan">{reading.reply}</p>
        </motion.div>
      )}

      {/* 建议 + 彩蛋 */}
      {reading.action && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="panel p-4">
          <span className="hud-tag">ACTION · AI 专属建议</span>
          <p className="mt-2 text-[14px] leading-[1.75] text-t1">{reading.action}</p>
        </motion.div>
      )}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="panel border-gold/25 p-4">
        <span className="hud-tag text-gold">LUCK · {persona.luckLead}</span>
        <p className="mt-2 font-display text-[16px] text-gold">🎁 {reading.luck}</p>
      </motion.div>

      {/* 深潜 */}
      <FollowUp scene={scene} persona={persona} reading={reading} llm={llm} useLLM={useLLM} accent={scene.accent} />

      {/* 分享 */}
      <button
        onClick={() => {
          sfx.tap()
          haptic('medium')
          setShareOpen(true)
        }}
        className="btn-primary w-full"
        style={{ background: a.btn }}
      >
        生成我的赛博神签 · 发圈用 ▸
      </button>

      <p className="px-2 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-t3">
        FOR FUN ONLY · 塔罗是镜子不是判决书 · 决策请结合现实
      </p>

      {shareOpen && (
        <ShareCardModal reading={reading} scene={scene} onClose={() => setShareOpen(false)} />
      )}
    </div>
  )
}
