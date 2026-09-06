import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { Persona } from '@/data/personas'
import { CardBack } from '@/components/TarotCardView'

const MESSAGES = [
  '正在连接赛博星轨…',
  '正在解析牌面符号…',
  '正在把塔罗翻译成人话…',
  '正在注入人格语气…',
  '神婆在掐指一算，别急…',
]

/** AI 解读等待动画：旋转符文环 + 悬浮牌 + 轮播状态 + 计时 */
export function Divining({ persona, accentColor }: { persona: Persona; accentColor: string }) {
  const [tick, setTick] = useState(0)
  const [sec, setSec] = useState(0)

  useEffect(() => {
    const msgs = setInterval(() => setTick((t) => t + 1), 2400)
    const timer = setInterval(() => setSec((s) => s + 1), 1000)
    return () => {
      clearInterval(msgs)
      clearInterval(timer)
    }
  }, [])

  return (
    <div className="flex flex-col items-center pt-8 text-center">
      <div className="relative flex h-[230px] w-[230px] items-center justify-center">
        {/* 外圈：逆向刻度环 */}
        <motion.svg
          viewBox="-62 -62 124 124"
          className="absolute inset-0 h-full w-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 30, ease: 'linear', repeat: Infinity }}
          aria-hidden="true"
        >
          <g stroke={accentColor} fill="none" opacity={0.35}>
            {Array.from({ length: 24 }, (_, i) => (
              <line key={i} x1={0} y1={-58} x2={0} y2={-52} strokeWidth={1.2} transform={`rotate(${i * 15})`} />
            ))}
          </g>
        </motion.svg>
        {/* 中圈：顺时针符文环 */}
        <motion.svg
          viewBox="-62 -62 124 124"
          className="absolute inset-0 h-full w-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 14, ease: 'linear', repeat: Infinity }}
          aria-hidden="true"
        >
          <g stroke={accentColor} fill="none">
            <circle r={54} strokeWidth={1.1} strokeDasharray="7 9" opacity={0.6} />
            <circle r={46} strokeWidth={0.7} strokeDasharray="2 4" opacity={0.45} />
            <path d="M 0 -62 L 0 -48 M 0 48 L 0 62" strokeWidth={1.4} opacity={0.9} />
          </g>
        </motion.svg>
        {/* 悬浮的牌 */}
        <motion.div
          className="h-[136px] w-[85px]"
          animate={{ y: [0, -9, 0], rotate: [-2.5, 2.5, -2.5] }}
          transition={{ duration: 3.2, ease: 'easeInOut', repeat: Infinity }}
        >
          <CardBack />
        </motion.div>
      </div>

      <div className="mt-7 flex items-center gap-2">
        <span className="text-[22px]" aria-hidden="true">{persona.avatar}</span>
        <span className="font-display text-[19px]" style={{ color: accentColor }}>
          {persona.name} · 解读中
        </span>
      </div>
      <motion.p
        key={tick}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-2.5 h-5 text-[13px] text-t2"
      >
        {MESSAGES[tick % MESSAGES.length]}
      </motion.p>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-t3">
        ELAPSED {String(sec).padStart(2, '0')}S · LLM 实时生成
      </p>
      <p className="mt-4 max-w-[260px] font-mono text-[9px] uppercase leading-relaxed tracking-[0.15em] text-t3">
        超时上限 2 分钟 · 失败自动回退本地引擎
      </p>
    </div>
  )
}
