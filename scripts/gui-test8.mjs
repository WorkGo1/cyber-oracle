/* 验证解读中动画：假 LLM 配置请求挂起期间截屏 */
import { chromium } from 'playwright-core'

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const BASE = 'http://localhost:5173'

const browser = await chromium.launch({ executablePath: EDGE, headless: true })
const page = await browser.newPage({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2 })

await page.goto(`${BASE}/#/settings`)
await page.waitForTimeout(800)
await page.getByPlaceholder('API 地址，如 https://api.openai.com/v1').fill('https://api.openai.com/v1')
await page.getByPlaceholder('API Key（sk-…）').fill('sk-test-123')
await page.getByPlaceholder('模型名，如 gpt-4o-mini').fill('gpt-4o-mini')
await page.getByRole('button', { name: '启用 AI 解读' }).click()
await page.waitForTimeout(300)

// 挂起 LLM 请求 15 秒，截取解读中动画
await page.route('**/chat/completions', () => {})

await page.goto(`${BASE}/#/scene/crush`)
await page.waitForTimeout(900)
await page.locator('textarea').fill('已读不回但秒赞我朋友圈')
await page.getByRole('button', { name: /下一步 · 选占卜师/ }).click()
await page.waitForTimeout(500)
await page.getByRole('button', { name: /就选 ta，开始仪式/ }).click()
await page.waitForTimeout(500)
await page.getByRole('button', { name: '跳过仪式，直接解读' }).click()
await page.waitForTimeout(3200)
await page.screenshot({ path: 'shots/50-divining.png' })
await browser.close()
console.log('DONE')
