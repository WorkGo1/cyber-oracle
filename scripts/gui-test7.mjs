/* 等待 LLM 超时后截降级说明 */
import { chromium } from 'playwright-core'

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const BASE = 'http://localhost:5173'

const browser = await chromium.launch({ executablePath: EDGE, headless: true })
const page = await browser.newPage({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2 })

// 沿用同一 localStorage：先写入启用状态
await page.goto(`${BASE}/#/settings`)
await page.waitForTimeout(800)
await page.evaluate(() => {
  const raw = localStorage.getItem('cyber-oracle-v1') ?? '{}'
  const state = JSON.parse(raw).state ?? {}
  state.useLLM = true
  state.llm = { baseUrl: 'https://fake.invalid/v1', apiKey: 'sk-test', model: 'gpt-4o-mini' }
  localStorage.setItem('cyber-oracle-v1', JSON.stringify({ ...JSON.parse(raw), state }))
})

await page.goto(`${BASE}/#/scene/translate`)
await page.waitForTimeout(800)
await page.locator('textarea').fill('你最近工作挺清闲啊？')
await page.getByRole('button', { name: /下一步 · 选占卜师/ }).click()
await page.waitForTimeout(500)
await page.getByRole('button', { name: /就选 ta，开始仪式/ }).click()
await page.waitForTimeout(500)
await page.getByRole('button', { name: '跳过仪式，直接解读' }).click()
await page.waitForTimeout(24000)
await page.screenshot({ path: 'shots/41-fallback-note.png' })
await browser.close()
console.log('DONE')
