import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { PersonaPicker } from '@/components/PersonaPicker'
import { Ritual } from '@/components/Ritual'
import { ReadingView } from '@/components/ReadingView'
import { sceneById } from '@/data/scenes'
import { personaById, RECOMMENDED_PERSONA } from '@/data/personas'
import type { DrawnCard, PersonaId } from '@/data/types'
import { composeReading, type Reading } from '@/engine/interpret'
import { drawCards } from '@/engine/draw'
import { buildSystemPrompt, isLLMReady, llmChat, parseStructuredReading } from '@/engine/llm'
import { checkCrisis, CRISIS_INFO } from '@/engine/guard'
import { makeSeed } from '@/lib/rng'
import { sfx } from '@/lib/audio'
import { haptic } from '@/lib/haptics'
import { canDailyDraw, useAppStore } from '@/stores/useAppStore'
import { todayKey } from '@/lib/date'

type Stage = 'intro' | 'persona' | 'ritual' | 'reading'

export default function SceneFlow() {
  const { sceneId = '' } = useParams()
  const scene = sceneById(sceneId)
  const nav = useNavigate()
  const store = useAppStore()

  const [stage, setStage] = useState<Stage>(scene?.inputType === 'none' ? 'persona' : 'intro')
  const [question, setQuestion] = useState('')
  const [personaId, setPersonaId] = useState<PersonaId>(RECOMMENDED_PERSONA[sceneId] ?? 'spicy')
  const [cards, setCards] = useState<DrawnCard[] | null>(null)
  const [reading, setReading] = useState<Reading | null>(null)
  const [seed] = useState(() => makeSeed(sceneId, Date.now()))

  useEffect(() => {
    if (!scene) nav('/', { replace: true })
  }, [scene, nav])

  const persona = personaById(personaId)
  const dailyBlocked = scene?.dailyLimit ? !canDailyDraw(store.daily) : false
  const llmActive = store.useLLM && isLLMReady(store.llm)
  const crisis = useMemo(() => checkCrisis(question), [question])

  if (!scene) return null

  const accentVar = `rgb(var(--c-${scene.accent}))`

  async function finishRitual(drawn: DrawnCard[]) {
    setCards(drawn)
    haptic('success')

    // LLM 轨：接管解读正文（按【标签】解析回结构化卡片），失败静默降级本地轨
    let finalReading: Reading | null = null
    if (llmActive) {
      try {
        const text = await llmChat(store.llm, [
          { role: 'system', content: buildSystemPrompt(persona, scene!, drawn) },
          { role: 'user', content: question || '（用户没有输入具体问题，请针对场景主题直接解读）' },
        ])
        const base = composeReading(scene!, persona, drawn, seed, question)
        const parsed = parseStructuredReading(text)
        finalReading = {
          ...base,
          mode: 'llm',
          tagline: parsed.tagline || base.tagline,
          sections: parsed.sections.length
            ? parsed.sections
            : [{ key: 'llm', label: `${persona.name}的解读`, body: text.split('\n').filter(Boolean) }],
          action: '',
          luck: parsed.luck ?? base.luck,
          reply: undefined,
        }
      } catch {
        finalReading = null
      }
    }
    if (!finalReading) {
      finalReading = composeReading(scene!, persona, drawn, seed, question)
    }

    setReading(finalReading)
    setStage('reading')

    // 记录
    store.addHistory({
      id: `${seed}`,
      date: new Date().toISOString(),
      sceneId: scene!.id,
      personaId: persona.id,
      question,
      headline: finalReading.headline,
      tagline: finalReading.tagline,
      action: finalReading.action,
      cards: drawn.map((d) => ({ id: d.card.id, reversed: d.reversed })),
      mode: finalReading.mode,
    })
    if (scene!.dailyLimit) {
      const d = drawn[0]
      store.markDaily({
        date: todayKey(),
        headline: finalReading.headline,
        tagline: finalReading.tagline,
        banweiIndex: finalReading.banwei?.index,
        cardId: d?.card.id,
        reversed: d?.reversed,
      })
    }
  }

  return (
    <div className="min-h-dvh pb-8">
      {/* 顶部栏 */}
      <div className="sticky top-0 z-40 -mx-5 flex items-center gap-3 border-b border-line bg-bg/85 px-5 py-3 backdrop-blur-lg" style={{ paddingTop: 'max(12px, env(safe-area-inset-top))' }}>
        <button
          onClick={() => {
            if (stage === 'reading' || stage === 'intro') nav('/')
            else setStage(stage === 'ritual' ? 'persona' : 'intro')
          }}
          className="press flex h-9 w-9 items-center justify-center rounded-btn border border-line text-t2"
          aria-label="返回"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M14.5 5.5L8 12l6.5 6.5" />
          </svg>
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="hud-tag" style={{ color: accentVar }}>{scene.motifTag}</span>
            {llmActive && <span className="hud-tag border-acid/40 text-acid">LLM</span>}
          </div>
          <h2 className="mt-0.5 font-display text-[18px] leading-tight" style={{ color: accentVar }}>{scene.name}</h2>
        </div>
      </div>

      {/* 每日限次提示 */}
      {dailyBlocked && stage !== 'reading' ? (
        <div className="mt-6 space-y-4 text-center">
          <span className="text-[44px]" aria-hidden="true">🌙</span>
          <h3 className="font-display text-[20px]">今天的牌已经抽过啦</h3>
          {store.daily?.tagline && <p className="mx-auto max-w-[300px] text-[13px] text-t2">今日定调：{store.daily.tagline}</p>}
          <p className="text-[13px] text-t3">一天一抽才灵。想再玩，去别的场景转转？</p>
          <div className="mx-auto flex max-w-[280px] flex-col gap-2">
            <button onClick={() => nav('/scene/crush')} className="btn-ghost text-magenta" style={{ borderColor: accentVar, color: accentVar }}>
              测测 ta 的意图 ▸
            </button>
            <button onClick={() => nav('/scene/translate')} className="btn-ghost text-cyan" style={{ borderColor: accentVar, color: accentVar }}>
              翻译老板潜台词 ▸
            </button>
            <button onClick={() => nav('/pool')} className="btn-ghost text-violet" style={{ borderColor: accentVar, color: accentVar }}>
              去树洞逛逛 ▸
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-5">
          <AnimatePresence mode="wait">
            {/* 阶段一：输入 */}
            {stage === 'intro' && (
              <motion.div key="intro" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <p className="text-[14px] leading-relaxed text-t2">{scene.desc}</p>
                <label className="mt-5 block font-display text-[16px]">{scene.inputLabel}</label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder={scene.inputHint}
                  maxLength={scene.inputType === 'problem' ? 40 : 100}
                  rows={2}
                  className="mt-2 w-full resize-none rounded-card border border-line bg-surface p-3.5 text-[14px] leading-relaxed text-t1 outline-none placeholder:text-t3 focus:border-cyan/50"
                />
                <div className="mt-1 text-right font-mono text-[10px] text-t3">{question.length}/{scene.inputType === 'problem' ? 40 : 100}</div>

                {crisis && (
                  <div className="mt-3 rounded-card border border-danger/40 bg-danger/10 p-4">
                    <p className="font-display text-[16px] text-danger">{CRISIS_INFO.title}</p>
                    <p className="mt-2 text-[13px] leading-relaxed text-t1">{CRISIS_INFO.body}</p>
                    <ul className="mt-3 space-y-1">
                      {CRISIS_INFO.hotlines.map((h) => (
                        <li key={h.name} className="flex items-center justify-between text-[13px]">
                          <span className="text-t2">{h.name}</span>
                          <span className="font-mono font-bold text-danger">{h.value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {scene.examples.length > 0 && (
                  <div className="mt-4">
                    <p className="hud-tag">试试这些</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {scene.examples.map((ex) => (
                        <button
                          key={ex}
                          onClick={() => {
                            sfx.tap()
                            setQuestion(ex)
                          }}
                          className="press rounded-pill border border-line px-3 py-1.5 text-[12px] text-t2 active:text-t1"
                        >
                          {ex}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  disabled={!!crisis || question.trim().length < 4}
                  onClick={() => {
                    sfx.tap()
                    haptic('light')
                    setStage('persona')
                  }}
                  className="btn-primary mt-6 w-full"
                  style={{ background: accentVar }}
                >
                  下一步 · 选占卜师 ▸
                </button>
                <p className="mt-2 text-center text-[11px] text-t3">输入会被保存在你的设备本地</p>
              </motion.div>
            )}

            {/* 阶段二：人格 */}
            {stage === 'persona' && (
              <motion.div key="persona" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="mb-4">
                  <p className="hud-tag">PICK YOUR ORACLE</p>
                  <h3 className="mt-2 font-display text-[20px]">今晚，想让谁给你解牌？</h3>
                </div>
                <PersonaPicker
                  value={personaId}
                  recommended={RECOMMENDED_PERSONA[scene.id] ?? 'spicy'}
                  onChange={setPersonaId}
                  onConfirm={() => {
                    const rand = makeSeed('draw', seed)
                    setCards(drawCards(rand, scene.spread.count))
                    setStage('ritual')
                  }}
                />
              </motion.div>
            )}

            {/* 阶段三：仪式 */}
            {stage === 'ritual' && cards && (
              <motion.div key="ritual" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <Ritual
                  cards={cards}
                  positions={scene.spread.positions.map((p) => p.label)}
                  accent={scene.accent}
                  onDone={() => void finishRitual(cards)}
                />
              </motion.div>
            )}

            {/* 阶段四：解读 */}
            {stage === 'reading' && reading && (
              <motion.div key="reading" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <ReadingView reading={reading} scene={scene} persona={persona} llm={store.llm} useLLM={llmActive} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
