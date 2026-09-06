/* 剩余流程：Crush / 决策 / 树洞 / 记录 / 设置 / 桌面视口 */
import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const BASE = 'http://localhost:5173'
mkdirSync('shots', { recursive: true })

const errors = []
const browser = await chromium.launch({ executablePath: EDGE, headless: true })
const page = await browser.newPage({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2 })
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(`console: ${m.text()}`)
})

const shot = (name, opts) => page.screenshot({ path: `shots/${name}.png`, ...opts })
const wait = (ms) => page.waitForTimeout(ms)
const gotoHash = async (p) => {
  await page.goto(`${BASE}/#${p}`)
  await wait(700)
}

async function runRitual(cardCount) {
  await page.getByRole('button', { name: '开始洗牌' }).click()
  await wait(2400)
  await page.getByRole('button', { name: '切牌位置 1' }).click()
  await wait(900)
  for (let i = 1; i <= cardCount; i++) {
    await page.getByRole('button', { name: new RegExp(`第 ${i} 张牌`) }).click()
    await wait(750)
  }
  await page.getByRole('button', { name: /揭晓解读/ }).click()
  await wait(1000)
}

async function pickPersona() {
  await page.getByRole('button', { name: /就选 ta，开始仪式/ }).click()
  await wait(600)
}

/* Crush 探针 */
await gotoHash('/scene/crush')
await wait(500)
await page.locator('textarea').fill('已读不回但秒赞我朋友圈')
await shot('11-crush-input')
await page.getByRole('button', { name: /下一步 · 选占卜师/ }).click()
await wait(600)
await pickPersona()
await runRitual(3)
await shot('12-crush-reading', { fullPage: true })
await page.getByRole('button', { name: '给我泼盆冷水吧' }).click()
await wait(800)
await shot('12b-crush-coldwater', { fullPage: true })

/* 危机守护测试 */
await gotoHash('/scene/translate')
await wait(500)
await page.locator('textarea').fill('我不想活了，每天上班太痛苦了')
await wait(400)
await shot('13-crisis-guard', { fullPage: true })

/* 决策天平 */
await gotoHash('/scene/decide')
await wait(500)
await page.locator('textarea').fill('要不要买这件399的外套')
await page.getByRole('button', { name: /下一步 · 选占卜师/ }).click()
await wait(600)
await page.getByRole('button', { name: /神秘赛博巫师/ }).click()
await pickPersona()
await runRitual(1)
await shot('14-decide-reading', { fullPage: true })

/* 树洞 */
await gotoHash('/pool')
await shot('15-pool')
await page.getByRole('button', { name: '捞 ▸' }).click()
await wait(700)
await page.getByPlaceholder('匿名吐槽 / 祝福，50 字内').fill('今天也在工位装死')
await page.getByRole('button', { name: '扔', exact: true }).click()
await wait(500)
await shot('16-pool-done', { fullPage: true })

/* 记录 */
await gotoHash('/history')
await shot('17-history', { fullPage: true })

/* 设置 */
await gotoHash('/settings')
await shot('18-settings', { fullPage: true })

/* 桌面视口抽查 */
await page.setViewportSize({ width: 1024, height: 800 })
await gotoHash('/')
await shot('19-home-desktop')

await browser.close()
console.log('DONE')
if (errors.length) {
  console.log('ERRORS:')
  for (const e of errors) console.log(' -', e)
} else {
  console.log('NO CONSOLE ERRORS')
}
