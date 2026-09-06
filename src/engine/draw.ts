import { DECK } from '@/data/deck'
import type { DrawnCard } from '@/data/types'
import { mulberry32, shuffle } from '@/lib/rng'

/** 抽 N 张：洗牌 + 随机正逆位（逆位率约 32%）。种子决定整局结果 */
export function drawCards(seed: number, count: number): DrawnCard[] {
  const rand = mulberry32(seed)
  const shuffled = shuffle(rand, DECK)
  return shuffled.slice(0, count).map((card) => ({
    card,
    reversed: rand() < 0.32,
  }))
}
