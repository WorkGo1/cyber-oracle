import { useState } from 'react'
import { PERSONAS } from '@/data/personas'
import { isLLMReady, llmChat, type LLMConfig } from '@/engine/llm'
import { useAppStore } from '@/stores/useAppStore'

function Toggle({
  checked,
  onChange,
  label,
  desc,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  desc: string
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-3 py-1 text-left"
      role="switch"
      aria-checked={checked}
    >
      <span className="min-w-0">
        <span className="block text-[14px] text-t1">{label}</span>
        <span className="mt-0.5 block text-[11px] text-t3">{desc}</span>
      </span>
      <span
        className={`relative h-7 w-12 shrink-0 rounded-pill border transition-colors ${
          checked ? 'border-acid/60 bg-acid/20' : 'border-line bg-surface2'
        }`}
      >
        <span
          className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full transition-all ${
            checked ? 'left-[calc(100%-22px)] bg-acid shadow-glow-acid' : 'left-0.5 bg-t3'
          }`}
        />
      </span>
    </button>
  )
}

export default function Settings() {
  const store = useAppStore()
  const [draft, setDraft] = useState<LLMConfig>(store.llm)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState('')

  async function testLLM() {
    setTesting(true)
    setTestResult('')
    try {
      const reply = await llmChat(draft, [
        { role: 'user', content: '回复两个字：连通' },
      ], 12000)
      setTestResult(`✓ 连通成功：${reply.slice(0, 30)}`)
    } catch (e) {
      setTestResult(`✗ 连通失败：${e instanceof Error ? e.message : '未知错误'}`)
    } finally {
      setTesting(false)
    }
  }

  const llmReady = isLLMReady(draft)

  return (
    <div className="space-y-4 pt-3">
      <section>
        <span className="hud-tag text-acid">SETTINGS</span>
        <h2 className="mt-2 font-display text-[24px]">调教你的神婆</h2>
      </section>

      <section className="panel space-y-3 p-4">
        <span className="hud-tag">仪式感</span>
        <Toggle
          checked={store.soundOn}
          onChange={(v) => {
            store.setSound(v)
          }}
          label="音效"
          desc="洗牌沙沙声、翻牌脆响（Web Audio 合成）"
        />
        <div className="border-t border-line" />
        <Toggle
          checked={store.hapticOn}
          onChange={store.setHaptic}
          label="震动反馈"
          desc="手机上的仪式感加倍（需设备支持）"
        />
      </section>

      <section className="panel p-4">
        <span className="hud-tag">默认占卜师</span>
        <div className="mt-2.5 grid grid-cols-2 gap-2">
          {PERSONAS.map((p) => (
            <button
              key={p.id}
              onClick={() => store.setPersona(p.id)}
              className={`press flex items-center gap-2 rounded-btn border p-2.5 text-left ${
                store.personaId === p.id ? 'border-acid/60 bg-acid/5' : 'border-line'
              }`}
            >
              <span className="text-[20px]" aria-hidden="true">{p.avatar}</span>
              <span className={`text-[12px] leading-tight ${store.personaId === p.id ? 'text-acid' : 'text-t1'}`}>{p.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="panel space-y-3 p-4">
        <div className="flex items-center justify-between">
          <span className="hud-tag">LLM 实时解读（可选）</span>
          <button
            onClick={() => {
              store.setUseLLM(!store.useLLM)
              store.setLLM(draft)
            }}
            disabled={!llmReady}
            className={`press rounded-pill border px-3 py-1 text-[11px] ${
              store.useLLM && llmReady ? 'border-acid/60 bg-acid/15 text-acid' : 'border-line text-t3'
            } disabled:opacity-40`}
          >
            {store.useLLM && llmReady ? '已开启' : '未开启'}
          </button>
        </div>
        <p className="text-[11px] leading-relaxed text-t3">
          接入任意 OpenAI 兼容接口后，解读将由 AI 实时生成。Key 仅存本机 localStorage，仅发往你填写的地址。不填则始终使用内置本地解读引擎。
        </p>
        <input
          value={draft.baseUrl}
          onChange={(e) => setDraft({ ...draft, baseUrl: e.target.value })}
          placeholder="API 地址，如 https://api.openai.com/v1"
          className="min-h-[44px] w-full rounded-btn border border-line bg-bg px-3 font-mono text-[12px] text-t1 outline-none placeholder:text-t3 focus:border-acid/50"
        />
        <input
          value={draft.apiKey}
          onChange={(e) => setDraft({ ...draft, apiKey: e.target.value })}
          placeholder="API Key（sk-…）"
          type="password"
          className="min-h-[44px] w-full rounded-btn border border-line bg-bg px-3 font-mono text-[12px] text-t1 outline-none placeholder:text-t3 focus:border-acid/50"
        />
        <input
          value={draft.model}
          onChange={(e) => setDraft({ ...draft, model: e.target.value })}
          placeholder="模型名，如 gpt-4o-mini"
          className="min-h-[44px] w-full rounded-btn border border-line bg-bg px-3 font-mono text-[12px] text-t1 outline-none placeholder:text-t3 focus:border-acid/50"
        />
        <div className="flex gap-2">
          <button
            onClick={() => {
              store.setLLM(draft)
              void testLLM()
            }}
            disabled={testing || !llmReady}
            className="btn-ghost flex-1 text-[13px] text-acid"
            style={{ borderColor: 'rgb(var(--c-acid))' }}
          >
            {testing ? '测试中…' : '保存并测试'}
          </button>
        </div>
        {testResult && <p className="font-mono text-[11px] text-t2">{testResult}</p>}
      </section>

      <section className="panel p-4">
        <span className="hud-tag">关于 · 免责声明</span>
        <div className="mt-2 space-y-2 text-[12px] leading-relaxed text-t2">
          <p>赛博神婆 v0.1.0 —— 当代年轻人的赛博防内耗指南 & 情绪投射镜。</p>
          <p>所有解读均为娱乐向内容与情绪陪伴，不构成医疗、心理、法律、投资或任何专业建议。重大决策请相信你自己的脑子，必要时咨询专业人士。</p>
          <p>你的抽牌记录、输入与配置全部保存在本机浏览器；卸载/清缓存即消失。</p>
        </div>
      </section>
    </div>
  )
}
