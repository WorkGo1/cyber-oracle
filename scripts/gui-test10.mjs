/* 验证解读页牌阵面板：本地轨 3 张牌（含逆位） */
import { chromium } from 'playwright-core'

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const BASE = 'http://localhost:5173'

const browser = await chromium.launch({ executablePath: EDGE, headless: true })
const page = await browser.newPage({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2 })

await page.goto(`${BASE}/#/scene/translate`)
await page.waitForTimeout(900)
await page.locator('textarea').fill('你最近工作挺清闲啊？')
await page.getByRole('button', { name: /下一步 · 选占卜师/ }).click()
await page.waitForTimeout(500)
await page.getByRole('button', { name: /就选 ta，开始仪式/ }).click()
await page.waitForTimeout(500)
await page.getByRole('button', { name: '跳过仪式，直接解读' }).click()
await page.waitForTimeout(1500)
await page.screenshot({ path: 'shots/70-reading-spread.png' })
await browser.close()
console.log('DONE')
