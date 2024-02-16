export interface UserActivityLog {
    id: number
    userId: string | null
    userName: string
    role: string
    dateTime: Date
    method: string
    body: string
    url: string
}