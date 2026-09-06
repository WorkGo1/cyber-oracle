/** 手机震动反馈：按事件强度给短震；不支持的环境静默 */
export function haptic(pattern: 'light' | 'medium' | 'success' = 'light') {
  if (typeof navigator === 'undefined' || !('vibrate' in navigator)) return
  const map: Record<string, number | number[]> = {
    light: 12,
    medium: 28,
    success: [16, 40, 16],
  }
  try {
    navigator.vibrate(map[pattern])
  } catch {
    /* 静默 */
  }
}
