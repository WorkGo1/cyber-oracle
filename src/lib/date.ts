/** 本地日期键（非 UTC），用于每日一抽限次 */
export function todayKey(d = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function weekdayCn(d = new Date()): string {
  return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][d.getDay()]
}

export function dateLabel(d = new Date()): string {
  return `${todayKey(d)} ${weekdayCn(d)}`
}
