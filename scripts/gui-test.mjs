/* GUI 黑盒测试脚本：驱动 Edge 无头浏览器走完全部用户旅程并截图 */
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

async function gotoHash(path) {
  await page.goto(`${BASE}/#${path}`)
  await wait(700)
}

async function runRitual(cardCount) {
  await page.getByRole('button', { name: '开始洗牌' }).click()
  await wait(400)
  await shot('x-ritual-shuffle')
  await wait(2000)
  await page.getByRole('button', { name: '切牌位置 2' }).click()
  await wait(900)
  await shot('x-ritual-flip')
  for (let i = 1; i <= cardCount; i++) {
    await page.getByRole('button', { name: new RegExp(`第 ${i} 张牌`) }).click()
    await wait(750)
  }
  await shot('x-ritual-flipped')
  await page.getByRole('button', { name: /揭晓解读/ }).click()
  await wait(1000)
}

async function pickPersona() {
  await page.getByRole('button', { name: /就选 ta，开始仪式/ }).click()
  await wait(600)
}

/* ---------- 1. 首页 ---------- */
await page.goto(BASE + '/')
await wait(1600)
await shot('01-home')

/* ---------- 2. 班味运势全流程 ---------- */
await page.getByRole('button', { name: /打工人班味运势/ }).click()
await wait(800)
await shot('02-daily-persona')
await pickPersona()
await shot('03-daily-shuffle-stage')
await runRitual(1)
await wait(2200); await shot('04-daily-reading', { fullPage: true })

/* 深潜追问 */
await page.getByRole('button', { name: '今天能准点下班吗？' }).click()
await wait(900)
await shot('05-daily-deepdive', { fullPage: true })

/* 分享卡 */
await page.getByRole('button', { name: /生成我的赛博神签/ }).click()
await wait(1200)
await shot('06-daily-sharecard')
await page.getByRole('button', { name: '关闭' }).click()
await wait(500)

/* ---------- 3. 每日限次 ---------- */
await gotoHash('/')
await page.getByRole('button', { name: /打工人班味运势/ }).click()
await wait(700)
await shot('07-daily-limit')
await gotoHash('/')

/* ---------- 4. 潜台词翻译器 ---------- */
await page.getByRole('button', { name: /潜台词翻译/ }).click()
await wait(700)
await shot('08-translate-input')
await page.locator('textarea').fill('你最近工作挺清闲啊？')
await page.getByRole('button', { name: /下一步 · 选占卜师/ }).click()
await wait(600)
await page.getByRole('button', { name: /硬核职场军师/ }).click()
await wait(400)
await pickPersona()
await runRitual(3)
await shot('09-translate-reading', { fullPage: true })
await page.getByRole('button', { name: '那我该怎么回他微信？' }).click()
await wait(800)
await shot('10-translate-followup', { fullPage: true })

/* ---------- 5. Crush 探针 ---------- */
await gotoHash('/')
await page.getByRole('button', { name: /Crush探针/ }).click()
await wait(700)
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

/* ---------- 6. 决策天平 ---------- */
await gotoHash('/')
await page.getByRole('button', { name: /决策天平/ }).click()
await wait(700)
await page.locator('textarea').fill('要不要买这件399的外套')
await page.getByRole('button', { name: /下一步 · 选占卜师/ }).click()
await wait(600)
await pickPersona()
await runRitual(1)
await shot('13-decide-reading', { fullPage: true })

/* ---------- 7. 树洞 ---------- */
await gotoHash('/pool')
await shot('14-pool')
await page.getByRole('button', { name: '捞 ▸' }).click()
await wait(700)
await shot('15-pool-fished', { fullPage: true })
await page.getByPlaceholder('匿名吐槽 / 祝福，50 字内').fill('今天也在工位装死')
await page.getByRole('button', { name: '扔', exact: true }).click()
await wait(500)
await shot('16-pool-thrown', { fullPage: true })

/* ---------- 8. 记录 ---------- */
await gotoHash('/history')
await shot('17-history', { fullPage: true })

/* ---------- 9. 设置 ---------- */
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
