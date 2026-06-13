export type InsightType = 'warning' | 'success' | 'tip' | 'neutral'

export type Insight = {
  type: InsightType
  title: string
  body: string
  category: string | null
  amount: number | null
}

export type SavingsOpportunity = {
  amount: number
  tip: string
}

export type InsightData = {
  summary: string
  insights: Insight[]
  savingsOpportunity: SavingsOpportunity
  nextMonthForecast: string
}

export type CachedInsight = {
  id: string
  user_id: string
  month: string
  content: string // stored as JSON string in TEXT column, parse with JSON.parse()
  created_at: string
}
