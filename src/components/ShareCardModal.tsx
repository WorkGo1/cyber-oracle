import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { Reading } from '@/engine/interpret'
import type { SceneConfig } from '@/data/scenes'
import { sfx } from '@/lib/audio'

const W = 1080
const H = 1440

/** 拍立得风分享卡：Canvas 手绘，导出 PNG */
export function ShareCardModal({
  reading,
  scene,
  onClose,
}: {
  reading: Reading
  scene: SceneConfig
  onClose: () => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [fontReady, setFontReady] = useState(false)

  useEffect(() => {
    document.fonts.ready.then(() => setFontReady(true))
  }, [])

  useEffect(() => {
    if (!fontReady) return
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    draw(ctx, reading, scene)
  }, [fontReady, reading, scene])

  const download = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    sfx.tap()
    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = `cyber-oracle-${Date.now()}.png`
    a.click()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[60] flex flex-col items-center overflow-y-auto bg-black/85 p-5 backdrop-blur-md"
      style={{ paddingTop: 'max(24px, env(safe-area-inset-top))' }}
    >
      <div className="mb-3 flex w-full max-w-[420px] items-center justify-between">
        <span className="hud-tag text-acid">SHARE · 赛博神签</span>
        <button onClick={onClose} className="press flex h-9 w-9 items-center justify-center rounded-btn border border-line text-t2" aria-label="关闭">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
      <canvas
        ref={canvasRef}
        className="w-full max-w-[400px] rounded-card shadow-[0_0_50px_rgba(200,255,30,0.25)]"
        style={{ aspectRatio: '3 / 4' }}
      />
      <p className="mt-3 max-w-[400px] text-center text-[12px] leading-relaxed text-t3">
        手机端若下载未响应，可长按上方图片保存
      </p>
      <button onClick={download} className="btn-primary mt-3 w-full max-w-[400px]">
        保存图片 ▸
      </button>
    </motion.div>
  )
}

function draw(ctx: CanvasRenderingContext2D, reading: Reading, scene: SceneConfig) {
  const accentHex: Record<string, string> = {
    acid: '#C8FF1E', cyan: '#22E4FF', magenta: '#FF3DB4', gold: '#FFC838', violet: '#8B5CF6',
  }
  const accent = accentHex[scene.accent] ?? accentHex.acid
  const mainCard = reading.cards[0]
  const reversed = mainCard?.reversed

  // 底色 + 网格
  ctx.fillStyle = '#07070C'
  ctx.fillRect(0, 0, W, H)
  ctx.strokeStyle = 'rgba(200,255,30,0.05)'
  ctx.lineWidth = 2
  for (let x = 0; x <= W; x += 48) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
  }
  for (let y = 0; y <= H; y += 48) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
  }

  // 拍立得白框
  const px = 90
  const py = 110
  const pw = W - px * 2
  const ph = H - py * 2
  roundRect(ctx, px, py, pw, ph, 28)
  ctx.fillStyle = '#F2F2F0'
  ctx.fill()
  ctx.shadowColor = accent
  ctx.shadowBlur = 60
  ctx.fill()
  ctx.shadowBlur = 0

  // 照片区（深色）
  const photoX = px + 55
  const photoY = py + 55
  const photoW = pw - 110
  const photoH = 800
  const grad = ctx.createLinearGradient(photoX, photoY, photoX + photoW, photoY + photoH)
  grad.addColorStop(0, '#10101C')
  grad.addColorStop(1, '#08080F')
  roundRect(ctx, photoX, photoY, photoW, photoH, 14)
  ctx.fillStyle = grad
  ctx.fill()

  ctx.save()
  roundRect(ctx, photoX, photoY, photoW, photoH, 14)
  ctx.clip()

  // 符文环 + 中央牌符
  const cx = photoX + photoW / 2
  const cy = photoY + photoH / 2 - 40
  ctx.strokeStyle = accent
  ctx.globalAlpha = 0.9
  ctx.lineWidth = 3
  ctx.beginPath(); ctx.arc(cx, cy, 190, 0, Math.PI * 2); ctx.stroke()
  ctx.lineWidth = 1.5
  ctx.setLineDash([6, 8])
  ctx.beginPath(); ctx.arc(cx, cy, 150, 0, Math.PI * 2); ctx.stroke()
  ctx.setLineDash([])
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6
    ctx.beginPath()
    ctx.moveTo(cx + Math.cos(a) * 215, cy + Math.sin(a) * 215)
    ctx.lineTo(cx + Math.cos(a) * 232, cy + Math.sin(a) * 232)
    ctx.stroke()
  }
  // 眼睛符文
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.ellipse(cx, cy, 95, 55, 0, 0, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(cx, cy, 34, 0, Math.PI * 2)
  ctx.stroke()
  ctx.fillStyle = accent
  ctx.beginPath()
  ctx.arc(cx, cy, 12, 0, Math.PI * 2)
  ctx.fill()
  ctx.globalAlpha = 1

  // 罗马数字（顶部）
  ctx.fillStyle = accent
  ctx.font = '700 44px Orbitron, monospace'
  ctx.textAlign = 'center'
  ctx.fillText(mainCard?.card.roman ?? '', cx, photoY + 90)
  // 牌名
  ctx.fillStyle = '#F4F4F8'
  ctx.font = '400 84px "ZCOOL QingKe HuangYou", sans-serif'
  ctx.fillText(mainCard?.card.name ?? '', cx, photoY + photoH - 100)
  ctx.fillStyle = 'rgba(244,244,248,0.5)'
  ctx.font = '400 22px "JetBrains Mono", monospace'
  ctx.fillText(`${reversed ? 'REVERSED · 逆位' : 'UPRIGHT · 正位'} — ${mainCard?.card.latin ?? ''}`, cx, photoY + photoH - 52)
  ctx.restore()

  // 白框文字区：人设 + 金句
  ctx.fillStyle = '#0A0A12'
  ctx.textAlign = 'center'
  ctx.font = '400 64px "ZCOOL QingKe HuangYou", sans-serif'
  ctx.fillText(`今日人设：${reading.headline}`, W / 2, photoY + photoH + 130)
  ctx.fillStyle = 'rgba(10,10,18,0.75)'
  ctx.font = '400 34px "PingFang SC", "Microsoft YaHei", sans-serif'
  const quote = clipText(ctx, reading.tagline || reading.action || '把内耗留在今晚', pw - 130)
  quote.forEach((line, i) => ctx.fillText(line, W / 2, photoY + photoH + 195 + i * 48))

  // 底部品牌条
  ctx.fillStyle = 'rgba(10,10,18,0.45)'
  ctx.font = '400 24px "JetBrains Mono", monospace'
  ctx.fillText(`CYBER ORACLE · 赛博神婆  ${new Date().toLocaleDateString('zh-CN')}`, W / 2, H - py - 46)

  // accent 胶带
  ctx.fillStyle = accent
  ctx.save()
  ctx.translate(W / 2, py - 14)
  ctx.rotate(-0.05)
  roundRect(ctx, -120, -18, 240, 36, 6)
  ctx.fill()
  ctx.restore()
}

function clipText(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const lines: string[] = []
  let cur = ''
  for (const ch of text) {
    if (ctx.measureText(cur + ch).width > maxW) {
      lines.push(cur)
      cur = ch
    } else {
      cur += ch
    }
    if (lines.length >= 2) break
  }
  if (cur && lines.length < 2) lines.push(cur)
  return lines
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}
