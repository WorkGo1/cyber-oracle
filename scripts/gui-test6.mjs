/* LLM 开关修复验证：假配置启用 → 抽牌应显示降级说明 */
import { chromium } from 'playwright-core'

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const BASE = 'http://localhost:5173'
const errors = []

const browser = await chromium.launch({ executablePath: EDGE, headless: true })
const page = await browser.newPage({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2 })
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
page.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text()}`) })
const wait = (ms) => page.waitForTimeout(ms)

/* 设置页：填配置并启用 */
await page.goto(`${BASE}/#/settings`)
await wait(900)
await page.getByPlaceholder('API 地址，如 https://api.openai.com/v1').fill('https://fake.invalid/v1')
await page.getByPlaceholder('API Key（sk-…）').fill('sk-test-123')
await page.getByPlaceholder('模型名，如 gpt-4o-mini').fill('gpt-4o-mini')
await page.getByRole('button', { name: '启用 AI 解读' }).click()
await wait(400)
await page.screenshot({ path: 'shots/40-settings-enabled.png', fullPage: true })

/* 每日抽牌 → 应显示降级说明 */
await page.goto(`${BASE}/#/scene/daily`)
await wait(900)
await page.getByRole('button', { name: /就选 ta，开始仪式/ }).click()
await wait(500)
await page.getByRole('button', { name: '开始洗牌' }).click()
await wait(2400)
await page.getByRole('button', { name: '切牌位置 1' }).click()
await wait(900)
await page.getByRole('button', { name: /第 1 张牌/ }).click()
await wait(900)
await page.getByRole('button', { name: /揭晓解读/ }).click()
await wait(2500)
await page.screenshot({ path: 'shots/41-fallback-note.png' })

await browser.close()
console.log(errors.length ? `ERRORS:\n${errors.join('\n')}` : 'DONE · NO ERRORS')
