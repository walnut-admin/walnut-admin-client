// src/components/Global/AI/prompts/business/system.ts

/**
 * Build the AI system prompt.
 *
 * To add a new business domain:
 * 1. Define prompt segment functions below (pattern: buildXxxPrompt)
 * 2. Append them in buildSystemPrompt() return value
 *
 * Card types output: {"type":"<type>","category":"card", ...payload fields}
 * Action types output: {"type":"<type>","category":"action", ...payload fields}
 */

export function buildSystemPrompt(_deviceContext?: string): string {
  const base = '你是一个智能助手。请用中文回答。'

  const segments: string[] = [base]

  // ── 业务 prompt 段（按需取消注释并填充）──

  // segments.push(buildNavigatePrompt())
  // segments.push(buildDataQueryPrompt())
  // segments.push(buildReportPrompt())
  // ...

  return segments.join('\n\n')
}

// ── 以下为 prompt 段模板，后续按需启用 ──

// function buildNavigatePrompt(): string {
//   return `【重要-导航】当用户表达页面跳转意图时，输出：
//   {"type":"navigate","category":"action","target":"<页面路由>"}`
// }

// function buildReportPrompt(): string {
//   return `【重要-报告】当用户要求生成报告时，输出：
//   {"type":"report","category":"card","title":"...","htmlContent":"..."}`
// }
