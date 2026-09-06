/** Web Audio 程序化音效：零音频资源，全部合成 */
let ctx: AudioContext | null = null
let enabled = true

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AC) return null
  if (!ctx) ctx = new AC()
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

export function setSoundEnabled(v: boolean) {
  enabled = v
}

/** 白噪声脉冲：洗牌沙沙声 */
function noiseBurst(ac: AudioContext, dur: number, gainVal: number, filterFreq: number) {
  const buf = ac.createBuffer(1, ac.sampleRate * dur, ac.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length)
  }
  const src = ac.createBufferSource()
  src.buffer = buf
  const filter = ac.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = filterFreq
  filter.Q.value = 0.8
  const gain = ac.createGain()
  gain.gain.setValueAtTime(gainVal, ac.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dur)
  src.connect(filter).connect(gain).connect(ac.destination)
  src.start()
}

/** 短促音：切牌/点击 */
function blip(ac: AudioContext, freq: number, dur: number, type: OscillatorType, gainVal: number) {
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, ac.currentTime)
  osc.frequency.exponentialRampToValueAtTime(freq * 0.7, ac.currentTime + dur)
  gain.gain.setValueAtTime(gainVal, ac.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dur)
  osc.connect(gain).connect(ac.destination)
  osc.start()
  osc.stop(ac.currentTime + dur)
}

export const sfx = {
  shuffle() {
    if (!enabled) return
    const ac = getCtx()
    if (!ac) return
    noiseBurst(ac, 0.32, 0.12, 2600)
    setTimeout(() => enabled && getCtx() && noiseBurst(getCtx()!, 0.28, 0.1, 3200), 180)
  },
  cut() {
    if (!enabled) return
    const ac = getCtx()
    if (!ac) return
    blip(ac, 880, 0.09, 'square', 0.06)
    noiseBurst(ac, 0.08, 0.08, 4200)
  },
  flip() {
    if (!enabled) return
    const ac = getCtx()
    if (!ac) return
    blip(ac, 1320, 0.07, 'triangle', 0.08)
  },
  reveal() {
    if (!enabled) return
    const ac = getCtx()
    if (!ac) return
    blip(ac, 520, 0.24, 'sine', 0.1)
    setTimeout(() => getCtx() && blip(getCtx()!, 780, 0.3, 'sine', 0.08), 120)
  },
  tap() {
    if (!enabled) return
    const ac = getCtx()
    if (!ac) return
    blip(ac, 660, 0.05, 'square', 0.04)
  },
}
