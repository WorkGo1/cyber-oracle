/** 危机信号守护：命中即中断解读，展示援助信息 */
const CRISIS_RE = /(自杀|轻生|不想活|想去死|想死|自残|伤害自己|了结|活不下去|没有意义了|跳楼|割腕)/

export function checkCrisis(text: string): boolean {
  return CRISIS_RE.test(text)
}

export const CRISIS_INFO = {
  title: '先停一下，我们想说件更重要的事',
  body: '你现在的感受是真实且重要的，但它值得被认真对待，而不只是一次塔罗解读。请让身边可信的人知道你的状态，或直接联系专业援助——这不丢人，这是对自己最大的负责。',
  hotlines: [
    { name: '全国统一心理援助热线', value: '12356（24小时）' },
    { name: '北京心理危机研究与干预中心', value: '010-82951332' },
    { name: '希望24热线', value: '400-161-9995' },
  ],
}
