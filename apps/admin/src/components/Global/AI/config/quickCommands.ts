export interface QuickCommand {
  icon: string // Iconify icon name, e.g. 'carbon:task-star'
  label: string // Display text
  query: string // The prompt text sent to AI
}

export const QUICK_COMMANDS: QuickCommand[] = [
  // 示例占位，根据实际 AI 能力添加
  // { icon: 'carbon:task-star', label: '今日任务', query: '今天有哪些任务？' },
]
