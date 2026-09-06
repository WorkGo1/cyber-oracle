import { Fragment, type ReactNode } from 'react'

/** 清理行内残留 Markdown 符号（单个 *、反引号、井号结尾等） */
function cleanInline(s: string): string {
  return s
    .replace(/(^|\s)#{1,4}(\s|$)/g, '$1')
    .replace(/(^|[^*])\*([^*]|$)/g, '$1$2')
    .replace(/`/g, '')
}

/**
 * 轻量 Markdown 内联渲染：支持 **加粗**，清除残留符号。
 * LLM 输出难免夹带 Markdown，正文里不能让 ** 原样露出。
 */
export function MdText({ text, strongClass = 'font-bold text-t1' }: { text: string; strongClass?: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean)
  const nodes: ReactNode[] = parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**') && p.length > 4) {
      return (
        <strong key={i} className={strongClass}>
          {p.slice(2, -2)}
        </strong>
      )
    }
    return <Fragment key={i}>{cleanInline(p)}</Fragment>
  })
  return <>{nodes}</>
}
