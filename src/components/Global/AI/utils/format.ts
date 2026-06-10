import { formatTimeAgoIntl } from '@vueuse/core'
import MarkdownIt from 'markdown-it'
import { FORMAT_CACHE_MAX } from '../config/constants'
import { ensureHljs, getHljs } from '../store/useHighlight'
import { LRUMap } from './cache'

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function escapeText(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>')
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

export function timeAgo(timestamp: number): string {
  return formatTimeAgoIntl(new Date(timestamp), { locale: 'zh-CN' })
}

export function formatDate(isoStr: string): string {
  if (!isoStr || isoStr === '-')
    return '-'
  try {
    const d = new Date(isoStr.replace(/\./g, '-'))
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    const hh = String(d.getHours()).padStart(2, '0')
    const min = String(d.getMinutes()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`
  }
  catch {
    return isoStr
  }
}

export function getStatusClass(code: number): string {
  const map: Record<number, string> = {
    0: 'status-pending',
    1: 'status-running',
    2: 'status-warning',
    3: 'status-success',
    4: 'status-error',
  }
  return map[code] || 'status-default'
}

export type MarkdownSegment
  = | { type: 'text', html: string }
    | { type: 'code', language?: string, code: string }

const formatCache = new LRUMap<string, string>(FORMAT_CACHE_MAX)
const segmentCache = new LRUMap<string, MarkdownSegment[]>(FORMAT_CACHE_MAX)

export function clearFormatCache() {
  formatCache.clear()
  segmentCache.clear()
}

let mdWithHighlight: MarkdownIt | null = null

function getMdWithHighlight(): MarkdownIt {
  if (!mdWithHighlight) {
    mdWithHighlight = new MarkdownIt({
      breaks: true,
      html: false,
      highlight(str, lang) {
        const hljs = getHljs()
        if (lang && hljs?.getLanguage(lang)) {
          try {
            return `<pre><code class="hljs language-${lang}">${hljs.highlight(str, { language: lang }).value}</code></pre>`
          }
          catch {
            return `<pre><code class="hljs">${escapeHtml(str)}</code></pre>`
          }
        }
        return `<pre><code class="hljs">${escapeHtml(str)}</code></pre>`
      },
    })
  }
  return mdWithHighlight
}

// Fast parser without highlight.js — used during streaming to avoid per-chunk re-highlighting
const mdFast = new MarkdownIt({
  breaks: true,
  html: false,
})

const CODE_FENCE_RE = /```(\w*)\n([\s\S]*?)```/g

function normalizeTableRows(lines: string[]): string[] {
  const result: string[] = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const prev = result[result.length - 1] || ''
      if (prev.trim() !== '' && !(prev.trim().startsWith('|') && prev.trim().endsWith('|'))) {
        result.push('')
      }
    }
    result.push(line)
  }
  return result
}

function preprocessMarkdown(content: string): string {
  if (/^<(?:h[1-6]|p|table|ul|ol|div)\b/.test(content))
    return content
  return normalizeTableRows(content.split('\n')).join('\n')
}

export function splitMarkdown(
  content: string,
  cacheKey?: string,
  skipHighlight?: boolean,
): MarkdownSegment[] {
  const effectiveKey = skipHighlight && cacheKey ? `${cacheKey}:nohl` : cacheKey
  if (effectiveKey) {
    const cached = segmentCache.get(effectiveKey)
    if (cached)
      return cached
  }

  const text = content.replace(/<think>[\s\S]*?<\/think>/gi, '').trim()
  if (!skipHighlight && content.includes('```')) {
    ensureHljs()
  }
  const parser = skipHighlight ? mdFast : getMdWithHighlight()
  const segments: MarkdownSegment[] = []
  let lastIndex = 0

  for (const match of text.matchAll(CODE_FENCE_RE)) {
    const before = text.slice(lastIndex, match.index!)
    if (before.trim()) {
      const preprocessed = preprocessMarkdown(before)
      try {
        segments.push({ type: 'text', html: parser.render(preprocessed).trim() })
      }
      catch {
        segments.push({ type: 'text', html: escapeHtml(before).replace(/\n/g, '<br>') })
      }
    }
    segments.push({
      type: 'code',
      language: match[1] || undefined,
      code: match[2],
    })
    lastIndex = match.index! + match[0].length
  }

  const after = text.slice(lastIndex)
  if (after.trim()) {
    const preprocessed = preprocessMarkdown(after)
    try {
      segments.push({ type: 'text', html: parser.render(preprocessed).trim() })
    }
    catch {
      segments.push({ type: 'text', html: escapeHtml(after).replace(/\n/g, '<br>') })
    }
  }

  if (effectiveKey)
    segmentCache.set(effectiveKey, segments)

  return segments
}
