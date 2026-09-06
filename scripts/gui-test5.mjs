/* 新牌面验证：图鉴 / 仪式翻牌 / 翻译解读去重 */
import { chromium } from 'playwright-core'

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const BASE = 'http://localhost:5173'
const errors = []

const browser = await chromium.launch({ executablePath: EDGE, headless: true })
const page = await browser.newPage({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2 })
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
page.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text()}`) })
const wait = (ms) => page.waitForTimeout(ms)

/* 牌库图鉴 */
await page.goto(`${BASE}/#/history`)
await wait(1000)
await page.getByRole('tab', { name: /牌库图鉴/ }).click()
await wait(1400)
await page.screenshot({ path: 'shots/30-deck-majors.png' })
await page.getByRole('heading').first().waitFor
await page.mouse.wheel(0, 2600)
await wait(600)
await page.screenshot({ path: 'shots/31-deck-minor1.png' })
await page.mouse.wheel(0, 3400)
await wait(600)
await page.screenshot({ path: 'shots/32-deck-courts.png' })

/* 仪式翻牌（每日） */
await page.goto(`${BASE}/#/scene/daily`)
await wait(900)
await page.getByRole('button', { name: /就选 ta，开始仪式/ }).click()
await wait(600)
await page.getByRole('button', { name: '开始洗牌' }).click()
await wait(2400)
await page.getByRole('button', { name: '切牌位置 2' }).click()
await wait(900)
await page.getByRole('button', { name: /第 1 张牌/ }).click()
await wait(1000)
await page.screenshot({ path: 'shots/33-flip-face.png', clip: { x: 0, y: 60, width: 375, height: 480 } })

/* 翻译场景（三张牌 + 去重检查） */
await page.goto(`${BASE}/#/scene/translate`)
await wait(800)
await page.locator('textarea').fill('你最近工作挺清闲啊？')
await page.getByRole('button', { name: /下一步 · 选占卜师/ }).click()
await wait(500)
await page.getByRole('button', { name: /就选 ta，开始仪式/ }).click()
await wait(500)
await page.getByRole('button', { name: '开始洗牌' }).click()
await wait(2400)
await page.getByRole('button', { name: '切牌位置 3' }).click()
await wait(900)
for (let i = 1; i <= 3; i++) {
  await page.getByRole('button', { name: new RegExp(`第 ${i} 张牌`) }).click()
  await wait(700)
}
await page.getByRole('button', { name: /揭晓解读/ }).click()
await wait(1200)
await page.screenshot({ path: 'shots/34-translate-nodup.png', fullPage: true })

await browser.close()
console.log(errors.length ? `ERRORS:\n${errors.join('\n')}` : 'DONE · NO ERRORS')
