/* 验证 Markdown 输出的解析与渲染：拦截 API 返回 **标题** 格式的模拟响应 */
import { chromium } from 'playwright-core'

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const BASE = 'http://localhost:5173'

const MOCK = {
  id: 'mock', object: 'chat.completion', created: 1, model: 'gpt-4o-mini',
  choices: [{
    index: 0, finish_reason: 'stop',
    message: {
      role: 'assistant',
      content:
        '收到牌面，以下是局势研判。安全气囊弹出前那一下——"先坐稳，有话要来。"\n\n' +
        '**表面态度**\n这句话听上去像闲聊，但配上**高塔正位**的牌，更像是提醒：有变动要来。\n\n' +
        '**真实潜台词**\n他可能觉得你不够忙，或对你这周的状态有点"小结号"。宝剑九逆位说明你心里可能已经慌了——别慌，牌面没到天塌。\n\n' +
        '**应对打法**\n带着"我没虚度"的事实，趁机主动对齐方向：把最近手上的事、进度、下一步打算用两三句说清。\n\n' +
        '**高情商回复示例**\n"哈哈收到您的雷达提醒～最近手头主要是A和B在推进，确实没排到冒烟程度，接下来是把A提前还是您那边有更急的优先级呀？"\n\n' +
        '**幸运补给：**\n今天下班前，把电脑桌面和微信聊天列表清理干净，只留三个最重要的任务图标。',
    },
  }],
  usage: { total_tokens: 300 },
}

const browser = await chromium.launch({ executablePath: EDGE, headless: true })
const page = await browser.newPage({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2 })
await page.goto(`${BASE}/#/settings`)
await page.waitForTimeout(800)
await page.getByPlaceholder('API 地址，如 https://api.openai.com/v1').fill('https://api.openai.com/v1')
await page.getByPlaceholder('API Key（sk-…）').fill('sk-test-123')
await page.getByPlaceholder('模型名，如 gpt-4o-mini').fill('gpt-4o-mini')
await page.getByRole('button', { name: '启用 AI 解读' }).click()
await page.waitForTimeout(300)

await page.route('**/chat/completions', async (route) => {
  await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK) })
})

await page.goto(`${BASE}/#/scene/translate`)
await page.waitForTimeout(900)
await page.locator('textarea').fill('你最近工作挺清闲啊？')
await page.getByRole('button', { name: /下一步 · 选占卜师/ }).click()
await page.waitForTimeout(500)
await page.getByRole('button', { name: /就选 ta，开始仪式/ }).click()
await page.waitForTimeout(500)
await page.getByRole('button', { name: '跳过仪式，直接解读' }).click()
await page.waitForTimeout(2500)

const literalMd = await page.getByText(/\*\*/).count()
const sections = await page.getByText('真实潜台词', { exact: true }).count()
console.log('literal ** 残留:', literalMd, '| 结构化段落(真实潜台词):', sections)
await page.screenshot({ path: 'shots/60-llm-md.png' })
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
await page.waitForTimeout(400)
await page.screenshot({ path: 'shots/61-llm-md-bottom.png' })
await browser.close()
console.log('DONE')
