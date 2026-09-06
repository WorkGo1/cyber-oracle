import { useNavigate } from 'react-router-dom'
import { sceneById } from '@/data/scenes'
import { personaById } from '@/data/personas'
import { cardById } from '@/data/deck'
import { useAppStore } from '@/stores/useAppStore'

export default function History() {
  const history = useAppStore((s) => s.history)
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
        <span className="hud-tag text-acid">LOG · 抽牌记录</span>
        <h2 className="mt-2 font-display text-[24px]">你的能量档案</h2>
        <p className="mt-1 text-[12px] text-t3">仅保存在本机 · 最多保留 100 条</p>
      </section>

      {history.length === 0 && (
        <div className="panel mt-6 flex flex-col items-center p-8 text-center">
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
    </div>
  )
}
