import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { CardBack } from '@/components/TarotCardView'
import { SCENES } from '@/data/scenes'
import { dateLabel } from '@/lib/date'
import { canDailyDraw, useAppStore } from '@/stores/useAppStore'
import { sfx } from '@/lib/audio'
import { haptic } from '@/lib/haptics'

const ACCENT_TEXT: Record<string, string> = {
  acid: 'text-acid',
  cyan: 'text-cyan',
  magenta: 'text-magenta',
  gold: 'text-gold',
}

const stagger = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: [0.2, 0.7, 0.3, 1] as const, delay: i * 0.06 },
  }),
}

export default function Home() {
  const nav = useNavigate()
  const daily = useAppStore((s) => s.daily)
  const dailyDone = !canDailyDraw(daily)

  return (
    <div className="pt-3">
      {/* 品牌区 */}
      <motion.section variants={stagger} custom={0} initial="hidden" animate="show" className="mb-5 pt-[max(14px,env(safe-area-inset-top))]">
        <div className="flex items-center justify-between">
          <h2 className="text-chrome font-display text-[40px] leading-[1.1]">赛博神婆</h2>
          <span className="hud-tag">{dateLabel()}</span>
        </div>
        <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.35em] text-t3">CYBER ORACLE · 防内耗指南</p>
        <p className="mt-2 text-[14px] leading-relaxed text-t2">
          不整玄学黑话，只讲人话。<span className="text-t1">抽张牌，把内耗留在今晚。</span>
        </p>
      </motion.section>

      {/* 每日一抽大卡 */}
      <motion.button
        variants={stagger} custom={1} initial="hidden" animate="show"
        onClick={() => {
          sfx.tap()
          haptic('light')
          nav('/scene/daily')
        }}
        className="holo-border press group relative mb-4 flex w-full items-center gap-4 rounded-card p-4 text-left"
      >
        <div className="h-24 w-[60px] shrink-0 rotate-[-6deg] transition-transform group-hover:rotate-[-2deg]">
          <CardBack />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="hud-tag text-acid">DAILY BREW</span>
            {dailyDone && <span className="hud-tag border-acid/40 text-acid">今日已抽</span>}
          </div>
          <div className="mt-1.5 font-display text-[20px] leading-tight">打工人班味运势</div>
          <p className="mt-1 truncate text-[12px] text-t2">
            {dailyDone ? `今天的牌：${daily?.headline ?? '已抽取'} · 明天再来` : '每日免费一抽 · 班味指数 + 宜忌 + 行动指引'}
          </p>
        </div>
        <span className={`font-cyber text-2xl ${ACCENT_TEXT.acid}`}>▸</span>
      </motion.button>

      {/* 场景矩阵 */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {SCENES.filter((s) => s.id !== 'daily').map((s, i) => (
          <motion.button
            key={s.id}
            variants={stagger} custom={2 + i} initial="hidden" animate="show"
            onClick={() => {
              sfx.tap()
              haptic('light')
              nav(`/scene/${s.id}`)
            }}
            className={`panel press flex min-h-[124px] flex-col items-start p-3.5 text-left`}
          >
            <span className="hud-tag" style={{ color: `rgb(var(--c-${s.accent}))` }}>
              {s.motifTag}
            </span>
            <div className={`mt-2 font-display text-[17px] leading-tight ${ACCENT_TEXT[s.accent]}`}>{s.short}</div>
            <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-t2">{s.desc}</p>
          </motion.button>
        ))}
      </div>

      {/* 树洞入口条 */}
      <motion.button
        variants={stagger} custom={5} initial="hidden" animate="show"
        onClick={() => nav('/pool')}
        className="panel press mt-3 flex w-full items-center gap-3 p-3.5 text-left"
      >
        <span className="text-violet text-xl" aria-hidden="true">◈</span>
        <div className="flex-1">
          <div className="font-display text-[15px] text-violet">赛博能量树洞</div>
          <p className="text-[11px] text-t2">匿名扔一句吐槽，捞一张别人的牌——你不是一个人在熬</p>
        </div>
        <span className="font-cyber text-xl text-violet">▸</span>
      </motion.button>

      <motion.p variants={stagger} custom={6} initial="hidden" animate="show" className="mt-4 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-t3">
        FOR FUN ONLY · 娱乐向内容 · 不构成任何建议
      </motion.p>
    </div>
  )
}
