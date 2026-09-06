/* 放大检查定调卡裁切问题 */
import { chromium } from 'playwright-core'

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const browser = await chromium.launch({ executablePath: EDGE, headless: true })
const page = await browser.newPage({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 3 })
await page.goto('http://localhost:5173/#/scene/daily')
await page.waitForTimeout(800)
await page.getByRole('button', { name: /就选 ta，开始仪式/ }).click()
await page.waitForTimeout(600)
await page.getByRole('button', { name: '开始洗牌' }).click()
await page.waitForTimeout(2400)
await page.getByRole('button', { name: '切牌位置 2' }).click()
await page.waitForTimeout(900)
await page.getByRole('button', { name: /第 1 张牌/ }).click()
await page.waitForTimeout(900)
await page.getByRole('button', { name: /揭晓解读/ }).click()
await page.waitForTimeout(2500) // 等进度条动画走完
await page.screenshot({ path: 'shots/20-tagline-zoom.png', clip: { x: 0, y: 0, width: 375, height: 420 } })
await browser.close()
console.log('DONE')
