export interface LaborInformation {
    id: number
    laborType: string
    totalWorker: number | null
    monthYear: string | null
    isActive: boolean
    createdBy: string
    createdDate: Date
    updatedBy: string
    updatedDate: Date
    estateId: number
}