/* 完整 UI 链路验证：设置页启用 AI（假地址）→ 抽牌 → 应显示降级说明 */
import { chromium } from 'playwright-core'

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const BASE = 'http://localhost:5173'

const browser = await chromium.launch({ executablePath: EDGE, headless: true })
const page = await browser.newPage({ viewport: { width: 375, height: 812 } })
const wait = (ms) => page.waitForTimeout(ms)

await page.goto(`${BASE}/#/settings`)
await wait(900)
await page.getByPlaceholder('API 地址，如 https://api.openai.com/v1').fill('https://fake.invalid/v1')
await page.getByPlaceholder('API Key（sk-…）').fill('sk-test-123')
await page.getByPlaceholder('模型名，如 gpt-4o-mini').fill('gpt-4o-mini')
await page.getByRole('button', { name: '启用 AI 解读' }).click()
await wait(300)

await page.goto(`${BASE}/#/scene/translate`)
await wait(900)
await page.locator('textarea').fill('你最近工作挺清闲啊？')
await page.getByRole('button', { name: /下一步 · 选占卜师/ }).click()
await wait(500)
await page.getByRole('button', { name: /就选 ta，开始仪式/ }).click()
await wait(500)
await page.getByRole('button', { name: '跳过仪式，直接解读' }).click()
await wait(25000)
const note = await page.getByText(/AI 请求失败/).count()
const badge = await page.getByText('本地解读').count()
console.log('fallback note:', note, '| 本地解读 badge:', badge)
await page.evaluate(() => window.scrollTo(0, 0))
await wait(300)
await page.screenshot({ path: 'shots/41-fallback-note.png' })
await browser.close()
