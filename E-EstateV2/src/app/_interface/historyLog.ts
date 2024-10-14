export interface HistoryLog {
    id: number
    entityType: string
    entityId: number | null
    dateTime: Date
    method: string
    body: string
    url: string
    userId: string
}