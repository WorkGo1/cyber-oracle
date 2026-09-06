/* 线上站冒烟验证：加载、控制台错误、抽牌流程一遍 */
import { chromium } from 'playwright-core'

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const URL = 'https://workgo1.github.io/cyber-oracle/'

const errors = []
const browser = await chromium.launch({ executablePath: EDGE, headless: true })
const page = await browser.newPage({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2 })
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(`console: ${m.text()}`)
})

await page.goto(URL, { waitUntil: 'domcontentloaded' })
await page.waitForTimeout(2500)
await page.screenshot({ path: 'shots/21-live-home.png' })

// 走一遍班味运势
await page.getByRole('button', { name: /打工人班味运势/ }).click()
await page.waitForTimeout(800)
await page.getByRole('button', { name: /就选 ta，开始仪式/ }).click()
await page.waitForTimeout(600)
await page.getByRole('button', { name: '开始洗牌' }).click()
await page.waitForTimeout(2400)
await page.getByRole('button', { name: '切牌位置 1' }).click()
await page.waitForTimeout(900)
await page.getByRole('button', { name: /第 1 张牌/ }).click()
await page.waitForTimeout(900)
await page.getByRole('button', { name: /揭晓解读/ }).click()
await page.waitForTimeout(2200)
await page.screenshot({ path: 'shots/22-live-reading.png' })

await browser.close()
console.log(errors.length ? `ERRORS:\n${errors.join('\n')}` : 'LIVE OK · NO CONSOLE ERRORS')
