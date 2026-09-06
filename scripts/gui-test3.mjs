/* 重截修改过的页面：首页(移动/桌面)、深潜追问 */
import { chromium } from 'playwright-core'

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const BASE = 'http://localhost:5173'

const errors = []
const browser = await chromium.launch({ executablePath: EDGE, headless: true })
const page = await browser.newPage({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2 })
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(`console: ${m.text()}`)
})
const wait = (ms) => page.waitForTimeout(ms)

await page.goto(BASE + '/')
await wait(1600)
await page.screenshot({ path: 'shots/01-home.png' })

/* 进入每日流程到解读页测深潜 chip 消失 */
await page.getByRole('button', { name: /打工人班味运势/ }).click()
await wait(700)
await page.getByRole('button', { name: /就选 ta，开始仪式/ }).click()
await wait(600)
await page.getByRole('button', { name: '开始洗牌' }).click()
await wait(2400)
await page.getByRole('button', { name: '切牌位置 3' }).click()
await wait(900)
await page.getByRole('button', { name: /第 1 张牌/ }).click()
await wait(900)
await page.getByRole('button', { name: /揭晓解读/ }).click()
await wait(1000)
await page.getByRole('button', { name: '今天能准点下班吗？' }).click()
await wait(900)
await page.screenshot({ path: 'shots/05-daily-deepdive.png', fullPage: true })

/* 桌面首页 */
await page.setViewportSize({ width: 1024, height: 800 })
await page.goto(BASE + '/#/')
await wait(1400)
await page.screenshot({ path: 'shots/19-home-desktop.png' })

await browser.close()
console.log('DONE')
console.log(errors.length ? errors.join('\n') : 'NO CONSOLE ERRORS')
