declare interface IAIMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  thinkingContent?: string
  businessContent?: IAIBusinessContent
  timestamp: Date
  interrupted?: boolean
}

declare interface IAIConversation {
  id: string
  title: string
  messages: IAIMessage[]
  createdAt: number
  updatedAt: number
}
