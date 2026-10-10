export type AgentStatus =
  'pending' | 'running' | 'complete' | 'error' | 'cancelled'
export interface AgentTask {
  id: string
  title: string
  description?: string
  status: AgentStatus
  progress?: number
  disabled?: boolean
}
export interface AgentSource {
  id: string
  title: string
  href?: string
  description?: string
  icon?: string
  iconSrc?: string
}
export interface AgentHistoryMessage {
  id: string
  role: 'user' | 'assistant' | 'system' | 'tool'
  content: string
}
export interface AgentAttachment {
  id: string
  name: string
  disabled?: boolean
}
export interface AgentQuestionOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}
export interface AgentQuestion {
  id: string
  title: string
  description?: string
  options: AgentQuestionOption[]
  allowCustom?: boolean
  optional?: boolean
}
export interface AgentAnswer {
  questionId: string
  value: string
  custom?: boolean
}
export interface FileDiffLine {
  type: 'context' | 'add' | 'remove'
  content: string
  oldLine?: number
  newLine?: number
}
